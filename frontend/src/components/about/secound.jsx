import React from "react";
import bookCover1 from "../../assets/bookCover1.jpg";
import bookCover2 from "../../assets/bookCover2.jpg";
import bookCover3 from "../../assets/bookCover3.jpg";

const Second = () => {
  return (
    <section className="bg-base-100 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* LEFT CONTENT */}
          <div>
            <div className="ml-6 pl-[2.7rem]">
              <div className="font-gilroy text-red-700 tracking-[0.5em] ml-3 font">
                A BIT
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold font-inter mt-2">
                About Us
              </h1>
              <p className="text-[#97918B] max-w-md mt-6 mb-10">
                At Read Verse, we believe every page tells a story <br />
                not just the ones written in books, but the stories of
                <br />
                readers who find meaning, comfort, and inspiration
                <br />
                within them.
              </p>
            </div>
            {/* BUTTON — naturally left aligned */}
            <button className="group relative inline-block focus:outline-none hover:drop-shadow-lg">
              <svg
                viewBox="0 0 379 70"
                className=" 
          w-[280px] md:w-[320px]
          transition-transform duration-300 ease-out
          group-hover:-translate-y-1
        "
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter
                    id="shadow"
                    x="-20%"
                    y="-50%"
                    width="140%"
                    height="200%"
                  >
                    <feOffset dy="10" />
                    <feGaussianBlur stdDeviation="8" />
                    <feColorMatrix
                      type="matrix"
                      values="
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0.22 0
              "
                    />
                  </filter>
                </defs>

                {/* Shadow */}
                <path
                  d="M278.96 60.0816C277.423 63.8404 273.765 66.2964 269.704 66.2964H90C84.4772 66.2964 80 61.8192 80 56.2964V11.2964C80 5.77354 84.4772 1.29639 90 1.29639H288.107C295.214 1.29639 300.053 8.50289 297.363 15.0816L278.96 60.0816Z"
                  fill="black"
                  filter="url(#shadow)"
                />

                {/* Main shape */}
                <path
                  d="M278.96 60.0816C277.423 63.8404 273.765 66.2964 269.704 66.2964H90C84.4772 66.2964 80 61.8192 80 56.2964V11.2964C80 5.77354 84.4772 1.29639 90 1.29639H288.107C295.214 1.29639 300.053 8.50289 297.363 15.0816L278.96 60.0816Z"
                  fill="black"
                />
              </svg>

              {/* TEXT — NOW PERFECTLY CENTERED */}
              <span
                className="
    pointer-events-none
    absolute inset-0 ml-[10px] mb-[5px]
    flex items-center justify-center
    text-white font-bold
    tracking-widest uppercase
    text-sm md:text-base
    transition-transform duration-300 ease-out
    group-hover:-translate-y-1
+   -translate-x-2
+   md:-translate-x-3
  "
              >
                Explore More
              </span>
            </button>
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-[550px] h-[550px] relative">
            <img
              src={bookCover1}
              className="w-[86%] h-[29%] object-cover rounded-3xl"
            />

            <img
              src={bookCover2}
              className="w-[86%] h-[54%] object-cover rounded-3xl absolute top-[32%] right-[20%]"
            />

            <img
              src={bookCover3}
              className="w-[40%] h-[40%] object-cover rounded-3xl absolute bottom-0 right-[80%]"
            />

            <div
              className="
    w-[27%] h-[21%]
    bg-black rounded-3xl
    absolute right-[57%] bottom-3
    flex items-center justify-center
    text-white text-center
    font-gilroy text-4xl font-bold
  "
            >
              <div>
                100+ <br />
                Books
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Second;
