import React, { useEffect, useState } from "react";
import BookCard from "./bookCard";

const BastSelling = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/search/filter?page&sort=bestseller&page=${pageNumber}`
      );
      const data = await response.json();

      console.log("Deals API response:", data);

      setResults(Array.isArray(data.books) ? data.books : []);
      setPages(data.pages || 1);
      setPage(data.page || 1);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <div className="pb-">
      <h2 className="text-4xl font-bold mb-5 flex py-5 justify-center">
        Bast Selling Books
      </h2>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-base-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500">No deals available</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-20">
          {results.map((book) => (
            <BookCard key={book._id} bookId={book._id} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            className="btn btn-sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(pages)].map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`btn btn-sm ${
                  page === pageNumber ? "btn-primary" : "btn-ghost"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            className="btn btn-sm"
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BastSelling;
