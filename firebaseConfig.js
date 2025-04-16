// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPYMsanzeuOd6W-X0192pLHs8ZOy1tDkA",
  authDomain: "student-management-3d86a.firebaseapp.com",
  projectId: "student-management-3d86a",
  storageBucket: "student-management-3d86a.firebasestorage.app",
  messagingSenderId: "643591262067",
  appId: "1:643591262067:web:953c43a3d842317290bf06",
  measurementId: "G-ST18YDW7CC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
