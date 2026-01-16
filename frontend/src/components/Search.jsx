import React, { useState, useEffect } from "react";
import BookCard from "../components/bookCard.jsx";
import { data, useSearchParams } from "react-router-dom";
import { FiStar } from "react-icons/fi";

function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 h-full animate-pulse">
      <div className="w-[120px] h-[180px] bg-gray-200 rounded-xl" />
      <div className="flex flex-col flex-1">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 rounded mb-2 w-full" />
        <div className="h-3 bg-gray-200 rounded mb-4 w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="mt-auto flex gap-3">
          <div className="h-[38px] w-[120px] bg-gray-200 rounded-xl" />
          <div className="h-[38px] w-[38px] bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

const Search = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const categories = searchParams.get("categories") || "";

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    bestseller: false,
    discount: false,
    new: false,
    minPrice: "",
    maxPrice: "",
    minRating: 0,
    ratingSort: false, // true if sort by rating
  });

  // Build URL with all filters
  const buildUrl = () => {
    const querys = new URLSearchParams();
    querys.append("page", page);

    // FILTERS
    if (filters.bestseller) querys.append("filter", "bestseller");
    else if (filters.discount) querys.append("filter", "discount");
    else if (filters.new) querys.append("filter", "new");
    else if (filters.ratingSort) querys.append("filter", "rating");

    if (filters.minPrice) querys.append("minPrice", filters.minPrice);
    if (filters.maxPrice) querys.append("maxPrice", filters.maxPrice);
    if (filters.minRating) querys.append("minRating", filters.minRating);

    if (categories) {
      return `http://localhost:5001/api/search/filter?categories=${categories.toString()}`;
    } else {
      return `http://localhost:5001/api/search/fuzzy?q=${querys.toString()}`;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildUrl());
      const data = await response.json();

      console.log("SEARCH RESPONSE:", data);
      const books = data.data || data.books || [];
      const totalPages = data.totalPages || data.pages || 1;

      setResults(books);
      setPages(totalPages);
    } catch (err) {
      console.error(err);
      setResults([]);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  // reset page when filters/query change
  useEffect(() => {
    setPage(1);
  }, [query, filters]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    fetchData();
  }, [query, filters, page]);

  // Star filter component
  const StarFilter = () => {
    return (
      <div className="flex gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setFilters((prev) => ({ ...prev, minRating: star }))}
            className={`flex items-center gap-1 ${
              filters.minRating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            <FiStar /> {star}+
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* FILTER SIDEBAR */}
      <aside className="h-screen border-r px-6">
        <h2 className="text-sm font-semibold mb-6 text-[#848484] mt-8">
          Filter By
        </h2>

        {/* Checkboxes */}
        <div className="space-y-3">
          {["bestseller", "discount", "new"].map((key) => (
            <label
              key={key}
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [key]: e.target.checked,
                  }))
                }
                className="checkbox checkbox-sm"
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}

          {/* Sort by rating */}
          <label className="flex items-center gap-2 cursor-pointer text-sm mt-2">
            <input
              type="checkbox"
              checked={filters.ratingSort}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  ratingSort: e.target.checked,
                }))
              }
              className="checkbox checkbox-sm"
            />
            Sort by Rating
          </label>
        </div>

        {/* Price Range */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3 text-[#848484]">
            Price Range
          </h3>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
              }
              className="input input-sm input-bordered w-full"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
              }
              className="input input-sm input-bordered w-full"
            />
          </div>
        </div>

        {/* Min Rating */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3 text-[#848484]">
            Minimum Rating
          </h3>
          <StarFilter />
        </div>

        {/* Reset */}
        <button
          onClick={() =>
            setFilters({
              bestseller: false,
              discount: false,
              new: false,
              minPrice: "",
              maxPrice: "",
              minRating: 0,
              ratingSort: false,
            })
          }
          className="btn hover:bg-transparent btn-sm btn-ghost mt-6"
        >
          Reset Filters
        </button>
      </aside>

      {/* RESULTS */}
      <section className="col-span-3 p-6">
        <div>
          <h2 className="text-lg font-semibold mb-6">
            {categories
              ? `Books in "${categories}"`
              : `Search Results for "${query}"`}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length ? (
            <div className="grid grid-cols-2 gap-6">
              {results.map((book) => (
                <BookCard key={book._id} bookId={book._id} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No results found</p>
          )}
          {pages > 1 && !loading && (
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
      </section>
    </div>
  );
};

export default Search;
