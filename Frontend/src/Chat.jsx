import React, { useContext, useState, useEffect, useRef} from "react";
import "./Chat.css";
import MyContext from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { prevChat, reply } = useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }

    if (!prevChat?.length) return;

    const content = reply.split(" ");

    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(
        content.slice(0, idx + 1).join(" ")
      );

      idx++;

      if (idx >= content.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [prevChat, reply]);

  useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "auto",
  });
}, [latestReply, prevChat]);

  return (
    <div className="chats">

      {/* Centered chat content */}
      <div className="chat-content">

        {prevChat.length === 0 ? (
          <div className="welcomeScreen">
            <h1>What is on your mind today?</h1>

            <p>
              I'm SigmaGPT. Ask me anything.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Time */}
            <div className="chatTime">
              Today •{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Previous Messages */}
            {prevChat.map((chat, idx) => (
              <div
                key={idx}
                className={
                  chat.role === "user"
                    ? "userDiv"
                    : "gptDiv"
                }
              >
                {chat.role === "user" ? (
                  <p className="userMessage">
                    {chat.content}
                  </p>
                ) : (
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

            {/* Latest Typing Reply */}
            {latestReply !== null && (
              <div className="gptDiv">
                <div className="assistantMessage">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {latestReply}
                  </ReactMarkdown>
                </div>
              </div>
            )}
              <div ref={bottomRef}></div>
          </>
        )}

      </div>
    </div>
  );
}