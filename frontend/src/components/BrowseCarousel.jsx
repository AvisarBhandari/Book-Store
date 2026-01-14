import React, { useEffect, useState } from "react";
import BookCarousel from "./BookCarousel.jsx";

const BrowseCarousel = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "http://localhost:5001/api/search/filter/options"
        );

        if (!res.ok) {
          throw new Error("Failed to fetch filter options");
        }

        const data = await res.json();

        // ✅ CORRECT PATH
        const genreList = data?.filters?.genres || [];

        setGenres(genreList);

        // ✅ Auto-select first genre
        if (genreList.length > 0) {
          setSelectedGenre(genreList[0]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return (
    <div className="mt-8 px-20">
      <h2 className="pb-6 font-semibold text-xl">Top Sellers</h2>
      {/* GENRE SELECT */}
      <select
        className="select select-bordered w-full max-w-xs mb-8 "
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        disabled={loading}
      >
        <option disabled selected>
          Choose a genre
        </option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <div className="pb-10">
        {/* CAROUSEL */}
        {selectedGenre && (
          <BookCarousel
            title={selectedGenre}
            fetchUrl={`http://localhost:5001/api/search/filter?limit=12&genres=${selectedGenre}&sort=bestseller`}
            seeMoreType="bestseller"
          />
        )}
      </div>
      <div className="pb-10">
        <BookCarousel
          title="Bestsellers"
          fetchUrl="http://localhost:5001/api/search/filter?limit=12&sort=bestseller"
          seeMoreType="bestseller"
        />
      </div>
      <div className="pb-10">
        <BookCarousel
          title="Highest Rated"
          fetchUrl="http://localhost:5001/api/search/filter?limit=12&sort=rating"
          seeMoreType="rating"
        />
      </div>
    </div>
  );
};

export default BrowseCarousel;
