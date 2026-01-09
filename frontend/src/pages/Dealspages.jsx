import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import Deals from "../components/Deals.jsx";

const Dealspages = () => {
  

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
