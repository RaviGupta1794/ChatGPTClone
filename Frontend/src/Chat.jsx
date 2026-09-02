import React, { useContext, useEffect, useRef } from "react";
import "./Chat.css";
import MyContext from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { prevChat } = useContext(MyContext);

  const bottomRef = useRef(null);

  // Auto scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [prevChat]);

  return (
    <div className="chats">

      <div className="chat-content">

        {/* ==========================
            WELCOME SCREEN
        ========================== */}

        {prevChat.length === 0 ? (

          <div className="welcomeScreen">
            <h1>What is on your mind today?</h1>

            <p>
              I'm SigmaGPT. Ask me anything.
            </p>
          </div>

        ) : (

          <>

            {/* ==========================
                CHAT TIME
            ========================== */}

            <div className="chatTime">
              Today •{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>


            {/* ==========================
                ALL MESSAGES
            ========================== */}

            {prevChat.map((chat, idx) => (

              <div
                key={idx}
                className={
                  chat.role === "user"
                    ? "userDiv"
                    : "gptDiv"
                }
              >

                {/* USER MESSAGE */}

                {chat.role === "user" ? (

                  <p className="userMessage">
                    {chat.content}
                  </p>

                ) : (

                  /* AI MESSAGE */

                  <div className="assistantMessage">

                    <ReactMarkdown
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {chat.content}
                    </ReactMarkdown>

                  </div>

                )}

              </div>

            ))}


            {/* ==========================
                BOTTOM SCROLL REFERENCE
            ========================== */}

            <div ref={bottomRef}></div>

          </>

        )}

      </div>

    </div>
  );
}