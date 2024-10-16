import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCADQhCzxI7DaeAbeKSrM9RetuTVoTqDa8",
  authDomain: "testing-nextjs-f310c.firebaseapp.com",
  databaseURL: "https://testing-nextjs-f310c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "testing-nextjs-f310c",
  storageBucket: "testing-nextjs-f310c.appspot.com",
  messagingSenderId: "621190539158",
  appId: "1:621190539158:web:000310d66e020ddb561fb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth, app };
