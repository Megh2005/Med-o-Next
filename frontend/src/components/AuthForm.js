"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";
import SurveyForm from "./SurveyForm";
import { useRouter } from "next/navigation";

export default function AuthForm({setIsOpen}) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router=useRouter();

  const { login, signup, user, loading } = useAuth();

  const toggleForm = () => setIsSignup((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await signup(email, password); 
        router.refresh();
      } else {
       await login(email, password);
       router.refresh();
      }
    } catch (error) {
      toast.error((error.message), { autoClose: 5000 });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 100 }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
    ><div className="bg-red-500 p-5 rounded-lg shadow-lg relative">
    <button
      className="absolute top-0 right-2 p-2 cursor-pointer hover:bg-yellow-500 rounded"
      onClick={() => setIsOpen(false)}
    >
      <FontAwesomeIcon icon={faClose} />
    </button>
  </div>
      { user 
      ? <SurveyForm user={user} setIsOpen={setIsOpen} /> 
      : <motion.div
        className=" bg-white rounded-lg shadow-lg p-8 w-96"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
      >
        <h2 className="text-2xl text-blue-600 font-bold text-center mb-4">
          {isSignup ? "Sign Up" : "Log In"}
        </h2>
        <form onSubmit={handleSubmit} className="text-sky-500">
          {isSignup && (
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-semibold">
                Name
              </label>
              <div className="flex items-center border rounded px-3 py-2">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-semibold">
              Password
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none"
                required
              />
            </div>
          </div>
          {
            loading 
            ? <Spinner /> 
            : <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
          >
            {isSignup ? "Create Account" : "Log In"}
          </button>
          }
        </form>
        <p className="mt-4 text-center text-gray-500">
          {isSignup ? "Already have an account?" : "New to Med-O-Media?"}{" "}
          <span
            onClick={toggleForm}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {isSignup?
             "Log in" :
             "Sign up"
             }
          </span>
        </p>
      </motion.div>
    }
      <ToastContainer position="top-right" autoClose={5000} />
    </motion.div>
  );
}
