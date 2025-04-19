import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyD-vwoXufxjVcBHiqxwPTXVT4errXs4KAU",
  authDomain: "popchat-67d5e.firebaseapp.com",
  projectId: "popchat-67d5e",
  storageBucket: "popchat-67d5e.firebasestorage.app",
  messagingSenderId: "1095805526933",
  appId: "1:1095805526933:web:bd3167f275801324d30c9c",
  measurementId: "G-LKJHXG346W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { app, analytics, auth, db };