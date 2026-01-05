import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import Hero from "../components/first-about.jsx";

const AboutPages = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main className="flex-grow">
        <div className="pb-10">
          <Hero />
        </div>
        <div className="drop-shadow-lg w-full shadow-xl h-12 bg-white rounded-xl" />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default AboutPages;
