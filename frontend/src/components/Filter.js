"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../utils/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Filter({ onFiltersChange, topic }) {
  const [categories, setCategories] = useState([
    "mental-health", "fitness", "nutrition", "cardiology", "pediatrics", "yoga"
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const{user, setLoading, loading}=useAuth();
  const router=useRouter();

  useEffect(() => {
    const fetchPreferences = async () => {
      try{
        setLoading(true);
        const docRef = doc(db, "healthFeeds", topic);
        const docSnap = await getDoc(docRef);
        setLoading(false);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const feeds = data.feeds || [];
  
          setArticles(feeds);
        }

      }catch(err){
        setLoading(false);
        console.log(err.message);
      }
     
      
    };
    fetchPreferences();
  }, []);

  const handleCategoryChange = (category) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelected);
  //   // onFiltersChange(newSelected);
  }

    const savePreferences = async () => {
      await setDoc(doc(db, "userPreferences", user.uid), {
        ...categories,
      });
      toast.success("Preferences saved successfully!", {theme: "dark"});
      setIsOpen(false);
      router.reload();
    savePreferences();
  };

  return (
    <div className="flex flex-wrap gap-4 my-6">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-lg ${selectedCategories.includes(category)
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

  