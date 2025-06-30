import { useRef, useEffect, useState } from "react";

export default function LogoCarousel({ items, speed = 0.5 }) {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    let animationId;

    const scrollLogos = () => {
      if (container && !isPaused) {
        container.scrollBy({ left: speed, behavior: "auto" });

        // Reset scroll to start when halfway (for infinite loop)
        const maxScroll = container.scrollWidth / 2;
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scrollLogos);
    };

    animationId = requestAnimationFrame(scrollLogos);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, speed]);

  return (
    <section className="w-full relative bg-gray-100 dark:bg-gray-800 py-10">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-6">
        Projects from Abay Industrial Development S.C
      </h2>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-100 dark:from-gray-800 to-transparent z-10" />

      {/* Scrolling Logo Container */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex whitespace-nowrap select-none overflow-hidden"
      >
        {/* Triple duplicate for infinite loop effect */}
        {[...items, ...items, ...items].map((item, i) => (
          <div
            key={`${item.key}-${i}`}
            className="flex-shrink-0 flex items-center justify-center px-6"
            style={{ minWidth: "160px" }}
          >
            <img
              src={item.logo}
              alt={item.name}
              className="h-16 md:h-20 lg:h-24 object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
