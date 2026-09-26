import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYJ7l6hMIGVgN-Nr4dT5W-gvXDbFdhrY0",
  authDomain: "authentication-f902c.firebaseapp.com",
  projectId: "authentication-f902c",
  storageBucket: "authentication-f902c.firebasestorage.app",
  messagingSenderId: "151316643324",
  appId: "1:151316643324:web:e935717bd3a5a2e7dac679",
  measurementId: "G-14HZS249YR"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

