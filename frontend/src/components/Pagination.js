
export default function Pagination({ articlesPerPage, totalArticles, paginate, currentPage }) {
  const pageNumbers = [];

  // Calculate total number of pages
  for (let i = 1; i <= Math.ceil(totalArticles / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-6">
      <nav>
        <ul className="flex space-x-2">
          {currentPage > 1 && (
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Previous
              </button>
            </li>
          )}

          {/* Page Numbers */}
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-4 py-2 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded hover:bg-blue-600`}
              >
                {number}
              </button>
            </li>
          ))}

          {currentPage < pageNumbers.length && (
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
