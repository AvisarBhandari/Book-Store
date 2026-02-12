import { useState, useEffect } from "react";
import { FiHeart, FiShoppingCart, FiDownload } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function formatPrice(value) {
  return Number(value).toFixed(2);
}

function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 h-full animate-pulse">
      <div className="w-[120px] h-[180px] bg-gray-200 rounded-xl" />
      <div className="flex flex-col flex-1">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 rounded mb-2 w-full" />
        <div className="h-3 bg-gray-200 rounded mb-4 w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      </div>
    </div>
  );
}

export default function BookCard({ bookId }) {
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const purchased = user?.purchasedBooks?.some(
    (id) => id === bookId || id?.toString() === String(bookId)
  );

  /* ---------------- Fetch book ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/book/${bookId}`);
        const data = await res.json();
        if (mounted) {
          setBook(data);
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    fetchBook();
    return () => (mounted = false);
  }, [bookId]);

  /* ---------------- Bookmark state from user ---------------- */
  useEffect(() => {
    if (!user) {
      setBookmarked(false);
      return;
    }
    const ids = user.bookmarks || [];
    setBookmarked(ids.some((b) => b?.toString() === String(bookId)));
  }, [user, bookId]);

  if (loading) return <BookCardSkeleton />;
  if (!book) return null;

  const inCart = isInCart(book._id);

  /* ---------------- Actions ---------------- */
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (adding) return;
    if (!user) {
      toast.error("Please login to add to basket");
      navigate("/login");
      return;
    }
    setAdding(true);
    addToCart(book);
    setTimeout(() => setAdding(false), 800);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const res = await axios.get(
        `http://localhost:5001/api/book/${bookId}/download`,
        { withCredentials: true, responseType: "blob" },
      );
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = (book?.title || "book").replace(/[^a-z0-9.-]/gi, "_") + ".pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (err) {
      toast.error(err.response?.data?.message || "Download failed");
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to bookmark books");
      navigate("/login");
      return;
    }
    setBookmarked((prev) => !prev);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/user/bookmark",
        { bookId },
        { withCredentials: true },
      );
      const ids = res.data.bookmarks || [];
      const exists = ids.some((b) => b?.toString() === String(bookId));
      setBookmarked(exists);
      toast.success(exists ? "Book bookmarked" : "Bookmark removed");
    } catch {
      setBookmarked((prev) => !prev);
      toast.error("Failed to update bookmark");
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <div
      onClick={() => navigate(`/book/${book._id}`)}
      className="
        cursor-pointer
        bg-white rounded-2xl shadow-sm
        p-4 flex gap-4 h-full
        transition hover:shadow-md
      "
    >
      {/* Cover */}
      <img
        src={`http://localhost:5001/${book.coverImage}`}
        alt={book.title}
        className="w-[120px] h-[180px] object-cover rounded-xl"
      />

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-semibold line-clamp-2">{book.title}</h3>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {book.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="font-semibold text-sm">
            Rs {formatPrice(book.finalPrice)}
          </span>

          {book.discountPercentage > 0 && (
            <span className="text-xs line-through text-gray-400">
              Rs {formatPrice(book.price)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-3">
          {purchased ? (
            <button
              onClick={handleDownload}
              className="bg-[#22c55e] text-white px-4 h-[38px] rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <FiDownload />
              Download
            </button>
          ) : !inCart ? (
            <button
              onClick={handleAddToCart}
              className="bg-[#FFD84D] px-4 h-[38px] rounded-xl text-sm font-medium"
            >
              <FiShoppingCart className="inline mr-2" />
              Add to basket
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/cart");
              }}
              className="btn btn-neutral btn-sm"
            >
              Go to cart
            </button>
          )}

          <button
            onClick={handleBookmark}
            className={`h-[38px] w-[38px] rounded-full border flex items-center justify-center
              ${bookmarked ? "text-red-500" : "text-gray-500 hover:text-red-500"}
            `}
          >
            <FiHeart fill={bookmarked ? "red" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}
