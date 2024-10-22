"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig"; 
import { useRouter } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
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


  if (loading) return <Spinner/>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Article Details</h1>
      
      <ArticleCard article={article} />
    </div>
  );
}
