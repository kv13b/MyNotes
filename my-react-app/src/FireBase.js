// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLlMllkAcHQKgKMkI3TNxZCwaH6zCm8IY",
  authDomain: "notesapp-7a155.firebaseapp.com",
  projectId: "notesapp-7a155",
  storageBucket: "notesapp-7a155.appspot.com",
  messagingSenderId: "991733209134",
  appId: "1:991733209134:web:abd16b8a5107f48e2527bf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "notes");

export { db, notesCollection };
