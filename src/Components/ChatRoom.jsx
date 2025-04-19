import { useState, useEffect, useRef } from "react";
import { db } from "../Firebase/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../Contexts/authContexts";
import "../Styles/ChatRoom.css";

import sendSound from "../assets/send.wav"; // Import send sound
import receiveSound from "../assets/receive.mp3"; // Import receive sound

function ChatRoom() {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userProfile, setUserProfile] = useState({ displayName: "", avatar: "", chatBubbleColor: "" });
    const [replyTo, setReplyTo] = useState(null);
    const [typingUsers, setTypingUsers] = useState([]);

    const chatBodyRef = useRef(null);
    const prevMessagesLengthRef = useRef(0); // Track previous message count for sound effects

    const scrollToBottom = () => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    };

    const updateTypingStatus = async (isTyping) => {
        if (!currentUser) return;

        try {
            const userDoc = doc(db, "users", currentUser.uid);
            await updateDoc(userDoc, { typing: isTyping });
        } catch (err) {
            console.error("Error updating typing status:", err.message);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        // Update typing status
        if (e.target.value.trim() !== "") {
            updateTypingStatus(true);
        } else {
            updateTypingStatus(false);
        }
    };

    useEffect(() => {
        const preloadSendAudio = new Audio(sendSound);
        const preloadReceiveAudio = new Audio(receiveSound);

        preloadSendAudio.load();
        preloadReceiveAudio.load();
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (currentUser) {
                const userDoc = doc(db, "users", currentUser.uid);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    setUserProfile(userSnapshot.data());
                }
            }
        };

        fetchUserProfile();
    }, [currentUser]);

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setMessages(messagesData);

            // Play sound when a new message is added
            if (messagesData.length > prevMessagesLengthRef.current) {
                const newMessage = messagesData[messagesData.length - 1];

                if (newMessage.uid === currentUser?.uid) {
                    // Play send sound
                    const sendAudio = new Audio(sendSound);
                    sendAudio.play().catch((e) => console.log("Send sound error:", e));
                } else {
                    // Play receive sound
                    const receiveAudio = new Audio(receiveSound);
                    receiveAudio.play().catch((e) => console.log("Receive sound error:", e));
                }
            }

            prevMessagesLengthRef.current = messagesData.length;

            setTimeout(scrollToBottom, 100);
        });

        return () => unsubscribe();
    }, [currentUser]);

    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const typingUsersData = snapshot.docs
                .map((doc) => doc.data())
                .filter((user) => user.typing && user.uid !== currentUser.uid); // Exclude the current user

            setTypingUsers(typingUsersData);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        try {
            await addDoc(collection(db, "messages"), {
                text: newMessage,
                createdAt: new Date(),
                uid: currentUser.uid,
                displayName: userProfile.displayName || currentUser.displayName,
                avatar: userProfile.avatar,
                chatBubbleColor: userProfile.chatBubbleColor,
                replyTo: replyTo ? { text: replyTo.text, displayName: replyTo.displayName } : null,
            });
            setNewMessage("");
            setReplyTo(null);
            updateTypingStatus(false); // Stop typing after sending a message
        } catch (err) {
            console.error("Error sending message:", err.message);
        }
    };

    return (
        <div className="chatbox">
            <div className="chat-header">
                <h2 className="header-title">PopChat Room</h2>
            </div>

            <div className="chat-body" ref={chatBodyRef}>
                <div className="messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-container ${
                                message.uid === currentUser.uid ? "user-message" : "cpn-message"
                            }`}
                        >
                            <img
                                src={message.avatar || "/default-avatar.png"}
                                alt="Avatar"
                                className="message-avatar"
                            />
                            <div className="message-content">
                                <p className="message-display-name">{message.displayName}</p>
                                <div
                                    className={`message-bubble ${
                                        message.uid === currentUser.uid ? "user-bubble" : "cpn-bubble"
                                    }`}
                                    style={{
                                        backgroundColor: message.uid === currentUser.uid
                                            ? (message.chatBubbleColor || "#057afd")
                                            : "#333",
                                    }}
                                >
                                    {message.replyTo && (
                                        <div className="replied-message">
                                            <p className="replied-message-text">
                                                Replying to: <strong>{message.replyTo.displayName}</strong> - {message.replyTo.text}
                                            </p>
                                        </div>
                                    )}
                                    <p>{message.text}</p>
                                </div>
                            </div>
                            <i
                                className="fa-solid fa-reply reply-icon"
                                onClick={() => setReplyTo(message)}
                                title="Reply"
                            ></i>
                        </div>
                    ))}
                </div>
                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                    <div className="typing-indicator">
                        {typingUsers.map((user) => (
                            <p key={user.uid}>{user.displayName} is typing...</p>
                        ))}
                    </div>
                )}
            </div>

            {replyTo && (
                <div className="reply-preview">
                    <p>
                        Replying to: <strong>{replyTo.displayName}</strong> - {replyTo.text}
                    </p>
                    <button onClick={() => setReplyTo(null)}>Cancel</button>
                </div>
            )}

            <form onSubmit={sendMessage} className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleTyping}
                />
                <button type="submit">
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </form>

            <div className="chat-footer">
                <p>Powered by CPN | @projcjdevs</p>
            </div>
        </div>
    );
}

export default ChatRoom;