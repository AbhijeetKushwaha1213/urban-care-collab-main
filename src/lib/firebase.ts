
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, doc, getDoc } from "firebase/firestore";

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
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    // Test Firestore connection
    const testDocRef = doc(db, 'test', 'test');
    const testDoc = await getDoc(testDocRef);
    console.log('Firestore connection successful');
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
    return false;
  }
};

// Test Auth connection
export const testAuthConnection = async () => {
  try {
    // Test Auth connection by checking current user
    const currentUser = auth.currentUser;
    console.log('Auth connection successful, current user:', currentUser ? 'logged in' : 'not logged in');
    return true;
  } catch (error) {
    console.error('Auth connection failed:', error);
    return false;
  }
};
