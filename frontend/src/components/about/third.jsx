import React from "react";
import cover from "../../assets/cover4.png";

const Third = () => {
  return (
    <section className="bg-base-100 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="ml-25">
            {/* LEFT CONTENT */}

            <svg
              width="567"
              height="612"
              viewBox="0 0 567 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="464" cy="22.5" r="2.5" fill="#7EA68C" />
              <circle cx="464" cy="62.5" r="2.5" fill="#7EA68C" />
              <circle cx="464" cy="102.5" r="2.5" fill="#7EA68C" />
              <circle cx="464" cy="2.5" r="2.5" fill="#7EA68C" />
              <circle cx="464" cy="42.5" r="2.5" fill="#7EA68C" />
              <circle cx="464" cy="82.5" r="2.5" fill="#7EA68C" />
              <circle cx="484" cy="22.5" r="2.5" fill="#7EA68C" />
              <circle cx="484" cy="62.5" r="2.5" fill="#7EA68C" />
              <circle cx="484" cy="102.5" r="2.5" fill="#7EA68C" />
              <circle cx="484" cy="2.5" r="2.5" fill="#7EA68C" />
              <circle cx="484" cy="42.5" r="2.5" fill="#7EA68C" />
              <circle cx="484" cy="82.5" r="2.5" fill="#7EA68C" />
              <circle cx="504" cy="22.5" r="2.5" fill="#7EA68C" />
              <circle cx="504" cy="62.5" r="2.5" fill="#7EA68C" />
              <circle cx="504" cy="102.5" r="2.5" fill="#7EA68C" />
              <circle cx="504" cy="2.5" r="2.5" fill="#7EA68C" />
              <circle cx="504" cy="42.5" r="2.5" fill="#7EA68C" />
              <circle cx="504" cy="82.5" r="2.5" fill="#7EA68C" />
              <circle cx="524" cy="22.5" r="2.5" fill="#7EA68C" />
              <circle cx="524" cy="62.5" r="2.5" fill="#7EA68C" />
              <circle cx="524" cy="102.5" r="2.5" fill="#7EA68C" />
              <circle cx="524" cy="2.5" r="2.5" fill="#7EA68C" />
              <circle cx="524" cy="42.5" r="2.5" fill="#7EA68C" />
              <circle cx="524" cy="82.5" r="2.5" fill="#7EA68C" />
              <circle cx="544" cy="22.5" r="2.5" fill="#7EA68C" />
              <circle cx="544" cy="62.5" r="2.5" fill="#7EA68C" />
              <circle cx="544" cy="102.5" r="2.5" fill="#7EA68C" />
              <circle cx="544" cy="2.5" r="2.5" fill="#7EA68C" />
              <circle cx="544" cy="42.5" r="2.5" fill="#7EA68C" />
              <circle cx="544" cy="82.5" r="2.5" fill="#7EA68C" />
              <circle cx="564" cy="22.5" r="2.5" fill="#7EA68C" />
              <circle cx="564" cy="62.5" r="2.5" fill="#7EA68C" />
              <circle cx="564" cy="102.5" r="2.5" fill="#7EA68C" />
              <circle cx="564" cy="2.5" r="2.5" fill="#7EA68C" />
              <circle cx="564" cy="42.5" r="2.5" fill="#7EA68C" />
              <circle cx="564" cy="82.5" r="2.5" fill="#7EA68C" />

              <rect
                x="29.5002"
                y="39"
                width="498"
                height="545"
                fill="#F0F5FD"
              />
              <image
                href={cover}
                x="30"
                y="39"
                width="500"
                height="545"
                preserveAspectRatio="xMidYMid slice"
              />

              <path d="M557.5 145V611H223.5" stroke="#8FB3F2" />
              <path d="M0.5 408L0.499965 10L334.5 10" stroke="#8FB3F2" />
            </svg>
          </div>

          {/* RIGHT CONTENT */}
          <div className=" ml-10 mt-10 lg:mt-0">
            <div>
              <div className="ml-6 pl-[2.7rem]">
                <h1 className="text-6xl lg:text-7xl font-bold font-poly mt-2">
                  Our Mission
                </h1>
                <p className="text-[#97918B] font-milonga max-w-md mt-6 mb-10">
                  To inspire, empower, and connect readers through the magic of
                  words. We aim to build a community where stories from every
                  corner of the world are celebrated, shared, and cherished one
                  verse at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Third;
