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
    currentUser,
    logoutUser,
    setAllThread,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  //-----get reply ------

  const getReply = async () => {
    const token = localStorage.getItem("token");

    // If user is not logged in, we show login popup
    if (!token) {
      setAuthPage("login");
      setShowAuth(true);
      return;
    }

    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);
    setLastPrompt(prompt);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, options);
      const res = await response.json().catch(() => ({}));

      if (response.status === 401) {
        logoutUser();

        setAuthPage("login");
        setShowAuth(true);

        return;
      }

      if (!response.ok) {
        console.log(res.message);
        return;
      }

      setReply(res.reply);

      // Adding first chat to sidebar immediately
      setAllThread((prev) => {
        const alreadyExist = prev.some(
          (thread) => thread.threadId === currThreadId,
        );

        if (alreadyExist) {
          return prev;
        }

        return [
          ...prev,
          {
            threadId: currThreadId,
            title: prompt.slice(0, 25) + "...",
          },
        ];
      });


    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reply && lastPrompt) {
      setPrevChat((prev) => [
        ...prev,
        {
          role: "user",
          content: lastPrompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);

      setPrompt("");
      setLastPrompt("");
    }
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");

  //   setCurrentUser(null);

  //   setPrevChat([]);
  //   setReply(null);
  //   setPrompt("");
  //   setNewChat(true);
  //   setCurrThreadId(uuidv4());

  //   setIsOpen(false);
  // };
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
              {currentUser ? (
                currentUser.name.charAt(0).toUpperCase()
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
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

            {!currentUser && (
              <>
                <div
                  className="dropdownItem"
                  onClick={() => {
                    setIsOpen(false);
                    setAuthPage("signup");
                    setShowAuth(true);
                  }}
                >
                  <i className="fa-solid fa-user-plus"></i>
                  Sign Up
                </div>

                <div
                  className="dropdownItem"
                  onClick={() => {
                    setIsOpen(false);
                    setAuthPage("login");
                    setShowAuth(true);
                  }}
                >
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Login
                </div>
              </>
            )}
            {currentUser && (
              <div
                className="dropdownItem"
                onClick={() => {
                  logoutUser();
                  setIsOpen(false);
                }}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </div>
            )}
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
