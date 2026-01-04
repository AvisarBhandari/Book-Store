// BookCarousel.jsx
// React + JavaScript
// Swiper v11

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function BookCarousel({ title, fetchUrl, seeMoreType }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch(fetchUrl);
        const data = await res.json();
        setBooks(data.books || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, [fetchUrl]);

  return (
    <section className="w-full px-[72px] py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-semibold tracking-tight">{title}</h2>
        <button
          onClick={() => navigate(`/browserpage?type=${seeMoreType}`)}
          className="text-sm font-medium text-gray-500 hover:text-black"
        >
          see all
        </button>
      </div>

      {/* Carousel */}
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={4}
        spaceBetween={32}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 16 },
          640: { slidesPerView: 2.2, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 32 },
        }}
      >
        {(loading ? Array.from({ length: 4 }) : books).map((book, index) => (
          <SwiperSlide key={book?._id || index}>
            {/* Skeleton */}
            {loading ? (
              <div className="animate-pulse bg-white rounded-2xl p-4">
                <div className="h-[220px] bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-[44px] bg-gray-200 rounded-xl" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-4 h-full flex flex-col">
                <img
                  src={`http://localhost:5001/${book.coverImage}`}
                  alt={book.title}
                  className="h-[220px] w-full object-cover rounded-xl mb-4"
                />

                <h3 className="text-sm font-medium leading-snug line-clamp-2">
                  {book.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1 mb-3">{book.author}</p>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold">
                      Rs {book.finalPrice}
                    </span>
                    {book.discountPercentage > 0 && (
                      <span className="text-xs line-through text-gray-400">
                        Rs {book.price}
                      </span>
                    )}
                  </div>

                  <button className="w-full h-[44px] bg-[#FFD84D] text-sm rounded-xl hover:bg-[#F4C900] transition">
                    Add to basket
                  </button>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
