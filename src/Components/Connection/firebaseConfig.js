import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDztze4_UlMnl_MOt-ezwKtEbt7sUMEQ1U",
  authDomain: "lmsdb-72cba.firebaseapp.com",
  projectId: "lmsdb-72cba",
  storageBucket: "lmsdb-72cba.appspot.com",
  messagingSenderId: "950709055342",
  appId: "1:950709055342:web:56017c8248e9cb58195b7f",
  measurementId: "G-BKBKELP5S7",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const auth = getAuth(app);

const analytics = getAnalytics(app);

export { db, analytics };
