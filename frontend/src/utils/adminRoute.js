"use client";

import { useEffect, useState } from 'react';
import { auth, db } from './firebaseConfig'; 
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const adminModerators = ['euf86kgKmTOAw7Gyw1OyNFdHRPy2', 'cNczY3fKmXbjRXOzN3BmazuZort1'];

const ProtectedRoute = ({ children }) => {
    const{user, adminAccess, setAdminAccess}=useAuth();
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && adminModerators.includes(user.uid)) {
        setAdminAccess(true); 
      } else {
        setAdminAccess(false); 
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return <Spinner/>;
  
  return adminAccess ? (
    children
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-red-500 text-4xl font-bold text-center mb-6">
        404! Access Denied
      </h2>
      <Link
        href="/"
        className="px-6 py-3 bg-emerald-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-yellow-400 transition-all duration-300 ease-in-out"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default ProtectedRoute;
