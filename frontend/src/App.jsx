import React from "react";
import { Route, Routes } from "react-router";
import HomePages from "./pages/homePages.jsx";
import AboutPages from "./pages/aboutPages.jsx";
import BrowsePags from "./pages/browsePags.jsx";
import BookPage from "./pages/bookPage.jsx";

const App = () => {
  return (
    <div data-theme="light">
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/about" element={<AboutPages />} />
        <Route path="/browse/" element={<BrowsePags />} />
        <Route path="/browse/:id" element={<BrowsePags />} />
        <Route path="/book/:id" element={<BookPage />} />
      </Routes>
    </div>
  );
};

export default App;
