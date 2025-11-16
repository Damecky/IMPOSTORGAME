// firebase.js - używamy Firestore (modular SDK)
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  addDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
   // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy1mE_Q3fJo9W2Aa9EQUqp0L0Bn53XPHc",
  authDomain: "impostor-game-ebc12.firebaseapp.com",
  databaseURL: "https://impostor-game-ebc12-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "impostor-game-ebc12",
  storageBucket: "impostor-game-ebc12.firebasestorage.app",
  messagingSenderId: "561452405867",
  appId: "1:561452405867:web:24fb4cdf0320c2c3488d2e",
  measurementId: "G-DKBLTBFHJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  apiKey: "API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  doc,
  collection,
  setDoc,
  getDoc,
  addDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp
};
