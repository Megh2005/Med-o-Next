/** route for saving articles in db via server-side-rendering on "/api/feeds/route.js" folder */
"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

export default function saveFeeds(){
    useEffect(()=>{
       try {
        const response= fetch("/api/feeds");
       toast.success("saved 1");
        
       } catch (e) {
        toast.error('Failed to fetch news:');
       }

    }, [])

    return (
        <div>
            <h4>Saved</h4>
        </div>
    )



}