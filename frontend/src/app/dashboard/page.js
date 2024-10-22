"use client";

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamond, faHeart, faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const { user, setLoading, loading, setToken, userEmail } = useAuth();


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
    <>
      <div className="flex flex-wrap gap-4 align-center justify-evenly py-4 mx-4 my-4">
        <h1 className=" text-emerald-400 text-3xl py-2 font-bold">
        Dashboard <FontAwesomeIcon icon={faUserShield} />
        </h1>

        <button
          className="cursor-pointer bg-emerald-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-yellow-400 transition duration-300 ease-in-out items-center  justify-between"
          onClick={logout}
        >
          Logout <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </button>
      </div>
      <div className="flex flex-col flex-wrap md:flex-row py-8 px-6 max-w-4xl mx-auto gap-8 bg-gray-100 rounded-lg shadow-lg">
        <p className="text-gray-700 text-lg leading-relaxed md:w-2/3">
          <strong className="text-emerald-600 font-bold">
            Are you passionate about health?
          </strong>{" "}
          Whether you're a health enthusiast, blogger, content developer,
          doctor, or simply someone who loves sharing health-related insights,
          we invite you to contribute. Submit articles about fitness tips,
          mental strategies, and more. Once approved by our moderators, your
          contributions will join our growing repository of trusted, credible
          health content. Your efforts are greatly appreciated!
          <span className="block mt-4 font-semibold text-gray-900">
            Have any questions? Feel free to{" "}
            <a
              href="mailto:info@healthsite.com"
              className="text-emerald-500 underline hover:text-emerald-700"
            >
              contact us via email
            </a>
            .
          </span>
        </p>
        <div className="flex flex-col space-x-6">
        <Link
          className="inline-flex items-center justify-center cursor-pointer bg-emerald-500 text-white font-semibold h-4 py-5 px-4 rounded shadow-lg border-2 border-transparent transition-all duration-300 ease-in-out hover:bg-yellow-400 hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 active:bg-emerald-600"
          href="/createArticle"
        >
          Submit an Article
          <FontAwesomeIcon icon={faHeart} size="lg" className="ml-2" />
        </Link> <br/>
        <Link
          className="inline-flex items-center justify-center cursor-pointer bg-emerald-500 text-white font-semibold h-4 py-5 px-4 rounded shadow-lg border-2 border-transparent transition-all duration-300 ease-in-out hover:bg-yellow-400 hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 active:bg-emerald-600"
          href="/myArticles"
        >
          My Articles
          <FontAwesomeIcon icon={faHeart} size="lg" className="ml-2" />
        </Link>
        </div>
      </div>
    </>
  );
}
