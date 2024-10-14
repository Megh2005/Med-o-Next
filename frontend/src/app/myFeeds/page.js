"use client";

import { useEffect } from "react";
import UserHealthFeed from "../../components/UserHealthFeeds";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


export default function MyFeeds(){
    const{user}=useAuth();
    const router=useRouter();

    useEffect(()=>{
        if (!user || !user.uid) {
            toast.error("User is not authenticated! Kindly Login", {theme: "dark"});
            router.push("/");
          }
    }, [])

    return(
        <UserHealthFeed />

    )
}