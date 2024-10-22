"use client";

import SkeletonLoader from "@/components/SkeletonLoader";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/utils/firebaseConfig";
import { faCalendarCheck, faCalendarTimes, faEdit, faEye, faFileEdit, faTags, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function MyArticles() {
  const router = useRouter();
  const { user, setLoading, loading } = useAuth();

  const [userBlogs, setUserBlog] = useState([]);
  const[status, setStatus]=useState("");

  const fetchUserArticles = async () => {
    try {
      setLoading(true)
      const queryData = await query(
        collection(db, "userArticles"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(queryData);
      setLoading(false);

      const articles = await querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      await setUserBlog(articles);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
      toast.error(`No Article Found`, { theme: "light" });
    }
  };

  const handleArticleStatus = () => {
    toast.info("Refreshed!");
  };


  useEffect(() => {
    fetchUserArticles();
  }, []);

  return (
    <>
      <div className="my-orders py-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          My Articles
        </h2>

{ loading && <SkeletonLoader />} 
        <div className="container mx-auto px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userBlogs.length > 0 ? (
            userBlogs.map((article, index) => (
              <div
                key={index}
                className="my-articles-article bg-white p-6 rounded-lg shadow-lg space-y-4 transition-all duration-300 hover:shadow-xl"
              >
                {article.articleImg && (
                  <img
                    src={article.articleImg? article.articleImg : "/a1.png"}
                    alt="parcel"
                    className="w-16 h-16 object-contain mx-auto"
                  />
                )}

<div className="flex space-x-6">
                <Link href={`/articles/${article.id}`}
                className="px-2 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500">
                  View <FontAwesomeIcon  icon={faEye}/>
                </Link>
                {
                  article.status === "Pending" &&
                  <Link href={`/articles/${article.id}/edit`}
                  className="px-2 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500">
                    Edit <FontAwesomeIcon  icon={faFileEdit}/>
                  </Link>
                  
                }

                </div>

                <div className="flex justify-between gap-4">
                <p className="text-emerald-700">
                  <span className="font-semibold">Article Title: </span>{" "}
                  {article.title}
                </p>  
                </div>
                
                <p className="text-blue-700">
                  <span className="font-semibold">Author: </span>
                  <FontAwesomeIcon icon={faUserPen} /> {article.author}
                </p>
                <div className="text-gray-700">
                  <span className="font-semibold">Tags: </span>
                  {article.tags && article.tags?.length > 0 && (
                    <div className="tags flex items-center space-x-2 mt-3">
                      <FontAwesomeIcon
                        icon={faTags}
                        className="text-gray-500"
                      />
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium shadow-sm hover:bg-gray-300 transition ease-in-out duration-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Published: </span>
                  <FontAwesomeIcon icon={faCalendarCheck} /> {(article.publishedAt)?.split("T")[0]}
                </p>

                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`ml-4 px-3 py-1 rounded-full text-sm font-medium 
        ${
          article.status === "Verified"
            ? "bg-green-100 text-green-800"
            : article.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : article.status === "Failed"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}
                  >
                    {article.status}
                  </span>
                </p>
                {/* <button className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500">
                  Refresh Status
                </button> */}
                
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No Articles found.
              <Link
                className="inline-flex items-center justify-center cursor-pointer bg-emerald-500 text-white font-semibold h-4 py-5 px-4 rounded shadow-lg border-2 border-transparent transition-all duration-300 ease-in-out hover:bg-yellow-400 hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 active:bg-emerald-600"
                href="/createArticle"
              >
                Submit an Article
                <FontAwesomeIcon icon={faEdit} size="lg" className="ml-2" />
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
