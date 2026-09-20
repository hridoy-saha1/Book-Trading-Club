// firebase.config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUt4AV-k8cJrq2rEu0UkAZbSrXOz0P-h4",
  authDomain: "book-trading-club-47ae7.firebaseapp.com",
  projectId: "book-trading-club-47ae7",
  storageBucket: "book-trading-club-47ae7.firebasestorage.app",
  messagingSenderId: "152964977237",
  appId: "1:152964977237:web:18db65ee37a03875517adc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export default app;
