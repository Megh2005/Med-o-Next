"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '.firebaseConfig'; 
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


const AuthorizedRoute = ({ children }) => {
    const router=useRouter();
    const{user}=useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currUser)=>{
        
        if(currUser){
            setHasAccess(true);
        }else{
            setHasAccess(false);
            router.push("/");
            toast.warn(`Kindly Login to proceed!`, {theme: "dark"});
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return <Spinner/>;
  
  return hasAccess && children ;
};

export default AuthorizedRoute;
