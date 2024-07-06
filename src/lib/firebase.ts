import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD0h55pbZJNzqdrZUO_MpROhliNtCAAnmQ",
    authDomain: "flownotes-dev.firebaseapp.com",
    projectId: "flownotes-dev",
    storageBucket: "flownotes-dev.appspot.com",
    messagingSenderId: "894566395386",
    appId: "1:894566395386:web:be3e6db8cf2a2260278843",
    measurementId: "G-QPEJ6CFTXV"
};

let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
auth = getAuth(app);

export { auth };