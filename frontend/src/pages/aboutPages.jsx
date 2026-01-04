import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";

const AboutPages = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main class="flex-grow"></main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default AboutPages;
