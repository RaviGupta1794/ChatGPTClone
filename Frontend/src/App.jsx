import React, { useState } from "react";
import "./App.css";
import ChatWindow from "./ChatWindow.jsx";
import Sidebar from "./Sidebar.jsx";
import MyContext from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);

  const [currThreadId, setCurrThreadId] = useState(uuidv4());

  const [prevChat, setPrevChat] = useState([]);

  const [newChat, setNewChat] = useState(true);

  const [allThread, setAllThread] = useState([]);

  const [chatStartTime, setChatStartTime] = useState(new Date());

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  // authentication popup states
  const [showAuth, setShowAuth] = useState(() => {
    const token = localStorage.getItem("token");

    // if user already logged in don't show popup
    return !token;
  });
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [authPage, setAuthPage] = useState("signup");
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

 const showAlert = (type, message) => {
  console.log(type,message);
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
  const providerValues = {
    prompt,
    setPrompt,

    reply,
    setReply,

    currThreadId,
    setCurrThreadId,

    newChat,
    setNewChat,

    prevChat,
    setPrevChat,

    allThread,
    setAllThread,

    chatStartTime,
    setChatStartTime,

    // auth
    showAuth,
    setShowAuth,

    authPage,
    setAuthPage,

    currentUser,
    setCurrentUser,

    logoutUser,
    
    //alert messages
    alert,
    showAlert,
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar />

        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
