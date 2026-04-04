import React from "react";
import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { confirmPurchase } from "./utils/paymentUtil";
import { toast } from "react-hot-toast";

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
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminIndexPages from "./pages/admin/AdminindexPages.jsx";
import AdminBookManagementPages from "./pages/admin/AdminBookManagementPages.jsx";
import AdminUserManagementPages from "./pages/admin/AdminUserManagementPages.jsx";
import AdminSalesManagementPages from "./pages/admin/AdminSalesManagementPages.jsx";
import AdminSettingsManagementPages from "./pages/admin/AdminSettingsManagementPages.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CategoryBooksPage from "./pages/CategoryBooksPage.jsx";
import ForgetPasswordPage from "./pages/ForgetPasswordPage.jsx";
import RestPasswordPage from "./pages/ResetPasswordPage.jsx";
import UserForgetPasswordPage from './pages/auth-User/UserForgetPasswoerPage.jsx'
import ResetPasswordPage from './pages/auth-User/ResetPasswordPage.jsx'
function PaymentReturnHandler() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    const status = searchParams.get("paymentStatus");
    const rawBookId = searchParams.get("bookId");
    const bookId = rawBookId ? String(rawBookId).split("?")[0].trim() : null;
    if (!status || !bookId || handled.current) return;
    handled.current = true;

    const isMulti = bookId.includes(",");

    if (status === "success") {
      confirmPurchase(bookId).then((ok) => {
        if (ok)
          toast.success(
            "Payment successful! You can now download your book(s).",
          );
        navigate(isMulti ? "/orders" : `/book/${bookId}`, { replace: true });
      });
    } else {
      toast.error("Payment failed or cancelled.");
      navigate("/cart", { replace: true });
    }
    setSearchParams(
      (p) => {
        p.delete("paymentStatus");
        p.delete("bookId");
        return p;
      },
      { replace: true },
    );
  }, [searchParams, setSearchParams, navigate]);

  return null;
}

const App = () => {
  return (
    <div data-theme="light" className="min-h-screen">
      <PaymentReturnHandler />
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
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/categories/:identifier" element={<CategoryBooksPage />} />
        {/* Auth */}
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route
          path="/seller/reset-password/:token"
          element={<RestPasswordPage />}
        />
        <Route
          path="/seller/forgot-password"
          element={<ForgetPasswordPage />}
        />
        <Route path="/seller-register" element={<SellerRegisterpage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminIndexPages />} />
          <Route
            path="book-management"
            element={<AdminBookManagementPages />}
          />
          <Route
            path="user-management"
            element={<AdminUserManagementPages />}
          />
          <Route path="sales" element={<AdminSalesManagementPages />} />
          <Route path="settings" element={<AdminSettingsManagementPages />} />
        </Route>
        {/* User Auth */}
        <Route path="/login" element={<LoginPages />} />
        <Route path="/register" element={<RegisterPages />} />
        <Route path="/forgot-password" element={<UserForgetPasswordPage />} />
        <Route path="/user/reset-password/:token" element={<ResetPasswordPage />} />
        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
