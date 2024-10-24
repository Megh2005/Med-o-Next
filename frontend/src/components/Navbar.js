"use client";

import { useContext, useState } from "react";
import { AuthContext, useAuth } from "../context/AuthContext";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faSignOutAlt,
  faUserCheck,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

const AuthForm = dynamic(() => import("./AuthForm"), { ssr: false });

export default function Navbar() {
  
  const { user, userEmail, adminAccess, token, isOpen, setIsOpen } = useAuth();


  return (
    <nav className="bg-blue-600 text-white p-4 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap">
        <Link href="/" className="text-2xl font-bold">
          Med-o-Media
        </Link>

        <ul className="flex space-x-6">
          <Link
            href="/"
            className="bg-emerald-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-yellow-400 transition duration-300 ease-in-out items-center  justify-between"
          >
            Home
          </Link>
          <Link
            href="/healthNews"
            className="bg-emerald-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-yellow-400 transition duration-300 ease-in-out items-center  justify-between"
          >
            Hews
          </Link>
          {token && user ? (
            <>
            <li
            className="cursor-pointer bg-gradient-to-r from-sky-500 to-green-400 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex items-center justify-between group relative overflow-hidden"
            onClick={() => setIsOpen(true)}
          >
            <span className="z-10 relative">
              Customize{" "}
              <FontAwesomeIcon icon={faGears} size="lg" className="ml-2" />
            </span>
            <span className="absolute inset-0 bg-white opacity-20 group-hover:opacity-40 transform -skew-x-12 transition duration-500 ease-in-out"></span>
          </li>
              <Link
                href="/myFeeds"
                className="bg-emerald-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-yellow-400 transition duration-300 ease-in-out items-center  justify-between"
              >
                My Feeds
              </Link>
              <Link
                href="/dashboard"
                className="bg-emerald-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-yellow-400 transition duration-300 ease-in-out items-center  justify-between"
              >
                {userEmail && (
                  <p>
                    {userEmail} || <FontAwesomeIcon icon={faUserCheck}/>
                  </p>
                )}
              </Link>
              
            </>
          ) : (
            <li
              className="hover:text-emerald-500 cursor-pointer bg-emerald-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-yellow-600 transition duration-300 ease-in-out items-center  justify-between"
              onClick={() => setIsOpen(true)}
            >
              <FontAwesomeIcon icon={faUserCircle} size="lg" />
            </li>
          )}
        </ul>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <AuthForm setIsOpen={setIsOpen} />
        </div>
      )}
    </nav>
  );
}


