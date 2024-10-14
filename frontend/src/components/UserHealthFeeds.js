"use client";

import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { doc, getDoc} from "firebase/firestore";
import HealthNewsCard from "./HealthNewsCard";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";
import SkeletonLoader from "./SkeletonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";

export default function UserHealthFeed() {
  const [preferences, setPreferences] = useState(null);
  const { user, setLoading, loading, setIsOpen } = useAuth();

  useEffect(() => {
    async function fetchPreferences() {
      try {
        setLoading(true);

        const docRef = await doc(db, "userPreferences", user.uid);
        const docSnap = await getDoc(docRef);
        setLoading(false);

        if (docSnap.exists()) {
          setPreferences(docSnap.data());
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
        // toast.error("No preferences found!");
      }
    }
    fetchPreferences();
  }, [user]);

  if (!preferences) {
    // toast.info(`New here?! Click on Customize to set your updates.`, {theme: "dark"})
    return (
      <SkeletonLoader />
    );
  }

  return (
    <>
      <header className=" flex justify-between flex-wrap gap-4 bg-emerald-400 text-center mx-auto p-4 py-4 m-8">
        <h1 className="inline-block text-center mx-auto max-w-fit text-4xl font-bold px-4">
          Your personalized Health Feed
        </h1>
        <div>
          <li
            className="cursor-pointer bg-gradient-to-r from-yellow-500 to-green-400 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex items-center justify-between group relative overflow-hidden"
            onClick={() => setIsOpen(true)}
          >
            <span className="z-10 relative">
              Customize{" "}
              <FontAwesomeIcon icon={faGears} size="lg" className="ml-2" />
            </span>
            <span className="absolute inset-0 bg-white opacity-20 group-hover:opacity-40 transform -skew-x-12 transition duration-500 ease-in-out"></span>
          </li>
        </div>
      </header>

      {loading && <Spinner />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(preferences).map((topic, index) => {
          if (preferences[topic]) {
            return (
              <>
              <HealthNewsCard
                key={index}
                topic={topic}
                preferences={preferences}
              />
              
              </>
            );
          }
        })}
      </div>
    </>
  );
}
