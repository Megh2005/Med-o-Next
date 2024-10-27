"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/Spinner";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function AuthForm() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router=useRouter();

  const { login, signup, user, loading } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await login(email, password);
       router.refresh();
      
    } catch (error) {
      toast.error((error.message), { theme: "colored" });
      console.log(error.message);
    }
  };

  return (
    <>
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 p-8">

  <div className="hidden md:block md:w-1/2 lg:w-2/5">
    <img
      src="https://t4.ftcdn.net/jpg/10/33/08/99/240_F_1033089987_4mggnP5cqz7yQn9PtGMTdv9WRzn85jDT.jpg" 
      alt="Branded Image"
      className="object-cover w-full h-auto rounded-lg shadow-lg"
    />
  </div>

  <div className="md:w-1/2 lg:w-2/5 bg-white rounded-lg shadow-lg p-8 flex flex-col justify-center gap-4 items-center">
    <h2 className="text-2xl text-blue-600 font-bold text-center mb-4">
       Admin LogIn
    </h2>
    <form onSubmit={handleSubmit} className="text-sky-500 w-full">
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
      {loading ? (
        <Spinner />
      ) : (
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
        >
          Log In
        </button>
      )}
    </form>
    
  </div>
</section>

    </>
  );
}
