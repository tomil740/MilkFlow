import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCZJQAHNWtlINdzVyX70IghJW8OFOfA_mA",
  authDomain: "milkflow-5c80c.firebaseapp.com",
  projectId: "milkflow-5c80c",
  storageBucket: "milkflow-5c80c.firebasestorage.app",
  messagingSenderId: "645066156053",
  appId: "1:645066156053:web:98006196f9b6e876f0061c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
