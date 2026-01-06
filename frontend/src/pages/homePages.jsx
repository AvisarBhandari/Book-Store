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
      <main className=" pb-8">
        <Hero />
      </main>
      <div className="drop-shadow-lg w-full shadow-xl h-12 bg-white " />

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
