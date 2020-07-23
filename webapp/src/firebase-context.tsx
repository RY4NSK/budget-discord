import firebase from 'firebase/app';
import React from 'react';
import 'firebase/auth';
import 'firebase/firestore';
 
const config = {
    apiKey: "AIzaSyBUlhP4B6fUQCB5pT_fbVtOsTuGCLA7brc",
    authDomain: "budgetdiscord-a8fb0.firebaseapp.com",
    databaseURL: "https://budgetdiscord-a8fb0.firebaseio.com",
    projectId: "budgetdiscord-a8fb0",
    storageBucket: "budgetdiscord-a8fb0.appspot.com",
    messagingSenderId: "468459008009",
    appId: "1:468459008009:web:229728bbe379eed33148d8",
    measurementId: "G-0R0J5XLEG1"
};
 
const fbApp = firebase.initializeApp(config);

export default fbApp;

const FirebaseContext = React.createContext<firebase.app.App>(fbApp);

export {FirebaseContext};