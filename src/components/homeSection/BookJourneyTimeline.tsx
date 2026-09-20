// src/components/HomeSections/BookJourneyTimeline.tsx
import { motion } from "framer-motion";

const steps = [
  {
    step: 1,
    title: "Discover Hidden Gems",
    desc: "Find rare books shared by passionate readers.",
    color: "from-blue-400 to-blue-600",
  },
  {
    step: 2,
    title: "Exchange Effortlessly",
    desc: "Trade books securely with easy communication tools.",
    color: "from-purple-400 to-purple-600",
  },
  {
    step: 3,
    title: "Grow Together",
    desc: "Connect, review, and form meaningful reading circles.",
    color: "from-pink-400 to-pink-600",
  },
];

export default function BookJourneyTimeline() {
  return (
    <section className="py-20 ">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        Your Book Journey with Us 📖
      </h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        {steps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="relative text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl"
          >
            <div
              className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} text-white flex items-center justify-center text-xl font-bold`}
            >
              {item.step}
            </div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
