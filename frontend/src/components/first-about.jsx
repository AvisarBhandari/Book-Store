import { useEffect, useState } from "react";
import HeroBook from "./AboutBook.jsx";

function HeroBookSkeleton({ layer }) {
  const layers = {
    front: "z-30 scale-100 translate-x-0",
    middle: "z-20 scale-[0.9] translate-x-[130px]",
    back: "z-10 scale-[0.8] translate-x-[250px]",
  };

  return (
    <div
      className={`
        absolute bottom-0
        w-[300px] lg:w-[340px]   
        h-[440px] lg:h-[500px]  
        rounded-xl
        bg-base-300 animate-pulse
        shadow-2xl              
        ${layers[layer]}
      `}
    />
  );
}

export default function Hero() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/book/filterBooks?sort=bestseller")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data?.books?.slice(0, 3));
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-base-100 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* LEFT */}
          <div className="ml-6">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              Every Reader
              <br /> Deserves a Verse
            </h1>

            <p className="text-base-content/70 max-w-md mt-6 mb-8">
              Read Verse was born from the belief that stories connect us — one
              page, one emotion, one verse at a time.
            </p>

            <button className="btn btn-neutral rounded-none hover:bg-white hover:text-black">
              Browse Books
            </button>
          </div>

          {/* RIGHT BOOK COVERS */}
          <div
            className="
   
  "
          >
            <div className=" h-[420px] lg:h-[480px] box-content ml-30 items-center">
              {loading ? (
                <>
                  <HeroBookSkeleton layer="back" />
                  <HeroBookSkeleton layer="middle" />
                  <HeroBookSkeleton layer="front" />
                </>
              ) : (
                <>
                  {books[2] && (
                    <HeroBook
                      layer="back"
                      image={`http://localhost:5001/${books[2].coverImage}`}
                    />
                  )}

                  {books[1] && (
                    <HeroBook
                      layer="middle"
                      image={`http://localhost:5001/${books[1].coverImage}`}
                    />
                  )}

                  {books[0] && (
                    <HeroBook
                      layer="front"
                      image={`http://localhost:5001/${books[0].coverImage}`}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
