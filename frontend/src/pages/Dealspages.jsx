import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import Deals from "../components/Deals.jsx";
import { useAuthRedirect } from "../utils/auth.jsx";
import Loader from "../components/Loader.jsx";

const Dealspages = () => {
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
      <main class="flex-grow">
        <Deals />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );};

export default Dealspages;
