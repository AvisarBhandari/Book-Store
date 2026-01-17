import React, { useState } from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import Search from "../components/Search.jsx";
import RateLimited from "../components/RateLimited.jsx";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [isRateLimited, setRateLimited] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar query={query} setQuery={setQuery} />
      </header>

      <main className="flex-grow">
        <Search query={query} />
        {isRateLimited && <RateLimited />}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default SearchPage;
