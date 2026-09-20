import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { useAuth } from '@/firebase/AuthProvider';
import { ImSpinner3 } from 'react-icons/im';
import FileInput from './Input';

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'] as const;
const EXCHANGES = ['Swap', 'Sell', 'Donate'] as const;
const LANGUAGES = [
  'English',
  'Bangla',
  'Hindi',
  'Arabic',
  'Chinese',
  'Other',
] as const;
const CATEGORIES = ['fiction', 'non-fiction', 'education', 'comics'] as const;
const LOCATIONS = [
  'Dhaka',
  'Chattogram',
  'Khulna',
  'Rajshahi',
  'Sylhet',
  'Barishal',
  'Rangpur',
] as const;

const AddBookForm = () => {
  const { user } = useAuth();
  const axiosSecure = UseAxiosSecure();

  // core fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [ISBN, setISBN] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState('');

  // extra fields per model (note the capitalization in the schema)
  const [Location, setLocation] = useState('Dhaka');
  const [Condition, setCondition] = useState('Good');
  const [Exchange, setExchange] = useState('Swap');
  const [Language, setLanguage] = useState('English');
  const [tags, setTags] = useState<string[]>([]);

  // file state
  const [cover, setCover] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleTagInput = (val: string) => {
    // simple comma-separated to chips
    const parts = val
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setTags(parts);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // quick client validation
    if (!title || !author || !category || !description) {
      toast.error('Please fill all required fields.');
      return;
    }
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      toast.error('Price must be a valid non-negative number.');
      return;
    }
    if (!cover) {
      toast.error('Please upload a cover image.');
      return;
    }

    setSaving(true);

    try {
      // 1) Upload to Cloudinary
      const data = new FormData();
      data.append('file', cover);
      data.append('upload_preset', 'Syntax_Surfers_cloudinary');
      data.append('cloud_name', 'dbduiiimr');

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dbduiiimr/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );
      const uploaded = await res.json();
      const imageUrl: string | undefined = uploaded.secure_url || uploaded.url;
      if (!imageUrl) throw new Error('No URL returned from Cloudinary');

      // 2) Build payload EXACTLY matching your schema keys (including capitalized ones)
      const newBook = {
        title,
        author,
        ISBN: ISBN || 'N/A',
        Location,
        Condition,
        Exchange,
        Language,
        category,
        tags,
        price: numericPrice,
        description,
        imageUrl,
        uid: user?.uid, // required in schema
      };
      console.log(newBook);

      // 3) POST to API
      await axiosSecure.post('/api/books', newBook);
      toast.success('Book added successfully!');

      // 4) Reset form
      setTitle('');
      setAuthor('');
      setISBN('');
      setCategory('');
      setPrice('');
      setDescription('');
      setLocation('Dhaka');
      setCondition('Good');
      setExchange('Swap');
      setLanguage('English');
      setTags([]);
      setCover(null);
    } catch (err) {
      console.error('❌ Error adding book:', err);
      toast.error('Failed to add book. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl px-8 pb-8 mt-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            placeholder="Enter book title"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Author *
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            placeholder="Enter author name"
            required
          />
        </div>

        {/* ISBN (optional) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">ISBN</label>
          <input
            type="text"
            value={ISBN}
            onChange={(e) => setISBN(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            placeholder="9780061122415"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            required
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Price ($) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            placeholder="Enter price"
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none resize-none"
            placeholder="Write a short description"
            rows={4}
            required
          />
        </div>

        {/* Location, Condition, Exchange, Language (match Book model) */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Location
            </label>
            <select
              value={Location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Condition
            </label>
            <select
              value={Condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Exchange
            </label>
            <select
              value={Exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            >
              {EXCHANGES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Language
            </label>
            <select
              value={Language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags (comma-separated -> array) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            onChange={(e) => handleTagInput(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-leaf-400 outline-none"
            placeholder="inspirational, journey"
          />
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 bg-leaf-100 text-leaf-800 rounded-full text-sm"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover Image */}
        <FileInput
          label="Cover Image *"
          accept="image/*"
          onSelect={(file) => setCover(file)}
          fileName={cover?.name}
        />

        {/* Submit Button */}
        {!saving ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-leaf-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition"
          >
            Add Book
          </motion.button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-3 bg-leaf-200 text-white font-semibold py-3 rounded-xl shadow-md"
          >
            <ImSpinner3 className="animate-spin text-2xl" />
            Adding
          </button>
        )}
      </form>
    </div>
  );
};

export default AddBookForm;
