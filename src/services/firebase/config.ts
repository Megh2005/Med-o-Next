import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "med-o-chat-613ec.firebaseapp.com",
  projectId: "med-o-chat-613ec",
  storageBucket: "med-o-chat-613ec.appspot.com",
  messagingSenderId: "866214098188",
  appId: "1:866214098188:web:e2e7bb5426b0ae91e9c529"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth, app };
