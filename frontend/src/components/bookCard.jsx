import { useState, useEffect } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

export function formatPrice(value) {
  return Number(value).toFixed(2);
}

/* Skeleton while loading */
function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 h-full animate-pulse">
      <div className="w-[120px] h-[180px] bg-gray-200 rounded-xl" />
      <div className="flex flex-col flex-1">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 rounded mb-2 w-full" />
        <div className="h-3 bg-gray-200 rounded mb-4 w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="mt-auto flex gap-3">
          <div className="h-[38px] w-[120px] bg-gray-200 rounded-xl" />
          <div className="h-[38px] w-[38px] bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function BookCard({ bookId }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchBook() {
      try {
        const res = await fetch(`http://localhost:5001/api/book/${bookId}`);
        const data = await res.json();

        if (mounted) {
          setBook(data); // assuming API returns the book object directly
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch book:", err);
        setLoading(false);
      }
    }

    fetchBook();

    return () => {
      mounted = false;
    };
  }, [bookId]);

  if (loading) return <BookCardSkeleton />;
  if (!book) return <p className="text-gray-400">Book not found</p>;

  const rawRating = book.ratings ?? 0;
  const Rating = Math.round(Number(rawRating));
  const ratingName = `rating-${book._id}`;
  console.log("Book ratings:", book.ratings);
  return (
    <div className="group bg-white rounded-2xl shadow-sm p-4 flex gap-4 h-full transition hover:shadow-md">
      {/* Cover */}
      <img
        src={`http://localhost:5001/${book.coverImage}`}
        alt={book.title}
        loading="lazy"
        decoding="async"
        className="w-[120px] h-[180px] object-cover rounded-xl"
      />

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
          {book.title}
        </h3>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {book.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm font-semibold">
            Rs {formatPrice(book.finalPrice)}
          </span>

          {book.discountPercentage > 0 && (
            <span className="text-xs line-through text-gray-400">
              Rs {formatPrice(book.price)}
            </span>
          )}
          <span className="text-xs text-green-600 font-semibold">
            {book.discountPercentage}% off
          </span>
        </div>

        {/* ⭐ Rating + Review Count */}
        <div className="flex items-center gap-2 pt-2">
          <div className="rating rating-sm">
            {[1, 2, 3, 4, 5].map((star) => {
              // Ensure we have a valid numeric rating
              const numericRating = book.ratings
                ? Math.round(Number(book.ratings))
                : 0;
              return (
                <input
                  key={star}
                  type="radio"
                  name={`rating-${book._id}`}
                  className="mask mask-star-2 bg-orange-400"
                  checked={star <= numericRating}
                  readOnly
                  tabIndex={-1}
                />
              );
            })}
          </div>

          <span className="text-xs text-gray-500">
            ({book.reviewCount ?? 0})
          </span>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#FFD84D] text-white px-4 h-[38px] rounded-xl hover:drop-shadow-lg text-sm hover:text-black transition">
            <FiShoppingCart />
            Add to basket
          </button>

          <button className="h-[38px] w-[38px] rounded-full border flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 transition">
            <FiHeart />
          </button>
        </div>
      </div>
    </div>
  );
}
