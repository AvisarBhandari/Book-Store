import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import BookCard from "./bookCard";

/* ---------------- Skeleton Card ---------------- */
function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 h-full animate-pulse">
      {/* Cover */}
      <div className="w-[120px] h-[180px] bg-gray-200 rounded-xl" />

      {/* Content */}
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

/* ---------------- Carousel ---------------- */
export default function BookCarousel({ title, fetchUrl, seeMoreType }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadBooks() {
      try {
        const res = await fetch(fetchUrl);
        const data = await res.json();

        // keep skeleton for 200ms after data arrives
        setTimeout(() => {
          if (mounted) {
            setBooks(data.books || []);
            setLoading(false);
          }
        }, 100);
      } catch (err) {
        console.error("Failed to load books", err);
        setLoading(false);
      }
    }

    loadBooks();

    return () => {
      mounted = false;
    };
  }, [fetchUrl]);

  return (
    <section className="w-full px-[72px] py-6 bg-gray-50 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-semibold">{title}</h2>
        <button
          onClick={() => navigate(`/browserpage?type=${seeMoreType}`)}
          className="text-sm text-gray-500 hover:text-black"
        >
          see all
        </button>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          className="book-prev absolute -left-6 top-1/2 -translate-y-1/2
          h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center
          hover:bg-gray-100 transition z-10"
        >
          ‹
        </button>

        {/* Right Arrow */}
        <button
          className="book-next absolute -right-6 top-1/2 -translate-y-1/2
          h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center
          hover:bg-gray-100 transition z-10"
        >
          ›
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".book-prev",
            nextEl: ".book-next",
          }}
          slidesPerView={3}
          spaceBetween={32}
          onSlideChange={(swiper) => {
            swiper.isBeginning
              ? swiper.el.classList.add("hide-prev")
              : swiper.el.classList.remove("hide-prev");

            swiper.isEnd
              ? swiper.el.classList.add("hide-next")
              : swiper.el.classList.remove("hide-next");
          }}
          breakpoints={{
            320: { slidesPerView: 1.1, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
          }}
        >
          {(loading ? Array.from({ length: 3 }) : books).map((book, index) => (
            <SwiperSlide key={book?._id || index}>
              {loading ? <BookCardSkeleton /> : <BookCard bookId={book._id} />}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
