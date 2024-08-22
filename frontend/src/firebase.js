import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUBsEywMKqo7oWfhzcmtkhPcQMWAL0QAY",
    authDomain: "react-firebase-project-5e24c.firebaseapp.com",
    projectId: "react-firebase-project-5e24c",
    storageBucket: "react-firebase-project-5e24c.appspot.com",
    messagingSenderId: "597020078395",
    appId: "1:597020078395:web:851c8a14c4be9c5249c71e",
    databaseURL: "https://console.firebase.google.com/project/react-firebase-project-5e24c/database/react-firebase-project-5e24c-default-rtdb/data/~2F"
};

//Initilize Firebase app 

export const app = initializeApp(firebaseConfig);