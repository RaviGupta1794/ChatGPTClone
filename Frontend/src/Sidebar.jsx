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
  } = useContext(MyContext);

  // ---------------- Get All Threads ----------------

  const getAllThread = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
    getAllThread();
  }, [currThreadId]);

  // ---------------- New Chat ----------------

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChat([]);
  };

  // ---------------- Change Thread ----------------

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch thread");
      }

      const res = await response.json();

      setPrevChat(res);
      setNewChat(false);
      setReply(null);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- Delete Thread ----------------

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete thread");
      }

      setAllThread((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img
          src="src/assets/blacklogo.png"
          alt="gpt-logo"
          className="logo"
        />

        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThread?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={
              thread.threadId === currThreadId ? "highlighted" : ""
            }
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