import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import BrowseFirst from "../components/browse-first.jsx";
import BrowseCarousel from "../components/BrowseCarousel.jsx";

const BrowsePags = () => {
  return (
    <div class="flex flex-col min-h-screen">
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
