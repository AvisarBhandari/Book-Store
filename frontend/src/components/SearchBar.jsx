import React, { useEffect, useRef, useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  // Fetch suggestions (debounced)
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
          `http://localhost:5001/api/book/search/suggestions?q=${query}`
        );
        const data = await res.json();
        setSuggestions(data);
        setOpen(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200); // debounce delay
  }, [query]);

  return (
    <div className="relative">
      <form className="relative group" onSubmit={(e) => e.preventDefault()}>
        {/* Search icon */}
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

        {/* Input */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="
            w-[240px]
            rounded-full
            border
            px-10 py-2
            text-sm
            transition-all duration-300
            focus:outline-none focus:border-primary
            group-focus-within:w-[300px]
          "
        />

        {/* Clear */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            ✕
          </button>
        )}
      </form>

      {/* Suggestions dropdown */}
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

          {suggestions.map((book) => (
            <div
              key={book._id}
              onMouseDown={() => {
                setQuery(book.title);
                setOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {book.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
