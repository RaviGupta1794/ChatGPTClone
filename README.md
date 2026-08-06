# 🤖 MyOwnGPT - AI Chat Application

MyOwnGPT is a full-stack AI-powered chat application inspired by ChatGPT. It allows users to create conversations, interact with an AI assistant, save chat history, and manage their accounts securely.

# 🚀 Live Demo

Frontend:
[Open MyOwnGPT](https://chat-gpt-clone-puce-phi.vercel.app/)

Backend:
[Render API](https://chatgptclone-r9eu.onrender.com)

---

# ✨ Features

## 🔐 Authentication

* User Signup and Login
* JWT-based authentication
* Secure password hashing using bcrypt
* User profile with first-letter avatar
* Logout functionality

## 💬 AI Chat

* Chat with AI assistant
* Gemini API integration
* Real-time responses
* Loading animation while generating responses
* Markdown formatted AI responses

## 🗂️ Chat History

* Create new conversations
* Automatically save conversations
* View previous chats
* Switch between different conversations
* Delete chat history

## 🎨 User Interface

* ChatGPT-like interface
* Responsive design
* Profile dropdown menu
* Login/Signup popup
* Custom alerts and animations

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* CSS
* React Context API
* React Markdown
* React Spinners

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## AI Integration

* Google Gemini API

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# 📂 Project Structure

```
ChatGPTClone
│
├── Backend
│   ├── models
│   ├── routes
│   ├── utils
│   ├── Server.js
│   └── package.json
│
└── Frontend
    ├── src
    │   ├── components
    │   ├── assets
    │   ├── App.jsx
    │   └── main.jsx
    │
    └── package.json
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/RaviGupta1794/ChatGPTClone.git
```

---

# Backend Setup

Navigate to backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start backend:

```bash
npm start
```

Backend runs on:

```
http://localhost:8080
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:8080
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔄 Application Flow

```
React Frontend
       |
       |
       ↓
Express Backend
       |
       |
       ↓
MongoDB Atlas
       |
       |
       ↓
Google Gemini API
```

---

# 🔒 Security

* Environment variables used for sensitive information
* JWT tokens for authentication
* Passwords stored using hashing
* Protected API routes

---

# 📸 Screenshots

(Add your application screenshots here)

---

# 🔮 Future Improvements

* Image generation support
* Image upload and analysis
* Camera access
* Voice input/output
* File upload support
* Payment gateway integration
* Multiple AI model support

---

# 👨‍💻 Author

**Ravi Gupta**

GitHub:
https://github.com/RaviGupta1794

---

⭐ If you like this project, consider giving it a star!
