import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import Hero from "../components/about/first-about.jsx";
import Second from "../components/about/secound.jsx";

const AboutPages = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main className="flex-grow">
        <div className="pt-[4rem]">
          <Hero />
        </div>
        <div className="drop-shadow-lg w-full shadow-xl h-12 bg-white " />
        <div>
          <Second />
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default AboutPages;
