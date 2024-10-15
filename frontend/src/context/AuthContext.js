"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const[token, setToken]=useState(" ");
  const[userEmail, setUserEmail]=useState(" ");
  const router=useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        const user = userCredential.user;

        const { email, accessToken } = user;
        localStorage.setItem("usertoken", accessToken);
        setToken(accessToken);
        setUserEmail(email);
        toast.success(`Welcome back-${email.split("@")[0]}!`, {
          theme: "colored",
        });
        router.refresh();
      })
      .catch((error) => {
        setLoading(false);
        toast.error(`${error.message}`, {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
      });
  };

  const signup = async (email, password ) => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);

        const user = userCredential.user;
        const { email,accessToken } = user;
        localStorage.setItem("usertoken", accessToken);
        setToken(accessToken);

        setUserEmail(email);
        toast.success("Welcome to Med-O-Media!", {
          theme: "dark",
        });
        router.refresh();
      })
      .catch((error) => {
        setLoading(false);
        toast.error(`${error.message}`, {
          autoClose: 5000,
          theme: "dark",
        });
      });
  };


  return (
    <AuthContext.Provider value={{ user, setIsOpen, isOpen, userEmail, login, signup,setLoading, loading, setToken, token }}>
      {children}
    </AuthContext.Provider>
  );
};
