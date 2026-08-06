import React, { useContext, useEffect } from "react";
import "./Sidebar.css";
import MyContext from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";

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
  } = useContext(MyContext);

  //   const logoutUser = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");

  //   setCurrentUser(null);
  //   setAllThread([]);
  //   setPrevChat([]);
  //   setReply(null);
  //   setPrompt("");

  //   setAuthPage("login");
  //   setShowAuth(true);
  // };

  // ---------------- Get All Threads ----------------

  const getAllThread = async () => {
    const token = localStorage.getItem("token");

    //User not logged in
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
        },
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
  // ---------------- New Chat ----------------

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

  // ---------------- Change Thread ----------------

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
        },
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

  // ---------------- Delete Thread ----------------

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
        },
      );
      if (response.status === 401) {
        logoutUser();
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to delete thread");
      }

      // setAllThread((prev) =>
      //   prev.filter((thread) => thread.threadId !== threadId),
      // );
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
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt="gpt-logo" className="logo" />

        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThread?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}

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

      <div className="sign">
        <p>By Ravi Gupta ♥</p>
      </div>
    </section>
  );
}
