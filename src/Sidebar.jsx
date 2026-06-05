import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

const mockHistory = [
    { threadId: "mock-1", title: "MERN Stack Authentication Flow" },
    { threadId: "mock-2", title: "Understanding Fatty Acid Nomenclature" },
    { threadId: "mock-3", title: "Dynamic Programming vs Greedy Algorithms" },
    { threadId: "mock-4", title: "Hydrogen Sulfide One-Pot Reaction Setup" },
    { threadId: "mock-5", title: "Tricalcium Aluminate in Portland Cement" },
    { threadId: "mock-6", title: "Wicket-Keeping and Stumping Rules" },
    { threadId: "mock-7", title: "Optimizing React State with Zustand" },
];

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, isSidebarOpen, setIsSidebarOpen} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setAllThreads(mockHistory);
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setIsSidebarOpen(false);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        setIsSidebarOpen(false);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    const historyItems = allThreads?.length ? allThreads : mockHistory;

    return (
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            <button className="newChatBtn" onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <button className="sidebarCloseBtn" type="button" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
                <i className="fa-solid fa-xmark"></i>
            </button>


            <ul className="history">
                {historyItems.map((thread, idx) => (
                    <li
                        key={thread.threadId}
                        onClick={() => changeThread(thread.threadId)}
                        className={`historyItem ${idx === 0 ? "active" : ""} ${thread.threadId === currThreadId ? "highlighted" : ""}`}
                    >
                        <span className="historyIcon" aria-hidden="true">
                            <i className="fa-regular fa-message"></i>
                        </span>
                        <span className="historyLabel">{thread.title}</span>
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
               <p>DevAssist v1.0</p>
            </div>
        </aside>
    )
}

export default Sidebar;