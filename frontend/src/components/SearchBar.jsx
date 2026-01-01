import React from "react";

const SearchBar = () => {
  return (
    <form className="relative group">
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

      <input
        type="text"
        placeholder="Search..."
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

      {/* Clear icon */}
      <button
        type="reset"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 opacity-0 group-focus-within:opacity-100 transition"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
