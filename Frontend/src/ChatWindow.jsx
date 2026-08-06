import React, { useContext, useState, useEffect } from "react";
import "./ChatWindow.css";
import Chat from "./Chat";
import MyContext from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";
import Login from "./authComponenet/Login.jsx";
import SignUp from "./authComponenet/SignUp.jsx";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChat,
    setNewChat,
    showAuth,
    setShowAuth,
    authPage,
    setAuthPage,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        // sending JWT token
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);

      const res = await response.json();

      console.log(res);

      setReply(res.reply);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChat((prevChat) => [
        ...prevChat,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setAuthPage("login");

    setShowAuth(true);
  };

  return (
    <>
      <div className="chat-window">
        <div className="navbar">
          <span className="logoTitle">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            SigmaGPT
          </span>

          <div className="userIconDiv" onClick={handleProfileClick}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="dropdown">
            <div className="dropdownItem">
              <i className="fa-solid fa-cloud-arrow-up"></i>
              Upgrade Plan
            </div>

            <div className="dropdownItem">
              <i className="fa-solid fa-gear"></i>
              Settings
            </div>

            <div
              className="dropdownItem"
              onClick={() => {
                setAuthPage("signup");

                setShowAuth(true);
              }}
            >
              <i className="fa-solid fa-user-plus"></i>
              SignUp
            </div>

            <div
              className="dropdownItem"
              onClick={() => {
                setAuthPage("login");

                setShowAuth(true);
              }}
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              Login
            </div>

            <div className="dropdownItem" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </div>
          </div>
        )}

        <Chat />

        {loading && (
          <div className="loader-container">
            <ScaleLoader
              color="#339cff"
              loading={loading}
              height={35}
              width={4}
              radius={2}
              margin={3}
            />
          </div>
        )}

        <div className="chatInput">
          <div className="inputBox">
            <input
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getReply();
                }
              }}
            />

            <div id="submit" onClick={getReply}>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>

          <p className="info">
            ChatGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      {showAuth && (
        <div className="auth-overlay">
          {authPage === "login" ? <Login /> : <SignUp />}
        </div>
      )}
    </>
  );
}
