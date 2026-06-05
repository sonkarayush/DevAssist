import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const { prompt, setPrompt, currThreadId, setPrevChats, setNewChat, setIsSidebarOpen } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const textareaRef = useRef(null);

    const mockAIReply = "This is a mock AI response! I bypassed the backend to demonstrate my frontend UI skills.";

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [prompt]);

    const getReply = async () => {
        const message = prompt.trim();

        if (!message) return;

        setLoading(true);
        setNewChat(false);

        console.log("message ", message, " threadId ", currThreadId);

        setTimeout(() => {
            setPrevChats((prev) => [
                ...prev,
                { role: "user", content: message },
                { role: "assistant", content: mockAIReply }
            ]);
            setPrompt("");
            setLoading(false);
        }, 900);
    };

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            getReply();
        }
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <button className="mobileMenuBtn" type="button" onClick={() => setIsSidebarOpen((prev) => !prev)} aria-label="Toggle sidebar">
                    <i className="fa-solid fa-bars"></i>
                </button>
                <span className="brandLabel">DevAssist <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            )}
            <Chat />

            <ScaleLoader color="#8b5cf6" loading={loading} />

            <div className="chatInput">
                <div className="inputBox">
                    <textarea
                        ref={textareaRef}
                        className="promptInput"
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(event) => {
                            setPrompt(event.target.value);
                            adjustTextareaHeight();
                        }}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <button id="submit" type="button" onClick={getReply} aria-label="Send prompt">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                <p className="info">DevAssist can make mistakes. Check important info. See Cookie Preferences.</p>
            </div>
        </div>
    );
}

export default ChatWindow;