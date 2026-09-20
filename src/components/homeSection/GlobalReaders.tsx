// src/components/HomeSections/GlobalReaders.tsx
import { motion } from "framer-motion";

export default function GlobalReaders() {
  const readers = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    img: `https://i.pravatar.cc/150?img=${i + 10}`,
  }));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#fff] to-[#f0fdf4] py-24">
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-300/40 to-blue-300/40 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/40 to-pink-200/40 blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-800"
        >
          🌎 Global Book Lovers Community
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto"
        >
          Meet passionate readers from all around the world — exchanging stories,
          books, and knowledge every single day.
        </motion.p>

        {/* Floating Avatars */}
        <motion.div
          className="flex flex-wrap justify-center gap-5 mb-10"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { delayChildren: 0.2, staggerChildren: 0.1 },
            },
          }}
        >
          {readers.map((r) => (
            <motion.div
              key={r.id}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative"
            >
              <img
                src={r.img}
                alt="reader"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-white"></span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="italic text-gray-700 text-lg font-medium"
        >
          “10,000+ readers connected — let’s make the world smarter, one book at a time.”
        </motion.p>
      </div>
    </section>
  );
}
