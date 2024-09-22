import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "med-o-chat-71a5f.firebaseapp.com",
  projectId: "med-o-chat-71a5f",
  storageBucket: "med-o-chat-71a5f.appspot.com",
  messagingSenderId: "324140349933",
  appId: "1:324140349933:web:57c636ec60991b48e60fe4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth, app };
