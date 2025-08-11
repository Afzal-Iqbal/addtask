// src/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore added

// ✅ Correct Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCIa64sZnE77-mL1a0b45bPl2-qn3xavBA",
  authDomain: "afzalxahmed-7027b.firebaseapp.com",
  projectId: "afzalxahmed-7027b",
  storageBucket: "afzalxahmed-7027b.appspot.com",
  messagingSenderId: "212519679883",
  appId: "1:212519679883:web:5a0a917cc488a25565218e",
  measurementId: "G-0JYCV22TPV"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth setup
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ✅ Firestore setup
const db = getFirestore(app);

export { auth, googleProvider, db };