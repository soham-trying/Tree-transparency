// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAJi-5WDT_iOggQel4In0FpqMCMrE_mdS8",
  authDomain: "tree-transparency-9294d.firebaseapp.com",
  projectId: "tree-transparency-9294d",
  storageBucket: "tree-transparency-9294d.appspot.com",
  messagingSenderId: "250170920366",
  appId: "1:250170920366:web:023074e47a165721430c3f"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const app = firebaseApp;
export const storage = getStorage(firebaseApp);
export const firestore = getFirestore();
