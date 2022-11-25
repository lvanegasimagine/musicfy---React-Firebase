import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDvwLh05bCLhjGoCfvS5uqqnTG3R4EdT5Q",
  authDomain: "musicfy-c939f.firebaseapp.com",
  projectId: "musicfy-c939f",
  storageBucket: "musicfy-c939f.appspot.com",
  messagingSenderId: "735559788662",
  appId: "1:735559788662:web:5e2ea128d44351557f1757",
};

// Initialize Firebase
export const initFirebase = initializeApp(firebaseConfig);
