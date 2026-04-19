/* ============================================================
   온종일 · firebase-config.js
   ============================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBw1v9s1qJUIwdBISqjPWdvShvCxlTU8GE",
  authDomain: "onjongil-81e2f.firebaseapp.com",
  projectId: "onjongil-81e2f",
  storageBucket: "onjongil-81e2f.firebasestorage.app",
  messagingSenderId: "162847780182",
  appId: "1:162847780182:web:ad390a965205355d707af7"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

export { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query };
