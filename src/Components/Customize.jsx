import { useState } from "react";
import { db } from "../Firebase/firebase";
import { useAuth } from "../Contexts/authContexts";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../Styles/Customize.css";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

function Customize() {
    const { currentUser } = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [chatBubbleColor, setChatBubbleColor] = useState("#057afd");
    const [selectedAvatar, setSelectedAvatar] = useState(null); // State for selected avatar
    const [success, setSuccess] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    // Predefined colors
    const colors = ["#057afd", "#ff4d4d", "#4caf50", "#ff9800", "#9c27b0"];

    // Predefined avatar placeholders
    const avatars = [
        "/assets/pc.png",
        "/assets/pop.png",
        "/assets/pika.png",
        "/assets/mcdo.png",
    ];



    const saveSettings = async () => {
        try {
            console.log("Saving settings..."); // Debugging
            const userDoc = doc(db, "users", currentUser.uid);
    
            // Check if the document exists
            const docSnapshot = await getDoc(userDoc);
            const userData = {
                displayName: displayName || currentUser.displayName,
                chatBubbleColor,
                avatar: selectedAvatar,
                profileComplete: true // Explicitly set this to true
            };
            
            if (docSnapshot.exists()) {
                // Update the existing document
                await updateDoc(userDoc, userData);
                console.log("Settings updated successfully!"); // Debugging
            } else {
                // Create a new document if it doesn't exist
                await setDoc(userDoc, userData);
                console.log("Settings created successfully!"); // Debugging
            }
    
            setSuccess("Profile updated successfully!");
            
            // Log before attempting to navigate
            console.log("About to navigate to /chat");
            
            // Force the navigation with window.location instead of using React Router
            window.location.href = "/chat";
            
        } catch (err) {
            console.error("Error updating profile:", err.message);
        }
    };
    return (
        <div className="dashboard">
            <h2>Customize your Pop Profile!</h2>
            <div className="form-group">
                <label htmlFor="displayName">Display Name (Max 15 characters)</label>
                <input
                    type="text"
                    id="displayName"
                    placeholder="Enter your display name"
                    value={displayName}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 15) {
                            setDisplayName(value);
                        }
                    }}
                    maxLength={15} // Enforce the limit in the input field
                />
            </div>
            <div className="form-group">
                <label>Chat Bubble Color</label>
                <div className="color-picker">
                    {colors.map((color) => (
                        <button
                            key={color}
                            className={`color-circle ${chatBubbleColor === color ? "selected" : ""}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setChatBubbleColor(color)}
                        ></button>
                    ))}
                </div>
            </div>
            <div className="form-group">
                <label>Select Avatar</label>
                <div className="avatar-picker">
                    {avatars.map((avatar) => (
                        <img
                            key={avatar}
                            src={avatar}
                            alt="Avatar"
                            className={`avatar ${selectedAvatar === avatar ? "selected" : ""}`}
                            onClick={() => setSelectedAvatar(avatar)} // Set the selected avatar
                        />
                    ))}
                </div>
            </div>
            <button onClick={saveSettings}>Save</button>
            {success && <p className="success-message">{success}</p>}
        </div>
    );
}

export default Customize;