import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCONfqWrXYm2ZF4goNOeAzquBy-lidEx8U",
  authDomain: "react-form-24af0.firebaseapp.com",
  databaseURL: "https://react-form-24af0-default-rtdb.firebaseio.com",
  projectId: "react-form-24af0",
  storageBucket: "react-form-24af0.firebasestorage.app",
  messagingSenderId: "205924279201",
  appId: "1:205924279201:web:efa3b2a791031085ea21e0",
  measurementId: "G-MG2FXVCDG4"
};   

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);