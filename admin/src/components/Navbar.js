"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router=useRouter();
  
  const { user, userEmail, token, setToken } = useAuth();


  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("usertoken");
      setToken(null);
      toast.info("Logged out successfully", {
        theme: "dark",
      });
      router.push("/");
    } catch (error) {
      toast.error(`${error.message}`, {
        autoClose: 5000,
        theme: "dark",
      });
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap">
        <Link href="/" className="text-2xl font-bold">
          Med-o-Media
        </Link>

        {
          user &&  
        <ul className="flex space-x-6">
        
            <Link href={"/dashboard"}
            className="bg-blue-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-emerald-400 transition duration-300 ease-in-out items-center  justify-between"
          >
           { userEmail} <FontAwesomeIcon icon={faUserTie}/>
          </Link>
         <button
          className="cursor-pointer bg-emerald-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-yellow-400 transition duration-300 ease-in-out items-center  justify-between"
          onClick={logout}
        >
          Logout <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </button>
        </ul>
         }
      </div>
    </nav>
  );
}


