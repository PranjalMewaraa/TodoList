import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRUOh7rzG9AAEH2uLMYB8FnGTpHi86LjE",
  authDomain: "practicebuzz.firebaseapp.com",
  projectId: "practicebuzz",
  storageBucket: "practicebuzz.appspot.com",
  messagingSenderId: "188337829816",
  appId: "1:188337829816:web:176ccfd3894b0b4f77414d",
  measurementId: "G-NEQQPSHZPD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithCredential,
  getAuth,
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
};
