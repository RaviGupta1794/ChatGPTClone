import React, { useContext, useState } from "react";
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

    sidebarOpen,
    setSidebarOpen,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ==========================
  // GET REPLY
  // ==========================

  const getReply = async () => {
    // Prevent multiple requests
    if (loading) return;

    // Get token
    const token = localStorage.getItem("token");

    // User not logged in
    if (!token) {
      setAuthPage("login");
      setShowAuth(true);
      return;
    }

    // Empty input
    if (!prompt.trim()) return;

    // Save current input
    const currentPrompt = prompt.trim();

    // ==========================
    // ADD USER MESSAGE
    // ==========================

    setPrevChat((prev) => [
      ...prev,
      {
        role: "user",
        content: currentPrompt,
      },
    ]);

    // Clear input immediately
    setPrompt("");

    // Current thread is now active
    setNewChat(false);

    setLoading(true);

    try {
      // ==========================
      // SEND TO BACKEND
      // ==========================

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          message: currentPrompt,
          threadId: currThreadId,
        }),
      });

      const res = await response.json().catch(() => ({}));

      // ==========================
      // UNAUTHORIZED
      // ==========================

      if (response.status === 401) {
        logoutUser();

        setAuthPage("login");
        setShowAuth(true);

        return;
      }

      // ==========================
      // OTHER ERROR
      // ==========================

      if (!response.ok) {
        console.log("Chat error:", res);
        return;
      }

      // ==========================
      // BACKEND RESPONSE
      // ==========================

      console.log("Backend response:", res);

      if (!res.reply) {
        console.log("No reply received from backend");
        return;
      }

      // ==========================
      // SET AI REPLY
      // ==========================

      setReply(res.reply);

      // ==========================
      // ADD THREAD TO SIDEBAR
      // ==========================

      setAllThread((prev) => {
        const alreadyExists = prev.some(
          (thread) => thread.threadId === currThreadId,
        );

        // Thread already exists
        if (alreadyExists) {
          return prev;
        }

        // First message of this thread
        return [
          ...prev,
          {
            threadId: currThreadId,

            title:
              currentPrompt.length > 25
                ? currentPrompt.slice(0, 25) + "..."
                : currentPrompt,
          },
        ];
      });
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // PROFILE
  // ==========================

  const handleProfileClick = () => {
    setIsOpen((prev) => !prev);
  };

  // ==========================
  // TOGGLE SIDEBAR
  // ==========================

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // ==========================
  // ENTER KEY
  // ==========================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      getReply();
    }
  };

  return (
    <>
      <div className="chat-window">
        {/* ==========================
            NAVBAR
        ========================== */}
        <div className="navbar">
          <div className="navbar-left">
            {/* Show toggle only when sidebar is CLOSED */}
            {!sidebarOpen && (
              <button
                className="window-toggle"
                onClick={() => setSidebarOpen(true)}
                aria-label="Show sidebar"
                title="Show sidebar"
              >
                <i className="fa-solid fa-table-columns"></i>
              </button>
            )}

            <span className="logoTitle">ChatGPT</span>
          </div>

          {/* USER */}
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

        {/* ==========================
            DROPDOWN
        ========================== */}

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

            {/* NOT LOGGED IN */}

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

            {/* LOGGED IN */}

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

        {/* ==========================
            CHAT
        ========================== */}

        <Chat />

        {/* ==========================
            LOADER
        ========================== */}

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

        {/* ==========================
            INPUT
        ========================== */}

        <div className="chatInput">
          <div className="inputBox">
            <input
              type="text"
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <div
              id="submit"
              onClick={getReply}
              className={loading ? "disabled" : ""}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>

          <p className="info">
            ChatGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      {/* ==========================
          AUTH
      ========================== */}

      {showAuth && (
        <div className="auth-overlay">
          {authPage === "login" ? <Login /> : <SignUp />}
        </div>
      )}
    </>
  );
}
