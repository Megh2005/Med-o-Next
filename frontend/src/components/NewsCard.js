export default function NewsCard({ article }) {
  return (
    <div className=" hover:border-yellow-400 duration-300  mb-4 border-solid border-4 m-4 p-4 border-emerald-500 rounded shadow-lg shadow-cyan-500/50 bg-white shadow-lg rounded-lg hover:scale-105 transition ease-in-out delay-150 cursor-pointer">
      <img
        src={article.image ? article.image : '/assets/a5.png'}
        alt={article.title}
        className="w-full h-56 object-cover transition duration-500 hover:opacity-90"
      />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 hover:text-blue-600 transition duration-300">
          {article.title}
        </h2>
        <p className="text-base text-gray-600 mb-4 line-clamp-3">
          {article.description}
        </p>
        <p className="text-base text-emerald-600 m-4">
          {article.publishedAt}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-full inline-block mt-4 transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
        >
          View Full Article
        </a>
      </div>
    </div>
  );
}
