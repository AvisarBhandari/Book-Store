import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import AdvancedSearch from "../components/AdvancedSearch.jsx";

const AdvancedSearchPage = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main class="flex-grow">
        <AdvancedSearch />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default AdvancedSearchPage;
