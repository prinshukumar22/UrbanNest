// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "urbannest-28de9.firebaseapp.com",
  projectId: "urbannest-28de9",
  storageBucket: "urbannest-28de9.appspot.com",
  messagingSenderId: "849769960897",
  appId: "1:849769960897:web:a711eba2359f571f140b40",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
