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


  // authentication popup states
  const [showAuth, setShowAuth] = useState(false);

  const [authPage, setAuthPage] = useState("login");


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
    setAuthPage

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