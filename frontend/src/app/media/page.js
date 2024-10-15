/* filtering apidata from plethora of health-related topics and displaying them in card format 
 [slug]--category-wise display--[/api/fitness, '/api/brain', ]
*/
"use client"; 

import Filter from '../../components/Filter';
import ArticleCard from '../../components/ArticleCard';
import { useEffect, useState } from 'react';

export default function MediaPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles(){
        try {
            const response = await fetch("/api/articles"); 
            if (!response.ok) {
              throw new Error("Failed to fetch articles");
            }
            const data = await response.json();
            console.log('data=', data)
            setArticles(data);
          } catch (error) {
            console.error("Error fetching articles:", error);
          }
    }

    fetchArticles();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Med-o-Media</h1>
      <h3><Filter/></h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.length > 0 && articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
