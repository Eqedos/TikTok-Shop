import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqWICxOv-nsF3ndm4Q-cS2gOVE4Lx7Rr0",
  authDomain: "tiktokshop-f366c.firebaseapp.com",
  projectId: "tiktokshop-f366c",
  storageBucket: "tiktokshop-f366c.appspot.com",
  messagingSenderId: "868478067977",
  appId: "1:868478067977:web:fb982e1ea4ea1bc35a9fd8",
  measurementId: "G-MFNMNQJ014"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
