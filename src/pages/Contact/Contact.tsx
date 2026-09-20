import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-2xl w-full bg-white shadow-2xl rounded-3xl p-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-center mb-8 text-gray-800"
        >
          Get in Touch
        </motion.h2>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              rows={4}
              placeholder="Write your message..."
              className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            ></motion.textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Send Message
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          <p>We’ll get back to you as soon as possible.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
