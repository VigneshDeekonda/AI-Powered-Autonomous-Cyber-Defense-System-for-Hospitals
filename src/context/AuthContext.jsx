import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Stop listening to the previous user's profile
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      setCurrentUser(user);
      setUserProfile(null);

      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const userRef = doc(db, "users", user.uid);

      // Listen for changes to the user's Firestore profile in real time.
      // This means admin approval/rejection is detected automatically.
      unsubscribeProfile = onSnapshot(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setUserProfile(snapshot.data());
          } else {
            console.warn("User profile does not exist in Firestore.");
            setUserProfile(null);
          }

          setLoading(false);
        },
        (error) => {
          console.error("Could not fetch user profile:", error);
          setUserProfile(null);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    userProfile,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}