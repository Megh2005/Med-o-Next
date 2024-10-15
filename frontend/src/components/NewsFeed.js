
import { motion } from 'framer-motion';

export default function NewsFeed({ news }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((article, index) => (
        <motion.div
          key={index}
          className="p-4 bg-white shadow-md rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-2">{article.title}</h2>
          <p className="text-gray-700 mb-4">{article.description}</p>
          <a href={article.url} className="text-blue-500 hover:underline" target="_blank">Read more</a>
        </motion.div>
      ))}
    </div>
  );
}
