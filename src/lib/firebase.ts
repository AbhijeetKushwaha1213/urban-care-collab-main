
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUZtepMiCw4Pa24ZXH-sWFQUnOS9VBVM0",
  authDomain: "urabancollab.firebaseapp.com",
  projectId: "urabancollab",
  storageBucket: "urabancollab.firebasestorage.app",
  messagingSenderId: "261351589552",
  appId: "1:261351589552:web:c7707a5bda2eb1c8c11d75",
  measurementId: "G-TDW768MYMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
