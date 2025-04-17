import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Sign up new user
export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);

// Log in existing user
export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

// Log out user
export const logout = () => signOut(auth);

// Listen for auth state changes
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
