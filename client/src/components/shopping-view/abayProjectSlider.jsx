import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const projects = [
  {
    key: "garment",
    name: "Abay Garment – Gondar",
    fact: "Capacity: 26,000 pcs/day, Employs ~800 staff",
    logo: "/logo/abaygarment.jpg",
  },
  {
    key: "cement",
    name: "Abay Cement – Dejen",
    fact: "2.25 M tonnes/yr, 1,500 jobs",
    logo: "/logo/degenabaycement.jpg",
  },
  {
    key: "steel",
    name: "Bahir Dar Steel Mill",
    fact: "Cold-rolling mill, 4 B Birr investment",
    logo: "/logo/bahirdarsteefactory.jpg",
  },
  {
    key: "wood",
    name: "Wood Factories – Woldia/Debre Tabor/Debre Berhan",
    fact: "3 factories, ~5,000 jobs",
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
      }, 4000);
    }
    return () => clearInterval(timer.current);
  }, [paused]);

  const prev = () => setIdx((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setIdx((i) => (i + 1) % projects.length);

  const { name, fact, logo } = projects[idx];

  return (
    <div
      className="relative w-full max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-0 md:gap-8 px-8 py-12">
        <button
          onClick={prev}
          className="text-blue-500 hover:text-blue-700 bg-white/70 rounded-full p-3 shadow transition"
        >
          <ChevronLeftIcon className="w-10 h-10" />
        </button>

        <div
          key={idx}
          className="flex flex-col md:flex-row items-center gap-8 w-full justify-center animate-fade-in"
        >
          <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <img
              src={logo}
              alt={name}
              className="h-72 w-72 object-contain rounded-xl"
              style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            />
          </div>
          <div className="text-center md:text-left max-w-lg">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 drop-shadow">
              {name}
            </h3>
            <p className="text-xl md:text-2xl text-blue-700 font-medium bg-blue-50 rounded-lg px-4 py-2 inline-block shadow">
              {fact}
            </p>
          </div>
        </div>

        <button
          onClick={next}
          className="text-blue-500 hover:text-blue-700 bg-white/70 rounded-full p-3 shadow transition"
        >
          <ChevronRightIcon className="w-10 h-10" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="mb-6 flex justify-center gap-3">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-5 h-5 rounded-full border-2 border-blue-400 transition-all duration-300 ${
              idx === i ? "bg-blue-500 scale-125" : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
