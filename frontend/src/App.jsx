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
import LoginPages from "./pages/auth-User/loginPages.jsx";
import RegisterPages from "./pages/auth-User/RegisterPages.jsx";
import BookMarkPages from "./pages/BookMarkPages.jsx";
import AutherBookPages from "./pages/AutherBookpages.jsx";
import SellerIndexPages from "./pages/seller/SellerindexPages.jsx";
import SellrBookManagerPages from "./pages/seller/sellerbookManagementPages.jsx";
import SellerSettingsPages from "./pages/seller/sellerSettingsPages.jsx";
import SellerDashboardLayout from "./layouts/SellerDashboardLayout.jsx";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout.jsx";
import SellerRegisterpage from "./pages/SellerRegisterPage.jsx";
import AdminIndexPages from "./pages/admin/AdminindexPages.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
const App = () => {
  return (
    <div data-theme="light">
      <Routes>
        {/* main pages */}
        <Route path="/" element={<HomePages />} />
        <Route path="/about" element={<AboutPages />} />
        <Route path="/browse" element={<BrowsePags />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/bookmark" element={<BookMarkPages />} />
        <Route path="/best-selling" element={<BestSelling />} />
        <Route path="/author/:id" element={<AutherBookPages />} />
        <Route path="/deals" element={<Dealspages />} />
        {/* policies */}
        <Route path="/seller-terms" element={<SellerTerms />} />
        <Route path="/terms-of-service" element={<TermsofService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* seller dashboard */}
        <Route path="/seller" element={<SellerDashboardLayout />}>
          <Route index element={<SellerIndexPages />} />
          <Route path="book-management" element={<SellrBookManagerPages />} />
          <Route path="settings" element={<SellerSettingsPages />} />
        </Route>

        {/* dynamic pages */}
        <Route path="/browse/:id" element={<BrowsePags />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Auth */}
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/seller-register" element={<SellerRegisterpage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminIndexPages />} />
        </Route>
        {/* User Auth */}
        <Route path="/login" element={<LoginPages />} />
        <Route path="/register" element={<RegisterPages />} />
        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
