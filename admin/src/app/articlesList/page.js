"use client";

import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross, faEye } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../utils/firebase";
import Link from "next/link";

export default function ArticlesList() {

  const [loading, setLoading] = useState(false);
  const [articleData, setArticleData] = useState([]);

  const fetchUserArticles = async () => {
    try {
      setLoading(true);
      const articlesRef = query(
        collection(db, "userArticles"),
        where("status", "==", "Pending")
      );
      const querySnapshot = await getDocs(articlesRef);
      if (querySnapshot.empty) {
        setLoading(false);
        console.log("No pending articles found.");
        setArticleData([]);
      } else {
        const articles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log(articles);
        setArticleData(articles);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchUserArticles();
  }, []);

  
  return (
    <div className="flex flex-col space-y-6 p-4">
      <p className="text-2xl font-semibold text-gray-800 text-center">
        All Articles
      </p>
      {loading && <Spinner />}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-5 gap-6 p-4 bg-green-600 text-white font-semibold text-center">
          <span>Published</span>
          <span>Title</span>
          <span>Author</span>
          <span>Status</span>
          <span>Action</span>
        </div>

      <div className="divide-y divide-gray-200">
          {articleData ? (
            articleData.map((article, index) => {
             return <div
                key={index}
                className="grid grid-cols-5 gap-6 items-center p-4 text-center"
              >
                <p className="text-gray-700">{(article.publishedAt)?.split("T")[0]}</p>
                <p className="text-gray-700">{article.title}</p>
                <p className="text-gray-500">{article.author}</p>
                <p>
                <span
                className={`ml-4 px-3 py-1 rounded-full text-sm font-medium 
        ${
          article.status === "Verified"
            ? "bg-green-300 text-green-800"
            : article.status === "Pending"
            ? "bg-yellow-300 text-yellow-800"
            : article.status === "Failed"
            ? "bg-red-300 text-red-800"
            : "bg-gray-300 text-gray-800"
        }`}
              >
                {article.status}
              </span>
                </p>
                <Link
                  href={`/articles/${article.id}`}
                  className="text-emerald-500 hover:text-blue-700 transition duration-200"
                >
                 View  <FontAwesomeIcon icon={faEye} />
                </Link>
              </div>;
            })
          ) : (
            <p className="text-muted text-center">No Pending Articles found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
