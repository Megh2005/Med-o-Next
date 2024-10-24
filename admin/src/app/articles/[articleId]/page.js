"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase"; 
import { useRouter } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

export default function ArticleDetails() {
    const router = useRouter();
  const { articleId } = useParams(); 
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "userArticles", articleId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle(docSnap.data());
          setStatus(docSnap.data().status);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching article: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const updateArticleStatus = async (newStatus) => {
    try {
      const docRef = doc(db, "userArticles", articleId);
      await updateDoc(docRef, { status: newStatus });
      setStatus(newStatus);
      toast.success("Updated Status", {theme: "dark"})
      router.push("/dashboard"); 
    } catch (error) {
      console.log("Error updating article status: ", error.message);
      toast.warning("Oops error! Try later", {theme: "colored"})
    }
  };

  if (loading) return <Spinner/>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Article Details</h1>
      <ArticleCard article={article} />

      <div className="mt-4">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded mr-2"
          onClick={() => updateArticleStatus("Verified")}
        >
          Mark as Verified
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={() => updateArticleStatus("Failed")}
        >
          Mark as Failed
        </button>
      </div>
    </div>
  );
}
