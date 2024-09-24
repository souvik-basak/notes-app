import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { motion } from "framer-motion";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import startNote from "../../assets/startNote.png";
import searchNotFound from "../../assets/search not found.webp";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const noteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShow: false,
    type: "ADD",
    data: null,
  });

  const [showToastMessage, setShowToastMessage] = useState({
    isShown: false,
    type: "ADD",
    message: "",
  });

  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const showToastMsg = (message, type) => {
    setShowToastMessage({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMessage({ isShown: false, message: "" });
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShow: true, type: "EDIT", data: noteDetails });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const deleteNote = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && response.data.message) {
        showToastMsg("Note deleted successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("error", error.response.data.message);
      }
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get(`/search-notes?query=${query}`);
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("error", error.response.data.message);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    const isPinned = !noteData.isPinned;
    try {
      const response = await axiosInstance.put(`/update-pin-note/${noteId}`, {
        isPinned,
      });
      if (response.data && response.data.note) {
        showToastMsg("Note pin updated successfully", "success");
        getAllNotes();
      }
    } catch (error) {
      console.log("error", error.response.data.message);
    }
  };

  const handleClearSearch = async () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  const containerRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDragConstraints({
        left: -width / 2,
        top: -height / 2,
        right: width / 2,
        bottom: height / 2,
      });
    }
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto flex flex-col h-screen">
        {/* Make note container scrollable */}
        <motion.div
          className="grid grid-cols-3 gap-4 m-8 flex-2 overflow-y-hidden overflow-x-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          // ref={containerRef}
        >
          {allNotes.length > 0 ? (
            allNotes.map((item, index) => (
              <motion.div
                key={item._id}
                // drag
                // dragElastic={1}
                variants={noteVariants}
                style={{ cursor: "grab" }}
                dragTransition={{
                  power: 0.3,
                  timeConstant: 200,
                  bounceStiffness: 100,
                  bounceDamping: 10,
                }}
                dragConstraints={dragConstraints}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  mass: 0.5,
                }}
                whileHover={{
                  scale: 1.01,
                  transition: { duration: 0.3, ease: "easeInOut" },
                }}
                whileTap={{
                  scale: 1,
                  transition: { duration: 0.2, ease: "easeInOut" },
                }}
              >
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateIsPinned(item)}
                />
              </motion.div>
            ))
          ) : (
            <EmptyCard
            // imgSrc={startNote}
            // message={
            // "Start creating your first note! Click the 'ADD' button to note down your thoughts, ideas and reminders. Let's get Started!"
            // }
            />
          )}
        </motion.div>

        {/* Fixed add button */}
        <button
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-6 bottom-6 z-50"
          onClick={() =>
            setOpenAddEditModal({ isShow: true, type: "ADD", data: null })
          }
        >
          <MdAdd className="text-[32px] text-white" />
        </button>
      </div>

      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={() =>
          setOpenAddEditModal({ isShow: false, type: "ADD", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 99999,
          },
        }}
        contentLabel="Add/Edit Notes"
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-y-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShow: false, type: "ADD", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMsg={showToastMsg}
        />
      </Modal>

      <Toast
        message={showToastMessage.message}
        isShown={showToastMessage.isShown}
        type={showToastMessage.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
