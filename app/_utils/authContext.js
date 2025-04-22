"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const emailSignUp = async (email, password, firstName, lastName, phone) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", userCredential.user.uid), {
            firstName,
            lastName,
            phone,
            email,
        });

        return userCredential;
    };

    const emailLogin = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        try {
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            if (userDoc.exists()) {
                setProfile(userDoc.data());
            }
        } catch (error) {
            console.error("Error fetching profile after login:", error.message);
        }

        return userCredential;
    };

    const firebaseSignOut = () => {
        setProfile(null);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setProfile(userDoc.data());
                    }
                } catch (error) {
                    console.error("Error fetching profile on auth change:", error.message);
                }
            } else {
                setProfile(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                googleSignIn,
                firebaseSignOut,
                emailSignUp,
                emailLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useUserAuth = () => {
    return useContext(AuthContext);
};
