import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function MagicalHeroImage({ image, title, description }) {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  // Parallax effect: image moves slower than scroll
  const y = useTransform(scrollY, [0, 300], [0, 80]);
  // Subtle zoom effect
  const scale = useTransform(scrollY, [0, 300], [1, 1.08]);

  return (
    <div
      ref={ref}
      className="relative h-72 md:h-96 w-full overflow-hidden rounded-b-3xl shadow-lg mb-8"
    >
      <motion.img
        src={image}
        alt={title}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1, opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, type: "spring" }}
      />
      {/* Magical animated border */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-b-3xl border-b-4 border-blue-400 opacity-40 blur-[2px]"
        animate={{
          boxShadow: [
            "0 0 0px #38bdf8",
            "0 0 20px #38bdf8",
            "0 0 40px #38bdf8",
            "0 0 20px #38bdf8",
            "0 0 0px #38bdf8",
          ],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
      {/* Gradient overlay for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            {title}
          </h1>
          <p className="text-gray-200 mt-2 text-lg md:text-xl">{description}</p>
        </div>
      </div>
    </div>
  );
}