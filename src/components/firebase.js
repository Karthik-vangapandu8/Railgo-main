// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDGRI5xTMOhyl8l-eDovW90DNk9BAVr9g",
  authDomain: "dayaram-fbd16.firebaseapp.com",
  projectId: "dayaram-fbd16",
  storageBucket: "dayaram-fbd16.appspot.com",
  messagingSenderId: "331428555723",
  appId: "1:331428555723:web:27a5cffbc6682413ce244e"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
