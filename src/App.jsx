import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase/firebase";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Contexts/authContexts";
import Greetings from "./Components/Auth/Greetings";
import Customize from "./Components/Customize";
import ChatRoom from "./Components/ChatRoom";

function AppContent() {
  const { currentUser } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Add this to track location changes

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (currentUser) {
        try {
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            // Check for the profileComplete flag instead of just displayName
            setIsProfileComplete(!!userData.profileComplete);
            console.log("Profile complete status:", !!userData.profileComplete);
          } else {
            setIsProfileComplete(false);
            console.log("User document doesn't exist, profile not complete");
          }
        } catch (error) {
          console.error("Error checking profile completion:", error);
          setIsProfileComplete(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkProfileCompletion();
  }, [currentUser, location]); // Add location to dependencies to re-check when URL changes

  console.log("Current User:", currentUser);
  console.log("Is Profile Complete:", isProfileComplete);
  console.log("Loading:", loading);

  // Show loading state while checking profile completion
  if (currentUser && loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !currentUser ? (
            <Greetings />
          ) : !isProfileComplete ? (
            <Navigate to="/customize" />
          ) : (
            <Navigate to="/chat" />
          )
        }
      />
      <Route
        path="/chat"
        element={
          currentUser ? 
            (isProfileComplete ? <ChatRoom /> : <Navigate to="/customize" />) 
            : <Navigate to="/" />
        }
      />
      <Route
        path="/customize"
        element={currentUser ? <Customize /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;