// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (hardcoded for ZenBudget)
const firebaseConfig = {
  apiKey: "AIzaSyA5MGsX_GkYOT7XgmJ_PZVdI08GEfI3IZg",
  authDomain: "zenbudget-18325.firebaseapp.com",
  projectId: "zenbudget-18325",
  storageBucket: "zenbudget-18325.firebasestorage.app",
  messagingSenderId: "753258658307",
  appId: "1:753258658307:web:b7f8e9e76a967e639bac36",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports (so other files can use auth and db)
export const auth = getAuth(app);
export const db = getFirestore(app);
