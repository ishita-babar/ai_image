import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDMrvx9F0pCpZYy8S1HJ_IsIzTYE_bJZ0w",
    authDomain: "login-44dad.firebaseapp.com",
    projectId: "login-44dad",
    storageBucket: "login-44dad.appspot.com",
    messagingSenderId: "871027926785",
    appId: "1:871027926785:web:14cafb54da34dd1e90dd00"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { auth };