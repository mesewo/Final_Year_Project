import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const projects = [
  {
    key: "garment",
    name: "Abay Garment – Gondar",
    fact: "A modern textile and garment factory with a daily capacity of 26,000 pieces. Employs around 800 staff and supplies both local and international markets with high-quality apparel. The factory is equipped with advanced machinery and focuses on sustainable production practices.",
    tagline: "Textile & Apparel Excellence",
    logo: "/logo/abaygarment.jpg",
  },
  {
    key: "cement",
    name: "Abay Cement – Dejen",
    fact: "One of Ethiopia's largest cement plants, producing 2.25 million tonnes per year. Provides over 1,500 jobs and supports major infrastructure projects across the country. The plant uses state-of-the-art technology to ensure high-quality and environmentally friendly cement production.",
    tagline: "Building Ethiopia's Future",
    logo: "/logo/degenabaycement.jpg",
  },
  {
    key: "steel",
    name: "Bahir Dar Steel Mill",
    fact: "A state-of-the-art cold-rolling mill with a 4 billion Birr investment. Supplies steel products for construction and manufacturing, boosting local industry. The mill is a key player in reducing Ethiopia's reliance on imported steel.",
    tagline: "Strengthening Local Industry",
    logo: "/logo/bahirdarsteefactory.jpg",
  },
  {
    key: "wood",
    name: "Wood Factories – Woldia, Debre Tabor, Debre Berhan",
    fact: "Three advanced wood processing factories producing furniture and construction materials. Together, they create about 5,000 jobs and promote sustainable forestry. These factories are known for their eco-friendly practices and high-quality wood products.",
    tagline: "Sustainable Wood Solutions",
    logo: "/logo/wodiawoodfactory.jpg",
  },
];

export default function AbayProjectsSlider() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!paused) {
      timer.current = setInterval(() => {
        setIdx((i) => (i + 1) % projects.length);
      }, 5000);
    }
    return () => clearInterval(timer.current);
  }, [paused]);

  const prev = () => setIdx((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setIdx((i) => (i + 1) % projects.length);

  return (
    <section className="relative w-full max-w-7xl mx-auto my-16 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 shadow-[0_8px_32px_0_rgba(30,58,138,0.25)] border-4 border-blue-300 transition-transform duration-300 hover:scale-[1.015] hover:shadow-[0_12px_48px_0_rgba(30,58,138,0.35)]">
      <div className="py-10 px-2 md:px-8">
        <h2
          className="text-2xl xs:text-3xl md:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-400 bg-clip-text text-transparent drop-shadow-lg"
          style={{
            letterSpacing: "0.03em",
            textShadow: "0 2px 8px rgba(30,58,138,0.18)",
          }}
        >
          Projects of Abay Industrial Development S.C
        </h2>
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-0 md:gap-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            onClick={prev}
            className="text-blue-500 hover:text-blue-700 bg-white/70 rounded-full p-3 shadow transition"
            aria-label="Previous project"
          >
            <ChevronLeftIcon className="w-10 h-10" />
          </button>

          {/* Slide animation */}
          <div className="relative flex-1 flex justify-center items-center min-h-[320px]">
            {projects.map((project, i) => (
              <div
                key={project.key}
                className={`absolute left-0 right-0 top-0 transition-all duration-700 ease-in-out
                ${
                  i === idx
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-95 z-0"
                }
              `}
                style={{ pointerEvents: i === idx ? "auto" : "none" }}
              >
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full justify-center animate-fade-in">
                  <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg p-2 md:p-6 transition-transform duration-500 hover:scale-105">
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="h-56 w-56 xs:h-72 xs:w-72 md:h-[18rem] md:w-[18rem] object-contain rounded-xl transition-shadow duration-500 hover:shadow-2xl"
                      style={{
                        boxShadow: "0 8px 32px 0 rgba(30,58,138,0.18)",
                      }}
                    />
                  </div>
                  <div className="text-center md:text-left max-w-lg">
                    <h3 className="text-xl xs:text-2xl md:text-3xl font-bold text-blue-900 mb-2 drop-shadow">
                      {project.name}
                    </h3>
                    <div className="text-base md:text-lg text-indigo-700 font-semibold mb-3 italic">
                      {project.tagline}
                    </div>
                    <p className="text-base xs:text-lg md:text-xl text-blue-700 font-medium bg-blue-50 rounded-lg px-4 py-2 inline-block shadow">
                      {project.fact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={next}
            className="text-blue-500 hover:text-blue-700 bg-white/70 rounded-full p-3 shadow transition"
            aria-label="Next project"
          >
            <ChevronRightIcon className="w-10 h-10" />
          </button>
        </div>
        {/* Dash Indicators moved BELOW the slider */}
        <div className="mt-8 flex justify-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-8 h-1 rounded-full border-none transition-all duration-300
              ${
                idx === i
                  ? "bg-blue-700 scale-110 shadow-[0_2px_8px_0_rgba(30,58,138,0.25)]"
                  : "bg-blue-300 hover:bg-blue-500"
              }
            `}
              aria-label={`Go to project ${i + 1}`}
              style={{
                outline: "none",
                border: "none",
                margin: "0 2px",
                cursor: "pointer",
                transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
