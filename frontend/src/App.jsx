import React from "react";
import { Route, Routes } from "react-router";
import HomePages from "./pages/homePages.jsx";
import AboutPages from "./pages/aboutPages.jsx";
import BrowsePags from "./pages/browsePags.jsx";

const App = () => {
  return (
    <div data-theme="light">
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/about" element={<AboutPages />} />
        <Route path="/browse" element={<BrowsePags />} />
      </Routes>
    </div>
  );
};

export default App;
