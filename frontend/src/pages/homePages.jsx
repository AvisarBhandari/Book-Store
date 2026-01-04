import React from "react";
import NavBar from "../components/navBar.jsx";
import Hero from "../components/hero.jsx";
import BookCarousel from "../components/BookCarousel.jsx";
import Footer from "../components/footer.jsx";
import OfferSection from "../components/OfferSection.jsx";

const HomePages = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="drop-shadow-xl/50 pb-8">
        <Hero />
      </main>
      <BookCarousel
        title="Bestsellers"
        fetchUrl="http://localhost:5001/api/book/filterBooks?sort=bestseller"
        seeMoreType="bestseller"
      />
      <div className="pb-5">
        <OfferSection />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePages;
