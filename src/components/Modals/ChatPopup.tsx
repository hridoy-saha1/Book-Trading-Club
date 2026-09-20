import { useEffect, useState, useRef } from "react";
import { TbXboxXFilled } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  type: "user" | "ai";
  text: string;
}

const presetQA: { question: string; answer: string }[] = [
  {
    question: "How can I order books?",
    answer: "You can browse books on our platform and click 'Order'. Follow the checkout process to complete your order."
  },
  {
    question: "Are the books free or paid?",
    answer: "Most books are available for exchange, some may have a cost depending on the seller's settings."
  },
  {
    question: "How to become a seller?",
    answer: "Click on 'Become a Seller' on the homepage, complete your profile, and start listing your books."
  },
  {
    question: "How do I track my orders?",
    answer: "Go to your Dashboard → Orders to track the status of your orders in real-time."
  },
  {
    question: "How to contact support?",
    answer: "You can reach our support via the 'Help Center' page or directly through this chat."
  },
  {
    question: "How does ShelfShare work?",
    answer: "ShelfShare is a community-driven platform to buy, sell, or exchange books easily with other users locally."
  }
];

const ChatPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreset, setShowPreset] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show chat popup after 3s
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle sending a question/answer
  const handleQuestionClick = (qa: { question: string; answer: string }) => {
    // Add user message
    const userMsg: Message = { type: "user", text: qa.question };
    setMessages((prev) => [...prev, userMsg]);

    // Hide preset questions
    setShowPreset(false);

    // Show typing indicator
    setLoading(true);

    setTimeout(() => {
      const aiMsg: Message = { type: "ai", text: qa.answer };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1500); // simulate typing delay
  };

  const handleSend = (msg?: string) => {
    if (!msg && !input.trim()) return;
    const text = msg ?? input;

    // Add user message
    const userMsg: Message = { type: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Show typing indicator
    setLoading(true);

    // Simulate AI response (replace with real API call if needed)
    setTimeout(() => {
      const aiMsg: Message = {
        type: "ai",
        text: "ShelfAI: Sorry, I can only answer preset questions for now."
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {!isOpen ? (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-gray-500 dark:bg-gray-300 text-white dark:text-black rounded-full px-4 py-3 shadow-lg hover:opacity-90 transition-all duration-300"
            >
              💬 Chat with ShelfAI
            </button>
          ) : (
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-xl w-80 h-96 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-primary dark:bg-gray-600 text-white p-3 flex justify-between items-center rounded-t-2xl">
                <h2 className="font-semibold text-sm">ShelfAI Assistant</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:text-gray-200 transition text-white"
                >
                  <TbXboxXFilled />
                </button>
              </div>

              {/* Preset Questions */}
              {showPreset && (
                <div className="flex flex-col gap-2 p-3 overflow-y-auto">
                  {presetQA.map((qa, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuestionClick(qa)}
                      className="text-left px-3 py-1 bg-sand-100 dark:bg-gray-700 text-text-main dark:text-white rounded-lg hover:bg-primary/20 dark:hover:bg-leaf-500/50 transition"
                    >
                      {qa.question}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${msg.type === "user" ? "text-right" : "text-left"}`}
                  >
                    <span
                      className={`inline-block px-3 py-1 rounded-lg ${
                        msg.type === "user"
                          ? "bg-primary text-white dark:bg-gray-50 dark:text-black"
                          : "bg-sand-200 dark:bg-gray-700 text-text-main dark:text-white"
                      }`}
                    >
                      {msg.text}
                    </span>
                  </motion.div>
                ))}

                {/* Loading */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-left"
                    >
                      <span className="inline-block px-3 py-1 rounded-lg bg-sand-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 italic animate-pulse">
                        ShelfAI is typing...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-border rounded-lg p-2 text-sm focus:ring-1 focus:ring-accent dark:focus:ring-white outline-none bg-card dark:bg-gray-700 text-text-main dark:text-white"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={() => handleSend()}
                  className="bg-primary dark:bg-gray-300 text-white dark:text-black px-3 rounded hover:opacity-90 transition"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default ChatPopup;
