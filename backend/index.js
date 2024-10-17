require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

// Models
const User = require("./models/user.model");
const Note = require("./models/note.model");

// Connect to MongoDB
mongoose
  .connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err.message));

// Express app setup
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());


// Test route
app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName)
    return res.status(400).json({ error: true, message: "Name is required" });
  if (!email)
    return res.status(400).json({ error: true, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });

  const isUser = await User.findOne({ email });
  if (isUser) return res.json({ error: true, message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ fullName, email, password: hashedPassword });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.json({
    error: false,
    message: "User created successfully",
    accessToken,
    user,
  });
});

// Get user info
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) return res.sendStatus(401);

  res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email)
    return res.status(400).json({ error: true, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });

  const userInfo = await User.findOne({ email });
  if (!userInfo) return res.json({ error: true, message: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, userInfo.password);
  if (!isPasswordValid)
    return res
      .status(401)
      .json({ error: true, message: "Password is incorrect" });

  const accessToken = jwt.sign(
    { user: userInfo },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  res.json({
    error: false,
    message: "User logged in successfully",
    accessToken,
    userInfo,
  });
});

// Add note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title)
    return res.status(400).json({ error: true, message: "Title is required" });
  if (!content)
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
      isPinned: isPinned || false,
    });
    await note.save();
    res.json({ error: false, message: "Note added successfully", note });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

// Edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags)
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found" });
    if (note.userId.toString() !== user._id.toString())
      return res.status(403).json({ error: true, message: "Forbidden" });

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();
    res.json({ error: false, message: "Note updated successfully", note });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

// Get notes
app.get("/get-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    res.json({ error: false, notes, message: "Notes retrieved successfully" });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

// Delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found" });

    await note.deleteOne();
    res.json({ error: false, message: "Note deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

// Update note pin status
app.put("/update-pin-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found" });
    if (note.userId.toString() !== user._id.toString())
      return res.status(403).json({ error: true, message: "Forbidden" });

    note.isPinned = isPinned || false;
    await note.save();
    res.json({ error: false, message: "Note updated successfully", note });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

// Search notes
app.get("/search-notes", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { user } = req.user;
  if (!query)
    return res
      .status(400)
      .json({ error: true, message: "Search query required" });

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
        { tags: { $regex: new RegExp(query, "i") } },
      ],
    });
    res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes retrieved successfully",
    });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
