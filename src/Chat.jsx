import "./Chat.css";
import React, { useContext, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import useTypingEffect from "./hooks/useTypingEffect";

function Chat() {
    const { newChat, prevChats } = useContext(MyContext);
    const chatEndRef = useRef(null);

    const lastAssistantMessage = prevChats?.filter((chat) => chat.role === "assistant").at(-1)?.content ?? "";
    const typedReply = useTypingEffect(lastAssistantMessage, 18);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [prevChats, typedReply]);

    return (
        <div className="chatSurface">
            {newChat && <div className="chatHero">Start a new conversation and let the AI reply in style.</div>}
            <div className="chats">
                {prevChats?.map((chat, idx) => {
                    const isUser = chat.role === "user";
                    const isLastAssistant = !isUser && idx === prevChats.length - 1;
                    const displayContent = isLastAssistant ? typedReply || lastAssistantMessage : chat.content;

                    return (
                        <article className={isUser ? "messageRow userRow" : "messageRow aiRow"} key={`${chat.role}-${idx}`}>
                            {!isUser && (
                                <div className="assistantAvatar" aria-hidden="true">
                                    <i className="fa-solid fa-robot"></i>
                                </div>
                            )}

                            <div className={isUser ? "messageBubble userBubble" : "messageBubble aiBubble"}>
                                {isUser ? (
                                    <p className="messageText">{chat.content}</p>
                                ) : (
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{displayContent}</ReactMarkdown>
                                )}
                            </div>
                        </article>
                    );
                })}
                <div ref={chatEndRef} className="chatEndMarker" />
            </div>
        </div>
    );
}

export default Chat;