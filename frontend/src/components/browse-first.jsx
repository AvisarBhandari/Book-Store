import { useEffect, useState } from "react";
import HeroBook from "./browse-book-slide.jsx";

function HeroBookSkeleton({ layer }) {
  const layers = {
    front: "z-30 scale-100 translate-x-0",
    middle: "z-20 scale-[0.9] translate-x-[130px]",
    back: "z-10 scale-[0.8] translate-x-[250px]",
  };

  return (
    <div
      className={`
        absolute bottom-10
         w-[246px] lg:w-[246px]
        h-[403px] lg:h-[403px]
        rounded-xl
        bg-base-300 animate-pulse
        shadow-2xl              
        ${layers[layer]}
      `}
    />
  );
}

export default function BrowseFirst() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/search/filter?sort=new")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data?.books?.slice(0, 3));
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-base-100  py-15 relative overflow-hidden">
      <div className="container mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* LEFT */}
          <div className="ml-6 pl-[2.7rem]">
            <h1 className="text-xl lg:text-5xl font-semibold leading-tight">
              New Releases This Week
            </h1>

            <p className="text-base-content/70 max-w-md mt-6 mb-8">
              It's time to update your reading list with some of the latest and
              greatest releases in the literary world. From heart-pumping
              thrillers to captivating memoirs, this week's new releases offer
              something for everyone
            </p>
          </div>

          {/* RIGHT BOOK COVERS */}
          <div
            className="
   
  "
          >
            <div className=" h-[403px]  lg:h-[480px] box-content ml-30 items-center">
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
