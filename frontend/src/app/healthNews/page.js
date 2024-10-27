"use client";
import { useEffect, useState } from "react";
import NewsCard from "../../components/NewsCard";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DbArticles } from "./dbArticles";

export default function HealthNewsPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [filters, setFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const result = await DbArticles();
        setLoading(false);
        setArticles(result);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to fetch news:", { theme: "dark" });
      }
    }

    if (filters.length > 0) {
      setFilteredArticles(
        articles.filter((article) => filters.includes(article.category))
      );
    } else {
      setFilteredArticles(articles);
    }

    fetchNews();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white min-h-screen p-6">
      <header className="bg-emerald-400 text-center mx-auto py-4 mb-8 mt-8">
        <h1 className="inline-block text-center mx-auto max-w-fit text-3xl py-2 font-bold">
        Hews:Trusted HealthNews for a Healthy You! <FontAwesomeIcon icon={faNewspaper} />
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles && currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && <Spinner />}

            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

      {articles && articles.length > articlesPerPage && (
        <Pagination
          articlesPerPage={articlesPerPage}
          totalArticles={articles.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
