import { FiHeart, FiShoppingCart } from "react-icons/fi";

export function formatPrice(value) {
  return Number(value).toFixed(2);
}
export default function BookCard({ book }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm p-4 flex gap-4 h-full transition hover:shadow-md">
      {/* LEFT: Cover */}
      <img
        src={`http://localhost:5001/${book.coverImage}`}
        alt={book.title}
        loading="lazy"
        decoding="async"
        className="w-[120px] h-[180px] object-cover rounded-xl"
      />

      {/* RIGHT: Content */}
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
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#FFD84D] px-4 h-[38px] rounded-xl text-sm hover:bg-[#F4C900] transition">
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
