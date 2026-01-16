import react from "react";
import { NavLink } from "react-router-dom";
import HeroBook from "./Herobook.jsx";
import book1 from "../assets/book1.jpg";
import book2 from "../assets/book2.jpg";
import book3 from "../assets/book3.jpg";

export default function Hero() {
  return (
    <section className="bg-base-100 py-6">
      <div className="container mx-auto px-6 gap-0">
        <div className="grid grid-cols-1 lg:grid-cols-2  items-center">
          {/* LEFT CONTENT */}
          <div className="ml-9">
            <h1 className="text-6xl lg:text-7xl font-bold font-inter">
              For the Love
              <br /> of Reading
            </h1>
            <br />
            <p className="text-base-content/70 max-w-md mb-8">
              A place where stories live, imagination thrives, and every shelf
              holds a new adventure.
            </p>
            <NavLink
              to="/browse"
              className="btn btn-neutral rounded-none hover:bg-white hover:text-black"
            >
              Explore now
            </NavLink>
          </div>

          {/* RIGHT BOOK COVERS */}
          <div
            className="
    flex justify-center items-end
    gap-10 lg:gap-12
    -translate-x-4 lg:-translate-x-8
  "
          >
            <HeroBook
              image={book1}
              title="Out of Illusion"
              subtitle="Charles Forrest Jones"
              delay="150ms"
            />

            <HeroBook
              image={book2}
              title="Nobody Move"
              subtitle="Denman Hunt"
              flipped
              delay="300ms"
              className="translate-y-6"
            />

            <HeroBook
              image={book3}
              title="Demise"
              subtitle="Volume I"
              delay="600ms"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
