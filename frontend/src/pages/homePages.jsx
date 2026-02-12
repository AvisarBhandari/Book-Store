import React from "react";
import NavBar from "../components/navBar.jsx";
import Hero from "../components/hero.jsx";
import BookCarousel from "../components/BookCarousel.jsx";
import Footer from "../components/footer.jsx";
import OfferSection from "../components/OfferSection.jsx";
import { useAuthRedirect } from "../utils/auth.jsx";
import Loader from "../components/Loader.jsx";

const HomePages = () => {
  const loading = useAuthRedirect();

  if (loading) {
    // Show loader while checking
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="pb-8">
        <Hero />
      </main>
      <div className="w-full h-1 bg-gray-200 shadow-sm" />
      <BookCarousel
        title="Bestsellers"
        fetchUrl="http://localhost:5001/api/search/filter?limit=12&sort=bestseller"
        seeMoreType="bestseller"
      />
      <div className="pb-8">
        <OfferSection />
      </div>
      <Footer />
    </div>
  );
};

export default HomePages;
