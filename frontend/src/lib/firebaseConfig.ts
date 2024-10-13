// lib/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",            // Replace with your Firebase API key
    authDomain: "YOUR_AUTH_DOMAIN",    // Replace with your Firebase Auth Domain
    projectId: "YOUR_PROJECT_ID",      // Replace with your Firebase Project ID
    storageBucket: "YOUR_STORAGE_BUCKET",  // Replace with your Firebase Storage Bucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace with your Messaging Sender ID
    appId: "YOUR_APP_ID",  
};

// Initialize Firebase only once in the app
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
