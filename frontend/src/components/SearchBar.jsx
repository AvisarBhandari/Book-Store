import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const goToSuggestion = (item) => {
    if (!item) return;

    if (item.type === "book" && item.bookId) {
      navigate(`/book/${item.bookId}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(item.value)}`);
    }
    setOpen(false);
  };

  /* 🔍 Fetch suggestions */
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5001/api/search/suggestions?q=${query}`
        );
        const data = await res.json();
        setSuggestions(data);
        setOpen(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);
  }, [query]);

  return (
    <div className="relative w-[240px] md:w-[300px]">
      {/* ⬇️ FORM SUBMIT → REDIRECT */}
      <form
        className="relative group"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
          setOpen(false);
        }}
      >
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search books, authors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="
            w-full
            rounded-full
            border
            px-10 py-2
            text-sm
            transition-all duration-300
            focus:outline-none focus:border-primary
          "
        />
      </form>

      {/* Suggestions */}
      {open && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border z-50 max-h-60 overflow-y-auto">
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-400">Searching...</div>
          )}

          {!loading && suggestions.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-400">
              No results found
            </div>
          )}

          {!loading &&
            suggestions.map((item, idx) => (
              <div
                key={idx}
                onMouseDown={() => goToSuggestion(item)}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              >
                {item.type === "book" && item.coverImage ? (
                  <img
                    src={`http://localhost:5001/${item.coverImage}`}
                    alt={item.value}
                    className="w-8 h-10 object-cover rounded mr-3"
                  />
                ) : (
                  <span className="w-8 h-10 flex items-center justify-center mr-3 text-gray-500 text-xs uppercase">
                    {item.type[0]}
                  </span>
                )}
                <div className="flex flex-col">
                  <span>{item.value}</span>
                  {item.type !== "book" && (
                    <span className="text-gray-400 text-xs">{item.type}</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
