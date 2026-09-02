import React, { useState } from "react";
import "./App.css";
import ChatWindow from "./ChatWindow.jsx";
import Sidebar from "./Sidebar.jsx";
import MyContext from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  // ==========================
  // CHAT STATES
  // ==========================

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);

  const [currThreadId, setCurrThreadId] = useState(uuidv4());

  const [prevChat, setPrevChat] = useState([]);

  const [newChat, setNewChat] = useState(true);

  const [allThread, setAllThread] = useState([]);

  const [chatStartTime, setChatStartTime] = useState(new Date());

  // ==========================
  // SIDEBAR
  // ==========================

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ==========================
  // USER
  // ==========================

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // ==========================
  // AUTH
  // ==========================

  const [showAuth, setShowAuth] = useState(() => {
    const token = localStorage.getItem("token");
    return !token;
  });

  const [authPage, setAuthPage] = useState("signup");

  // ==========================
  // ALERT
  // ==========================

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  // ==========================
  // LOGOUT
  // ==========================

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);

    setAllThread([]);
    setPrevChat([]);

    setReply(null);
    setPrompt("");

    setNewChat(true);

    setCurrThreadId(uuidv4());

    setShowAuth(false);
  };

  // ==========================
  // ALERT
  // ==========================

  const showAlert = (type, message) => {
    setAlert({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setAlert({
        show: false,
        type: "",
        message: "",
      });
    }, 3000);
  };

  // ==========================
  // CONTEXT
  // ==========================

  const providerValues = {
    // Chat
    prompt,
    setPrompt,

    reply,
    setReply,

    currThreadId,
    setCurrThreadId,

    prevChat,
    setPrevChat,

    newChat,
    setNewChat,

    allThread,
    setAllThread,

    chatStartTime,
    setChatStartTime,

    // Auth
    showAuth,
    setShowAuth,

    authPage,
    setAuthPage,

    currentUser,
    setCurrentUser,

    logoutUser,

    // Alert
    alert,
    showAlert,

    // Sidebar
    sidebarOpen,
    setSidebarOpen,
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>

        {/* SIDEBAR */}
        {sidebarOpen && <Sidebar />}

        {/* CHAT WINDOW */}
        <ChatWindow />

      </MyContext.Provider>
    </div>
  );
}