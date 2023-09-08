import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2sResCqLl4jg4Blv2KBHrB4pnhG99e84",
  authDomain: "tiktokshop2-61a3f.firebaseapp.com",
  projectId: "tiktokshop2-61a3f",
  storageBucket: "tiktokshop2-61a3f.appspot.com",
  messagingSenderId: "937531028712",
  appId: "1:937531028712:web:4a56fa72eda4124408455d"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
