# Notes-App

Notes-App is a robust and scalable note-taking application, featuring a backend built with Express and MongoDB, and a modern frontend powered by React and Vite. The app enables users to create, read, update, and delete notes with a smooth, user-friendly interface. 

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- User authentication (signup, login) using JWT.
- Create, read, update, and delete notes.
- Secure password hashing with bcrypt.
- Responsive UI with TailwindCSS.
- Cross-platform support.
- Notes organized by creation date with Moment.js.
- Smooth animations using Framer Motion.

## Tech Stack

### Backend
- **Node.js**: Runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storage.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT (jsonwebtoken)**: Secure user authentication.
- **bcryptjs**: Password hashing.

### Frontend
- **React**: Component-based JavaScript library for building user interfaces.
- **Vite**: Frontend build tool.
- **TailwindCSS**: Utility-first CSS framework.
- **Framer Motion**: Animations for React.
- **Axios**: Promise-based HTTP client for the browser.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a locally running MongoDB instance.
- [Vite](https://vitejs.dev/)

### Installation

Clone this repository:

```bash
https://github.com/souvik-basak/notes-app.git
cd notes-app
```
### Backend Setup

Navigate to the backend directory:
```bash
cd backend
```
Install dependencies:

```bash
npm install
```

Create a .env file in the root directory of the backend and add the following:

```makefile
ACCESS_TOKEN_SECRET=your_secret_key
MONGODB_URI=your_mongodb_connection_string
PORT=8000
```

Start the backend server:

```bash
npm run dev
```

### Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

### Usage

- Navigate to http://localhost:5173 to access the application.
- Create an account, log in, and start managing your notes!


## API Endpoints

### Authentication

#### User

- POST /create-account : Create a new user account.
- POST /login : Authenticate user and receive an access token.

Notes

- GET /get-notes : Retrieve all notes for the authenticated user.
- POST /add-note : Create a new note.
- PUT /edit-note/:id : Update an existing note.
- DELETE /delete-note/:id : Delete a specific note.

  
## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries, please contact:

Author: Souvik Basak
Email: souvik.basak2404@gmail.com
