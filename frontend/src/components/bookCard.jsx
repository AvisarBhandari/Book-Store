import { useEffect, useRef, useState } from "react";

const BookCard = ({
  image,
  title,
  subtitle,
  flipped = false,
  delay = "0ms",
  className = "",
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        flex flex-col items-center text-center flex-shrink-0
        transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        ${className}
      `}
      style={{ transitionDelay: delay }}
    >
      {/* HOVER + FLOAT WRAPPER */}
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const rotateX = (y / rect.height - 0.5) * -6;
          const rotateY = (x / rect.width - 0.5) * 6;

          e.currentTarget.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "perspective(800px) rotateX(0deg) rotateY(0deg)";
        }}
        className="
          animate-float
          transition-transform duration-300 ease-out
          hover:-translate-y-4
          hover:[animation-play-state:paused]
        "
      >
        {/* IMAGE */}
        <img
          src={image}
          alt={title}
          className={`
            w-[230px] h-[360px]
            object-cover
            transition-transform duration-500 ease-out
            hover:rotate-[-1deg]
            ${flipped ? "scale-y-[-1]" : ""}
            [clip-path:path('M_0,115_A_115,115_0_0,1_230,115_L_230,360_L_0,360_Z')]
            ${
              flipped
                ? "shadow-[0_-20px_40px_rgba(0,0,0,0.25)]"
                : "shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
            }
          `}
        />
      </div>

      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
};

export default BookCard;
