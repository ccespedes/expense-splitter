// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT-Qc8Sip7-tXT7VV97ijI8WElTf3l9K4",
  authDomain: "expense-splitter-280fd.firebaseapp.com",
  projectId: "expense-splitter-280fd",
  storageBucket: "expense-splitter-280fd.appspot.com",
  messagingSenderId: "950654870467",
  appId: "1:950654870467:web:32ab74fbfd8a4106155376",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
