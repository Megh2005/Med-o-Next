"use client";
import { useState, useEffect } from "react";
import { db } from "../utils/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import SkeletonLoader from "./SkeletonLoader";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HealthNewsCard({ topic }) {
  const [articles, setArticles] = useState([]);
  const { user, setLoading, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const docRef = doc(db, "healthFeeds", topic);
        const docSnap = await getDoc(docRef);
        setLoading(false);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const feeds = data.feeds || [];

          setArticles(feeds);
        }

        router.refresh();
        // toast.success("Your Personalized feed is ready!", { theme: "colored" });
      } catch (e) {
        setLoading(false);
        toast.error("No data found!", { theme: "dark" });
        console.log(e.message);
      }
    }
    fetchArticles();
  }, []);

  return (
    <>
      <div className="flex flex-col py-4 mx-4 my-4">
        <h3 className="text-2xl font-bold border-b-4 border-indigo-400 mb-4 pb-2">
          Latest Updates on:
          <span className="ml-2 inline-block bg-indigo-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
            {topic}
          </span>
          <span className="relative  h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500 text-2xl font-bold mb-4"></span>
          </span>
        </h3>

        {loading && <SkeletonLoader />}
        {articles && articles.length > 0 ? (
          articles.map((article, index) => (
            <div
              key={index}
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:border-yellow-400 duration-300  mb-4 border-solid border-4 m-4 p-4 border-emerald-500 rounded shadow-lg shadow-cyan-500/50 hover:rounded-lg"
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={article.imgUrl || "/assets/a4.png"}
                  alt={article.title}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded"
                />

                <h4 className="text-lg font-semibold mt-2">{article.title}</h4>
                <p className="text-sm text-gray-500">{article.description}</p>
              </a>
              <br />
              <br />
            </div>
          ))
        ) : (
          <p>No articles available for {topic}.</p>
        )}
      </div>
    </>
  );
}
