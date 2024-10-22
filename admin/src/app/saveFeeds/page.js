/** route for saving articles in db via server-side-rendering on "/api/feeds/route.js" folder */
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function SaveFeeds(){
    const handleSave=async()=>{
       try {
        const response= fetch("/api/saveFeeds");
       toast.success("saved 1");
        
       } catch (e) {
        toast.error('Failed to fetch news:');
       }

    }

    return (
        <ProtectedRoute>
        <div className="text-center mx-auto mx-4 my-4 py-4">
           <button onClick={handleSave}
            className="bg-blue-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-emerald-400 transition duration-300 ease-in-out items-center  justify-between"
          >
           Save Articles to Db
          </button>
        </div>
        </ProtectedRoute>
    )



}