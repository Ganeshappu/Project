// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAK9vJ-FNut9p6qERCLXPucHSWHHeSG1YE",
  authDomain: "community-hub-b1a17.firebaseapp.com",
  projectId: "community-hub-b1a17",
  storageBucket: "community-hub-b1a17.firebasestorage.app",
  messagingSenderId: "944606415433",
  appId: "1:944606415433:web:b6cd2ced6132f558300d98",
  measurementId: "G-BK2D1ZWFBN" 
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
