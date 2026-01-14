export default function HeroBook({ image, layer }) {
  const layers = {
    front: {
      base: "z-30 scale-100 translate-x-0",
      hover: "hover:translate-x-[24px]",
    },
    middle: {
      base: "z-20 scale-[0.9] translate-x-[130px]",
      hover: "hover:translate-x-[200px]",
    },
    back: {
      base: "z-10 scale-[0.8] translate-x-[250px]",
      hover: "hover:translate-x-[300px]",
    },
  };

  return (
    <div
      className={`
        absolute bottom-10
        w-[246px] lg:w-[246px]
        h-[403px] lg:h-[403px]
        transition-transform duration-300 ease-out
        cursor-pointer
        ${layers[layer].base}
        ${layers[layer].hover}
      `}
    >
      <img
        src={image}
        alt="Book cover"
        className="
          w-full h-full
          object-cover
          rounded-xl
          shadow-2xl
          pointer-events-none
        "
      />
    </div>
  );
}
