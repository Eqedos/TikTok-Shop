// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqWICxOv-nsF3ndm4Q-cS2gOVE4Lx7Rr0",
  authDomain: "tiktokshop-f366c.firebaseapp.com",
  projectId: "tiktokshop-f366c",
  storageBucket: "tiktokshop-f366c.appspot.com",
  messagingSenderId: "868478067977",
  appId: "1:868478067977:web:fb982e1ea4ea1bc35a9fd8",
  measurementId: "G-MFNMNQJ014"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

