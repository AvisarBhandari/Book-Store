import React, { useState } from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import Search from "../components/Search.jsx";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar query={query} setQuery={setQuery} />
      </header>

      <main className="flex-grow">
        <Search query={query} />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default SearchPage;
