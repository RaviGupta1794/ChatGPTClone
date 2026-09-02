
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

    // ==========================
    // CHECK LOGIN
    // ==========================

    const token = localStorage.getItem("token");

    if (!token) {
      setAuthPage("login");
      setShowAuth(true);
      return;
    }

    // ==========================
    // CHECK INPUT
    // ==========================

    if (!prompt.trim()) return;

    const currentPrompt = prompt.trim();

    // ==========================
    // SHOW USER MESSAGE
    // ==========================

    setPrevChat((prev) => [
      ...prev,
      {
        role: "user",
        content: currentPrompt,
      },
    ]);

    // Clear input
    setPrompt("");

    // Current chat is no longer new
    setNewChat(false);

    // // Remove old reply
    // setReply(null);

    setLoading(true);

    try {
      // ==========================
      // CALL BACKEND
      // ==========================

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: currentPrompt,
            threadId: currThreadId,
          }),
        }
      );

      const res = await response.json().catch(() => ({}));

      console.log("Chat API status:", response.status);
      console.log("Chat API response:", res);

      // ==========================
      // TOKEN EXPIRED
      // ==========================

      if (response.status === 401) {
        logoutUser();

        setAuthPage("login");
        setShowAuth(true);

        return;
      }

      // ==========================
      // BACKEND ERROR
      // ==========================

      if (!response.ok) {
        console.error("Chat API error:", res);
        return;
      }

      // ==========================
      // CHECK AI RESPONSE
      // ==========================

      if (!res.reply) {
        console.error("Backend did not return reply:", res);
        return;
      }

      // ==========================
      // ADD AI MESSAGE
      // ==========================

      setPrevChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply,
        },
      ]);

      // // Store latest reply
      // setReply(res.reply);

      // ==========================
      // ADD THREAD TO SIDEBAR
      // ==========================

      setAllThread((prev) => {
        const alreadyExists = prev.some(
          (thread) => thread.threadId === currThreadId
        );

        if (alreadyExists) {
          return prev;
        }

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
      console.error("Fetch error:", error);
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

            {/* Show toggle when sidebar is closed */}

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

            <span className="logoTitle">
              ChatGPT
            </span>

          </div>

          {/* ==========================
              USER ICON
          ========================== */}

          <div
            className="userIconDiv"
            onClick={handleProfileClick}
          >
            <span className="userIcon">

              {currentUser ? (
                currentUser.name
                  .charAt(0)
                  .toUpperCase()
              ) : (
                <i className="fa-solid fa-user"></i>
              )}

            </span>
          </div>

        </div>

        {/* ==========================
            PROFILE DROPDOWN
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

            {/* ==========================
                NOT LOGGED IN
            ========================== */}

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

            {/* ==========================
                LOGGED IN
            ========================== */}

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
            LOADING
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
              onChange={(e) =>
                setPrompt(e.target.value)
              }
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
            ChatGPT can make mistakes. Consider
            checking important information.
          </p>

        </div>

      </div>

      {/* ==========================
          AUTH OVERLAY
      ========================== */}

      {showAuth && (
        <div className="auth-overlay">

          {authPage === "login" ? (
            <Login />
          ) : (
            <SignUp />
          )}

        </div>
      )}

    </>
  );
}

