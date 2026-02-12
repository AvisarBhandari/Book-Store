import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiDownload } from "react-icons/fi";
import { IoNewspaperOutline } from "react-icons/io5";
import { CiGlobe } from "react-icons/ci";
import { useCart, formatPrice } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { handleEsewaPayment } from "../../utils/paymentUtil";
import { toast } from "react-hot-toast";
import axios from "axios";

const BookFirst = ({ book }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [expanded, setExpanded] = useState(false);

  if (!book) return <p className="text-gray-400">Book not found</p>;

  const {
    _id: bookId,
    title,
    author,
    description,
    coverImage,
    finalPrice,
    price,
    discountPercentage,
    ratings,
    reviewCount,
    pages,
    language,
    genres,
    category,
  } = book;

  const purchased = user?.purchasedBooks?.some(
    (id) => id?.toString() === String(bookId)
  );
  const inCart = isInCart(bookId);

  const handleAddToBasket = () => {
    if (!user) {
      toast.error("Please login to add to basket");
      navigate("/login");
      return;
    }
    addToCart(book);
    toast.success("Added to basket");
  };

  const handleBuy = () => {
    if (!user) {
      toast.error("Please login to buy");
      navigate("/login");
      return;
    }
    handleEsewaPayment(book);
  };

  const handleDownload = async () => {
    if (!user) return;
    try {
      const res = await axios.get(
        `http://localhost:5001/api/book/${bookId}/download`,
        { withCredentials: true, responseType: "blob" },
      );
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = (title || "book").replace(/[^a-z0-9.-]/gi, "_") + ".pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (err) {
      toast.error(err.response?.data?.message || "Download failed");
    }
  };

  return (
    <div className="max-w-[87rem] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <NavLink to="/" className="hover:text-gray-800">Home</NavLink>
        {" / "}
        <NavLink to="/categories" className="hover:text-gray-800">Categories</NavLink>
        {" / "}
        {category && (
          <>
            <NavLink to={`/categories/${encodeURIComponent(category)}`} className="hover:text-gray-800">
              {category}
            </NavLink>
            {" / "}
          </>
        )}
        <span className="text-gray-800">{title}</span>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Cover + FREE DOWNLOAD + Overview */}
        <div className="col-span-12 md:col-span-3">
          <img
            src={`http://localhost:5001/${coverImage}`}
            alt={title}
            className="w-[225px] h-[335px] object-cover rounded-xl shadow"
          />
          {purchased && (
            <button
              onClick={handleDownload}
              className="mt-4 w-[225px] flex items-center justify-center gap-2 bg-[#0ea5e9] text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90"
            >
              <FiDownload />
              FREE DOWNLOAD
            </button>
          )}
          <div className="mt-6 text-sm">
            <p className="font-semibold mb-2">Overview:</p>
            <div className="flex flex-wrap gap-1">
              {genres?.slice(0, 5).map((g) => (
                <NavLink
                  key={g}
                  to={`/search?q=${encodeURIComponent(g)}`}
                  className="text-blue-600 hover:underline"
                >
                  {g}
                </NavLink>
              ))}
              {category && (
                <NavLink
                  to={`/categories/${encodeURIComponent(category)}`}
                  className="text-blue-600 hover:underline"
                >
                  {category}
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Details */}
        <div className="col-span-12 md:col-span-6">
          <h1 className="text-3xl font-semibold mb-1">{title}</h1>
          <p className="text-gray-600 mb-2">
            By{" "}
            <NavLink to={`/author/${author}`} className="text-gray-900 hover:underline">
              {author}
            </NavLink>
          </p>

          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="text-orange-500">★ {ratings ?? 0}</span>
            <span className="text-gray-500">{reviewCount ?? 0} Book Reviews</span>
          </div>

          <h3 className="font-semibold mb-2">Synopsis</h3>
          <p className={`text-sm text-gray-600 ${!expanded && "line-clamp-5"}`}>
            {description}
          </p>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-sm text-blue-600 mt-2 hover:underline"
          >
            {expanded ? "Read Less ↑" : "Read More ↓"}
          </button>

          {/* Other info */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="border rounded-lg p-3 min-w-[140px]">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <IoNewspaperOutline /> Page Cover
              </p>
              <p className="font-medium">{pages || 0} Pages</p>
            </div>
            <div className="border rounded-lg p-3 min-w-[140px]">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <CiGlobe /> Language
              </p>
              <p className="font-medium">{language || "English"}</p>
            </div>
          </div>
        </div>

        {/* Right: Buy box */}
        <div className="col-span-12 md:col-span-3">
          <div className="border rounded-xl p-4 sticky top-24">
            <div className="mb-4">
              <span className="text-2xl font-semibold">
                Rs {formatPrice(finalPrice)}
              </span>
              {discountPercentage > 0 && (
                <span className="ml-2 line-through text-gray-400">
                  Rs {formatPrice(price)}
                </span>
              )}
            </div>

            {purchased ? (
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-lg py-2.5 hover:opacity-90"
              >
                <FiDownload />
                Download
              </button>
            ) : (
              <>
                <button
                  onClick={handleAddToBasket}
                  disabled={inCart}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-lg py-2 mb-2 hover:opacity-90 disabled:opacity-60"
                >
                  <FiShoppingCart />
                  {inCart ? "In cart" : "Add to basket"}
                </button>
                <button
                  className="w-full border border-black rounded-lg py-2 text-sm hover:bg-gray-100"
                  onClick={handleBuy}
                >
                  Buy
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFirst;
