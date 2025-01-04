// src/firebse.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth" ;
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHFmmYdaQgOzGkXbCILBnk5mJIznWCo-k",
  authDomain: "learnifyai-d4de3.firebaseapp.com",
  projectId: "learnifyai-d4de3",
  storageBucket: "learnifyai-d4de3.firebasestorage.app",
  messagingSenderId: "355638353170",
  appId: "1:355638353170:web:c1378aacf3b4aabde8a7cb",
  measurementId: "G-Q29GCMMYF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
export const auth=getAuth(app);
export default app;