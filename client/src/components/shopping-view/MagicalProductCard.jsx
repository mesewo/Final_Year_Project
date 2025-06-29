import { motion } from "framer-motion";

export default function MagicalProductCard({ product, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92, rotate: -3 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 120,
          damping: 14,
          duration: 0.9,
        },
      }}
      whileHover={{
        scale: 1.07,
        rotate: 2,
        boxShadow: "0 0 50px 10px #38bdf8, 0 2px 30px 0 #0ea5e9",
        background:
          "linear-gradient(135deg,rgba(59,130,246,0.18),rgba(14,165,233,0.13))",
        filter: "brightness(1.07) saturate(1.18)",
        transition: { duration: 0.25, type: "spring" },
      }}
      className="rounded-3xl bg-white/70 backdrop-blur-md border-4 border-blue-300 shadow-xl overflow-hidden cursor-pointer relative group"
      onClick={onClick}
    >
      <motion.div
        className="relative h-56 w-full overflow-hidden"
        initial={{ scale: 1.08, opacity: 0.7 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { delay: 0.2, duration: 0.7, type: "spring" },
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-blue-700/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition duration-500 pointer-events-none"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.9 }}
        />
        <motion.span
          className="absolute top-4 right-4 bg-blue-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6 } }}
        >
          {product.category}
        </motion.span>
      </motion.div>
      <div className="p-6 flex flex-col gap-2">
        <h3 className="text-2xl font-extrabold text-blue-700 drop-shadow">
          {product.name}
        </h3>
        <p className="text-gray-600 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-lg">
                ${product.oldPrice}
              </span>
            )}
            <span className="text-xl font-bold text-blue-600">
              ${product.price}
            </span>
          </div>
          <button
            className="px-4 py-2 rounded-lg bg-blue-400 text-white font-semibold shadow hover:bg-blue-500 transition"
            onClick={(e) => {
              e.stopPropagation();
              if (product.onAddToCart) product.onAddToCart(product._id);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
      {/* Magical animated glow border */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl border-4 border-blue-300 opacity-30 group-hover:opacity-60 blur-[2px] transition"
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
    </motion.div>
  );
}