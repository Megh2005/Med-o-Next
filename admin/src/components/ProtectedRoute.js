"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "./Spinner";
import { toast, ToastContainer } from "react-toastify";


export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, adminAccess, loading } = useAuth();
  

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
        toast.warning('Kindly login to proceed!', {theme: "dark"})
      } else if (!adminAccess) {
        router.push("/authGuard");
        toast.error('Unauthorised', {theme: "dark"})
      }
    }
  }, [user, adminAccess, loading, router]);

  if (loading) {
    return <Spinner/>; 
  }

  return <>
  {children}
  </>;
}
