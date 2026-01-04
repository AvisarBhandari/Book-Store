import React from "react";
import NavBar from "../components/navBar.jsx";
import Hero from "../components/hero.jsx";
import BookCarousel from "../components/BookCarousel.jsx";

const HomePages = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main>
        <Hero />
      </main>
      <BookCarousel
        title="Bestsellers"
        fetchUrl="http://localhost:5001/api/book/filterBooks?sort=bestseller"
        seeMoreType="bestseller"
      />

      homePages
    </div>
  );
};

export default HomePages;
