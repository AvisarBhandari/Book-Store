import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5001/api/search/filter?sort=discount";

/* Smooth shield silhouette (rounded bottom) */
const SHIELD_PATH =
  "path('M12.5% 6% Q50% -4% 87.5% 6% V56% C87.5% 76% 66% 92% 50% 96% C34% 92% 12.5% 76% 12.5% 56% Z')";

/* 4 hover pieces */
const PIECES = [
  { x: -6, y: -6, inset: "inset(0 50% 50% 0)" },
  { x: 6, y: -6, inset: "inset(0 0 50% 50%)" },
  { x: -6, y: 6, inset: "inset(50% 50% 0 0)" },
  { x: 6, y: 6, inset: "inset(50% 0 0 50%)" },
];

export default function OfferSection() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.success) {
          setBooks(data.books.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <section className="py-4 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-lg font-semibold mb-14">Offers</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ShieldSkeleton key={i} />
              ))
            : books.map((book) => (
                <Shield
                  key={book._id}
                  book={book}
                  onClick={() => navigate(`/book/${book._id}`)}
                />
              ))}
        </div>

        <div className="flex justify-center mt-16">
          <button
            onClick={() => navigate("/deals")}
            className="px-6 py-2  bg-gray-900 text-white text-sm hover:border-black hover:drop-shadow-lg  transition"
          >
            See all
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Shield ---------------- */
function Shield({ book, onClick }) {
  const imageUrl = `http://localhost:5001/${book.coverImage
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")}`;

  return (
    <div
      className="relative w-[260px] h-[340px] overflow-hidden"
      style={{ clipPath: SHIELD_PATH }}
    >
      {PIECES.map((piece, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 cursor-pointer"
          whileHover={{ x: piece.x, y: piece.y }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          style={{
            clipPath: piece.inset,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={onClick}
        >
          <div className="absolute inset-0 bg-black/10 flex items-end justify-center">
            <span className="mb-3 text-xs font-semibold text-white">
              {book.discountPercentage}% OFF
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- Skeleton ---------------- */

function ShieldSkeleton() {
  return (
    <div
      className="w-[260px] h-[340px] bg-gray-200 animate-pulse"
      style={{ clipPath: SHIELD_PATH }}
    />
  );
}
