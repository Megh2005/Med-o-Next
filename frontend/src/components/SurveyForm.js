"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { db } from "../utils/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function SurveyForm({ user, setIsOpen }) {
  const router=useRouter();

  const [topics, setTopics] = useState({
    mentalHealth: false,
    fitness: false,
    nutrition: false,
    cardiology: false,
    pediatrics: false,
    yoga: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setTopics({ ...topics, [name]: checked });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!user || !user.uid) {
      toast.error("User is not authenticated!", {theme: "dark"});
      return;
    }
    try {
      await setDoc(doc(db, "userPreferences", user.uid), {
        ...topics,
      });
      toast.success("Preferences saved successfully!", {theme: "dark"});
      setIsOpen(false);
      router.push("/myFeeds");
      
    } catch (error) {
      console.log(error);
      toast.error("Failed to save preferences", {theme: "dark"});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white text-sky-500 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold ">Select Your Health Topics of Interest</h2>
      <em className="text-xl font-medium  mb-4 text-emerald-500">What you wanna surf through today?</em>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="mentalHealth"
            checked={topics.mentalHealth}
            onChange={handleChange}
            className="mr-2"
          />
          Mental Health
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="fitness"
            checked={topics.fitness}
            onChange={handleChange}
            className="mr-2"
          />
          Fitness
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="nutrition"
            checked={topics.nutrition}
            onChange={handleChange}
            className="mr-2"
          />
          Nutrition
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="cardiology"
            checked={topics.cardiology}
            onChange={handleChange}
            className="mr-2"
          />
          Cardiology
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="pediatrics"
            checked={topics.pediatrics}
            onChange={handleChange}
            className="mr-2"
          />
          Pediatrics
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="yoga"
            checked={topics.yoga}
            onChange={handleChange}
            className="mr-2"
          />
          Yoga
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-emerald-500"
        >
          Save & Dive in! <FontAwesomeIcon icon={faHeartCircleCheck} />
        </button>
      </form>
    </motion.div>
  );
}
