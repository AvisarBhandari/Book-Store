import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import BookMark from "../components/BookMark.jsx";
const BookMarkPages = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      <main class="flex-grow">
        <BookMark />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default BookMarkPages;
