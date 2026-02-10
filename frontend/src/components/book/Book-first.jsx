import React, { useState, useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { IoNewspaperOutline } from "react-icons/io5";
import { CiGlobe } from "react-icons/ci";
import { handleEsewaPayment, confirmPurchase } from "../../utils/paymentUtil";
import { toast } from "react-hot-toast";

const BookFirst = ({ book }) => {
  const [expanded, setExpanded] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get("paymentStatus");
    const bookId = searchParams.get("bookId");

    if (paymentStatus && bookId) {
      if (paymentStatus === "success") {
        confirmPurchase(bookId).then((success) => {
          if (success) setCanReview(true);
        });
      } else {
        toast.error("Payment failed or cancelled!");
      }

      // Remove query params
      searchParams.delete("paymentStatus");
      searchParams.delete("bookId");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (!book) return <p className="text-gray-400">Book not found</p>;

  const {
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
  } = book;

  return (
    <div className="max-w-[87rem] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <NavLink to="/" className="hover:text-gray-800">
          Home
        </NavLink>{" "}
        /{" "}
        <NavLink to="/" className="hover:text-gray-800">
          Fiction and Literature
        </NavLink>{" "}
        / <span className="text-gray-800">{title}</span>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Cover + Genres */}
        <div className="col-span-12 md:col-span-3">
          <img
            src={`http://localhost:5001/${coverImage}`}
            alt={title}
            className="w-[225px] h-[335px] object-cover rounded-xl shadow"
          />
          <div className="mt-6 text-sm">
            <p className="font-semibold mb-2">Genres:</p>
            <div className="flex flex-wrap gap-1">
              {genres?.slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Details */}
        <div className="col-span-12 md:col-span-6">
          <h1 className="text-3xl font-semibold mb-1">{title}</h1>
          <p className="text-gray-600 mb-2">
            by{" "}
            <NavLink
              to={`/author/${author}`}
              className="text-gray-900 hover:underline"
            >
              {author}
            </NavLink>
          </p>

          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="text-orange-500">★ {ratings}</span>
            <span className="text-gray-500">{reviewCount} Book Reviews</span>
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

          {/* Unlock review form after purchase */}
          {canReview && (
            <div className="mt-4 p-4 border rounded-lg bg-green-50">
              You can now write a review for this book!
            </div>
          )}
        </div>

        {/* Right: Buy box */}
        <div className="col-span-12 md:col-span-3">
          <div className="border rounded-xl p-4 sticky top-24">
            <div className="mb-4">
              <span className="text-2xl font-semibold">Rs {finalPrice}</span>
              {discountPercentage > 0 && (
                <span className="ml-2 line-through text-gray-400">
                  Rs {price}
                </span>
              )}
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-lg py-2 mb-2 hover:opacity-90">
              <FiShoppingCart />
              Add to basket
            </button>

            <button
              className="w-full border border-black rounded-lg py-2 text-sm hover:bg-gray-100"
              onClick={() => handleEsewaPayment(book)}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFirst;
