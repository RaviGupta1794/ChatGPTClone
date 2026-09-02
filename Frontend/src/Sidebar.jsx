import React, { useContext, useEffect } from "react";
import "./Sidebar.css";
import MyContext from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";
import logo from "./assets/blacklogo.png";

export default function Sidebar() {
  const {
    allThread,
    setAllThread,
    setPrevChat,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    currentUser,
    setAuthPage,
    setShowAuth,
    logoutUser,
    setSidebarOpen,
  } = useContext(MyContext);

  // ==========================
  // GET ALL THREADS
  // ==========================

  const getAllThread = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAllThread([]);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        logoutUser();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch threads");
      }

      const res = await response.json();

      const filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThread(filterData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getAllThread();
    } else {
      setAllThread([]);
    }
  }, [currentUser]);

  // ==========================
  // NEW CHAT
  // ==========================

  const createNewChat = () => {
    if (!currentUser) {
      setAuthPage("login");
      setShowAuth(true);
      return;
    }

    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChat([]);
  };

  // ==========================
  // CHANGE THREAD
  // ==========================

  const changeThread = async (newThreadId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthPage("login");
      setShowAuth(true);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        logoutUser();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch thread");
      }

      const res = await response.json();

      setCurrThreadId(newThreadId);
      setPrevChat(res.messages || res);
      setNewChat(false);
      setReply(null);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // DELETE THREAD
  // ==========================

  const deleteThread = async (threadId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthPage("login");
      setShowAuth(true);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        logoutUser();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete thread");
      }

      if (threadId === currThreadId) {
        setPrevChat([]);
        setReply(null);
        setPrompt("");
        setNewChat(true);
        setCurrThreadId(uuidv4());
      }

      await getAllThread();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="sidebar">

      {/* ==========================
          SIDEBAR HEADER
      ========================== */}

      <div className="sidebarHeader">

        <div className="brand">
          <img src={logo} alt="SigmaGPT" />
          <span>ChatGPT</span>
        </div>

        <div className="headerIcons">

          {/* Search */}
          <button
            className="iconButton"
            title="Search"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

          {/* Close sidebar */}
          <button
            className="iconButton"
            title="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fa-solid fa-table-columns"></i>
          </button>

        </div>

      </div>


      {/* ==========================
          MAIN MENU
      ========================== */}

      <div className="sidebarMenu">

        {/* New Chat */}

        <button
          className="menuItem"
          onClick={createNewChat}
        >
          <i className="fa-solid fa-pen-to-square"></i>
          <span>New chat</span>
        </button>


        {/* Images */}

        <button className="menuItem">
          <i className="fa-regular fa-image"></i>
          <span>Images</span>
        </button>


        {/* Apps */}

        <button className="menuItem">
          <i className="fa-solid fa-table-cells-large"></i>
          <span>Apps</span>
        </button>

      </div>


      {/* ==========================
          RECENTS
      ========================== */}

      <div className="recentSection">

        <h4>Recents</h4>

        <ul className="history">

          {allThread?.map((thread) => (

            <li
              key={thread.threadId}
              onClick={() =>
                changeThread(thread.threadId)
              }
              className={
                thread.threadId === currThreadId
                  ? "highlighted"
                  : ""
              }
            >

              <span className="threadTitle">
                {thread.title}
              </span>

              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>

            </li>

          ))}

        </ul>

      </div>


      {/* ==========================
          FOOTER
      ========================== */}

      <div className="sign">
        <p>By Ravi Gupta ♥</p>
      </div>

    </section>
  );
}