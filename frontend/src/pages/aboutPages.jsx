import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import Hero from "../components/about/first-about.jsx";
import Second from "../components/about/secound.jsx";
import Third from "../components/about/third.jsx";
import Forth from "../components/about/fourth.jsx";
import { useAuthRedirect } from "../utils/auth.jsx";
import Loader from "../components/Loader.jsx";

const AboutPages = () => {
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
          <Third />
          <Forth />
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default AboutPages;
