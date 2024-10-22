"use client"; 

import Filter from '../../components/Filter';
import ArticleCard from '../../components/ArticleCard';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../../utils/adminRoute';

export default function MediaPage() {
  const [healthArticles, setHealthArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles(){
        try {
            const response = await fetch("/api/validate"); 
            if (!response.ok) {
              throw new Error("Failed to fetch articles");
            }
            const data = await response.json();
            console.log('data=', data)
            setHealthArticles(data);
          } catch (error) {
            console.error("Error fetching articles:", error);
          }
    }

    fetchArticles();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Med-o-Media</h1>
      <h3><Filter/></h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthArticles.length > 0 && healthArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
    </ProtectedRoute>
  );
}
