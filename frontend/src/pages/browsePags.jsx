import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import BrowseFirst from "../components/browse-first.jsx";
import BrowseCarousel from "../components/BrowseCarousel.jsx";
import { useAuthRedirect } from "../utils/auth.jsx";
import Loader from "../components/Loader.jsx";

const BrowsePags = () => {
  const loading = useAuthRedirect();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main class="flex-grow">
        <BrowseFirst />
        <div>
          <BrowseCarousel />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default BrowsePags;
