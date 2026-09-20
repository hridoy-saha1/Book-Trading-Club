// src/components/HomeSections/InspirationalQuotes.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const quotes = [
  {
    text: "A reader lives a thousand lives before he dies.",
    author: "George R.R. Martin",
  },
  {
    text: "Books are a uniquely portable magic.",
    author: "Stephen King",
  },
  {
    text: "So many books, so little time.",
    author: "Frank Zappa",
  },
  {
    text: "The only thing you absolutely have to know is the location of the library.",
    author: "Albert Einstein",
  },
];

export default function InspirationalQuotes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e8fee8] via-[#fff] to-[#f0f9ff] py-24 text-center">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(255,235,160,0.2),_transparent_60%)]"></div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold mb-12 text-gray-800 relative z-10"
      >
        ✨ Inspirational Book Quotes
      </motion.h2>

      <div className="relative max-w-3xl mx-auto h-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col justify-center px-4"
          >
            <p className="text-2xl font-medium text-gray-800 mb-4 leading-relaxed">
              “{quotes[index].text}”
            </p>
            <p className="text-gray-600 text-lg font-semibold">
              — {quotes[index].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {quotes.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              i === index ? "bg-leaf-500 w-6" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
