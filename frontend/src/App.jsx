import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePages from "./pages/homePages.jsx";
import AboutPages from "./pages/aboutPages.jsx";
import BrowsePags from "./pages/browsePags.jsx";
import BookPage from "./pages/bookPage.jsx";
import SellerTerms from "./pages/SellerTerms.jsx";
import TermsofService from "./pages/TermsofService.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Categories from "./pages/categoriesPages.jsx";
import SellerLogin from "./pages/SellerLogin.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import BestSelling from "./pages/bestSellingPages.jsx";
import Dealspages from "./pages/Dealspages.jsx";
import CartPage from "./pages/cartPage.jsx";

const App = () => {
  return (
    <div data-theme="light">
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/about" element={<AboutPages />} />
        <Route path="/browse/" element={<BrowsePags />} />
        <Route path="/browse/:id" element={<BrowsePags />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/seller-terms" element={<SellerTerms />} />
        <Route path="/terms-of-service" element={<TermsofService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/best-selling" element={<BestSelling />} />
        <Route path="/deals" element={<Dealspages />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
