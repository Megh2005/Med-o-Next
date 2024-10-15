
// A reusable component to display each article in a card format.
import Link from 'next/link';

export default function ArticleCard({ article }) {
  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold">
        <Link href={`/media/${article.id}`}>{article.title}</Link>
      </h2>
      <p>{article.content}</p>
      <p className="text-gray-500">By: {article.author}</p>
    </div>
  );
}
