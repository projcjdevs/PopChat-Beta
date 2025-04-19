import { useState } from "react";
import { useAuth } from "../Contexts/authContexts";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import "../Styles/SidePanel.css";

function SidePanel({ isOpen, onClose }) {
    const { currentUser, logout } = useAuth();
    const [displayName, setDisplayName] = useState(currentUser.displayName || "");
    const [chatBubbleColor, setChatBubbleColor] = useState("#057afd");
    const [avatar, setAvatar] = useState(currentUser.photoURL || "/default-avatar.png");

    const colors = ["#057afd", "#ff4d4d", "#4caf50", "#ff9800", "#9c27b0"]; // Predefined colors

    const handleSave = async () => {
        try {
            const userDoc = doc(db, "users", currentUser.uid);
            await updateDoc(userDoc, {
                displayName,
                chatBubbleColor,
                avatar,
            });
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err.message);
        }
    };

    return (
        <div className={`side-panel ${isOpen ? "open" : ""}`}>
            <button className="close-btn" onClick={onClose}>
                &times;
            </button>
            <h2>Your Profile</h2>
            <div className="profile-section">
                <img src={avatar} alt="Avatar" className="profile-avatar" />
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                />
            </div>
            <div className="color-picker">
                <h3>Chat Bubble Color</h3>
                {colors.map((color) => (
                    <button
                        key={color}
                        className={`color-circle ${chatBubbleColor === color ? "selected" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setChatBubbleColor(color)}
                    ></button>
                ))}
            </div>
            <button className="save-btn" onClick={handleSave}>
                Save Changes
            </button>
            <button className="logout-btn" onClick={logout}>
                Log Out
            </button>
        </div>
    );
}

export default SidePanel;