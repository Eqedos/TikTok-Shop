import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcCVuuaRPGJwIQKfyHVWvMmNtgDZ7n464",
  authDomain: "tiktokshop3-5dd49.firebaseapp.com",
  projectId: "tiktokshop3-5dd49",
  storageBucket: "tiktokshop3-5dd49.appspot.com",
  messagingSenderId: "227988780653",
  appId: "1:227988780653:web:bc8df1cbca31455ff3b164"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
