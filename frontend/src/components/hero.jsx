export default function Hero() {
  return (
    <section className="bg-base-100 py-16">
      <div className="container mx-auto px-6 gap-0">
        <div className="grid grid-cols-1 lg:grid-cols-2  items-center">
          {/* LEFT CONTENT */}
          <div className="ml-8">
            <h1 className="text-4xl lg:text-7xl font-bold mb-6">
              For the Love <br /> of Reading
            </h1>

            <p className="text-base-content/70 max-w-md mb-8">
              A place where stories live, imagination thrives, and every shelf
              holds a new adventure.
            </p>

            <button className="btn btn-neutral rounded-none hover:bg-white hover:text-black">
              Explore now
            </button>
          </div>

          {/* RIGHT BOOK COVERS */}
          <div className="flex gap-6 justify-center lg:justify-end items-end"></div>
        </div>
      </div>
    </section>
  );
}
