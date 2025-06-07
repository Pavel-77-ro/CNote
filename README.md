# CNote: Cornell Note Taking Application

## Overview

CNote is a full‑stack note‑taking application designed around the Cornell Note Taking method. It allows users to securely sign up, log in, and organize their notes into folders. Users can create, edit, move, and delete both folders and notes using a responsive interface built with Vue.js and TipTap for rich text editing. The backend is built with Node.js/Express and MongoDB, using JWT for authentication.

## Features

- **User Authentication:**  
  - Secure user registration and login using JWT and refresh tokens.  
  - Passwords are hashed using bcrypt.

- **Note Management:**  
  - Create, edit, move, and delete notes.  
  - Rich text editing with TipTap, divided into keywords, main notes, and summary (Cornell method).  
  - Auto‑saving with keyboard shortcuts (e.g., Ctrl+S).

- **Folder Management:**  
  - Create, rename, move, and delete folders.  
  - Nested folder structure (up to 3 levels).  
  - Automatic re‑parenting of notes when a folder is deleted (with a dedicated “Others” category for orphaned notes).

- **Responsive Design:**  
  - Optimized for desktop and mobile.  
  - Custom mobile menus (hamburger for folder navigation, slide‑in toolbars, etc.).

- **API & Documentation:**  
  - RESTful API documented with Swagger.  
  - Endpoints for authentication, folders, and notes.

- **Notifications & Validation:**  
  - Inline client‑side validations for form fields.  
  - Toast notifications for server‑side errors (e.g., duplicate usernames, invalid inputs).

## Technology Stack

- **Frontend:**  
  - Vue.js 3 (Composition API)  
  - Vite  
  - Pinia for state management  
  - Axios for HTTP requests  
  - TipTap for rich text editing  
  - TailwindCSS for styling
  - Vitest for testing

- **Backend:**  
  - Node.js & Express  
  - MongoDB & Mongoose  
  - JWT & bcrypt for authentication and security  
  - Swagger‑UI for API documentation
  - Jest & Supertest for testing

## Installation

### Prerequisites

- Node.js (v14+ recommended)
- npm (or yarn)
- MongoDB (local instance or connection string)

### Backend Setup

1. Navigate to the `backend` directory:
   cd backend
2. Install dependencies with `npm install`
3. Type `npm start` for starting the server on port 5000
4. Type `npm test` for running the endpoint tests
5. Create a `.env` file with 
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_jwt_refresh_secret

### Frontend Setup

1. Navigate to the `frontend` directory:
   cd frontend
2. Install dependencies with `npm install`
3. Type `npm run dev` for starting the client on port 3000
4. Type `npm run test` for running the proof of concept tests for FolderSystem component