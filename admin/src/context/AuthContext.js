"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [adminAccess, setAdminAccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [token, setToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  // const admin1=process.env.NEXT_ADMIN2_UID;
  // const admin2=process.env.NEXT_ADMIN1_UID;
  const adminModerators = ['euf86kgKmTOAw7Gyw1OyNFdHRPy2','cNczY3fKmXbjRXOzN3BmazuZort1' ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setLoading(true);
      if (currUser && adminModerators.includes(currUser.uid)) {
        setUser(currUser);
        setAdminAccess(true);
      } else {
        setUser(null);
        setAdminAccess(false);
      }
      setLoading(false);
      
    });

    
    return () => unsubscribe();
  }, []);


  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      const { email: userEmail, accessToken } = user;
      

      if (adminModerators.includes(user.uid)) {
        setAdminAccess(true);
        localStorage.setItem("usertoken", accessToken);
        setToken(accessToken);
        setUserEmail(userEmail);
        toast.success(`Welcome to Admin Dashboard!`, {theme: "dark"});
        router.push("/dashboard"); 
      } else {
        setAdminAccess(false);
        toast.error(`Access Denied! You are not authorized!`, {theme: "dark"});
        router.push("/"); 
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      const { email: userEmail, accessToken } = user;

      localStorage.setItem("usertoken", accessToken);
      setToken(accessToken);
      setUserEmail(userEmail);
      router.push("/dashboard"); 
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        adminAccess,
        setAdminAccess,
        user,
        setIsOpen,
        isOpen,
        userEmail,
        login,
        signup,
        setLoading,
        loading,
        setToken,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
