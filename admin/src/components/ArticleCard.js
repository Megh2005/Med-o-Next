// A reusable component to display each article in a card format.
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function ArticleCard({ article }) {
  return (
    <div className="card bg-white border border-green-500 mb-6 mt-4 rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <img
            className="w-full h-auto rounded-l-lg object-cover"
            src={article.articleImg ? article.articleImg : "/a1.png"}
            alt="Article img"
          />
        </div>
        <div className="col-span-3">
          <div className="card-header bg-emerald-600 text-white p-4">
            <h5 className="text-lg font-bold">
              {article.title}
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
            </h5>
          </div>

          <div className="card-body p-4 space-y-4">
            {article.tags && article.tags?.length > 0 && (
              <div className="tags flex items-center space-x-2 mt-3">
                <FontAwesomeIcon icon={faTags} className="text-gray-500" />
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

            <p className="text-gray-600">{article.description}</p>
            <p className="text-sm text-gray-500 mt-4">
              <small>{article.publishedAt?.split("T")[0]}</small>
            </p>
          </div>

          <div className="card-footer bg-transparent border-t border-green-500 p-4 text-gray-700">
            {article.author || "@Unknown"}
          </div>
        </div>
      </div>
    </div>
  );
}
