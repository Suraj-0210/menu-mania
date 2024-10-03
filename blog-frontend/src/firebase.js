// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mern-blog-4cc1b.firebaseapp.com",
  projectId: "mern-blog-4cc1b",
  storageBucket: "gs://mern-blog-4cc1b.appspot.com",
  messagingSenderId: "434023813384",
  appId: "1:434023813384:web:c4fb8fc5642f5a2fec9cbd",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
