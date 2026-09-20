// src/pages/Home.tsx
import HeroSection from '@/components/Section/HeroSection';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart } from 'lucide-react';
import WantToBeSellerSection from '@/components/Section/WantToBeSeller';
import TopSellersSection from '@/components/Section/TopSeller';
// react-toastify imported via notify
import notify from '@/lib/notify';
import { useFavorites } from '@/hooks/useFavorites';
import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Loader2 from '@/components/Loaders/Loader2';
import BookJourneyTimeline from '@/components/homeSection/BookJourneyTimeline';
import GlobalReaders from '@/components/homeSection/GlobalReaders';
import InspirationalQuotes from '@/components/homeSection/InspirationalQuotes';

type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  tags: string[];
  location: string;
  condition: 'new' | 'good' | 'fair';
  exchangeType: 'swap' | 'donate' | 'sell';
  language: string;
  genre: string;
  image: string;
};

// API shape (from your Mongoose model)
type ApiBook = {
  _id: string;
  title: string;
  author: string;
  ISBN?: string;
  Location?: string;
  Condition?: string;
  Exchange?: string;
  Language?: string;
  category: string;
  tags?: string[];
  price: number;
  description: string;
  imageUrl: string;
};

// map DB → UI
const normalize = (b: ApiBook): Book => ({
  id: b._id,
  title: b.title,
  author: b.author,
  isbn: b.ISBN ?? 'N/A',
  tags: b.tags ?? [],
  location: (b.Location ?? 'Dhaka').toString(),
  condition: (b.Condition ?? 'Good').toLowerCase() as Book['condition'],
  exchangeType: (b.Exchange ?? 'Swap').toLowerCase() as Book['exchangeType'],
  language: b.Language ?? 'English',
  genre: b.category ?? 'Fiction',
  image: b.imageUrl,
});

export default function Home() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('');
  const [exchangeType, setExchangeType] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

  const { toggleFavorite, isFavorite, isAuthenticated } = useFavorites();

  const axiosSecure = UseAxiosSecure();

  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['home-books'],
    queryFn: async () => {
      const res = await axiosSecure.get<ApiBook[]>('/api/books');
      return res.data;
    },
    select: (apiBooks: ApiBook[]) => apiBooks.map(normalize),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleToggleFavorite = async (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    const bookTitle = book?.title || 'Unknown Book';

    if (!isAuthenticated) {
      notify.error('Please log in to add books to favorites');
      return;
    }

    const wasFavorite = isFavorite(bookId);
    const success = await toggleFavorite(bookId);

    if (success) {
      if (wasFavorite) {
        notify.success(`"${bookTitle}" removed from favourites`);
      } else {
        notify.success(`"${bookTitle}" added to favourites`);
      }
    } else {
      notify.error('Failed to update favorites');
    }
  };

  // Filtered results (limit to 6 for the section)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = books.filter((b) => {
      const haystack = `${b.title} ${b.author} ${b.isbn} ${b.tags.join(
        ' '
      )}`.toLowerCase();
      const matchesText = q.length === 0 || haystack.includes(q);
      const matchesLocation = !location || b.location === location;
      const matchesCondition =
        !condition || b.condition === (condition as Book['condition']);
      const matchesExchange =
        !exchangeType ||
        b.exchangeType === (exchangeType as Book['exchangeType']);
      const matchesLanguage = !language || b.language === language;
      const matchesGenre = !genre || b.genre === genre;
      return (
        matchesText &&
        matchesLocation &&
        matchesCondition &&
        matchesExchange &&
        matchesLanguage &&
        matchesGenre
      );
    });
    if (!sortOrder) return filtered;
    const sorted = [...filtered].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    if (sortOrder === 'desc') sorted.reverse();
    return sorted;
  }, [books, query, location, condition, exchangeType, language, genre, sortOrder]);

  // Unique filter options
  const locations = useMemo(
    () => Array.from(new Set(books.map((b) => b.location))).filter(Boolean),
    [books]
  );
  const languages = useMemo(
    () => Array.from(new Set(books.map((b) => b.language))).filter(Boolean),
    [books]
  );
  const genres = useMemo(
    () => Array.from(new Set(books.map((b) => b.genre))).filter(Boolean),
    [books]
  );

  return (
    <section>
      {/* Hero */}
      <HeroSection />

      {/* Fresh on the Shelf */}
      <div className="relative py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 ">
              Fresh on the Shelf
            </h2>
            <p className="text-lg text-gray-600  max-w-2xl mx-auto">
              Discover the latest books shared by our community. Swap, donate,
              or buy — your next read is just a click away.
            </p>
          </div>

          {/* Search Filters */}
          <div className="rounded-2xl bg-white dark:bg-gray-600 p-6 md:p-8 shadow-xl border border-gray-100">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white mb-5">
              <Search className="w-5 h-5 text-gray-600 dark:text-white" />
              Search Books
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input
                className="w-full rounded-lg border border-gray-300 bg-gray-300 dark:bg-white px-3 py-2.5 text-sm  focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder:text-black"
                placeholder="Search title, author, ISBN, or tag"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <select
                className="rounded-lg border border-gray-300 bg-gray-300 dark:bg-white  px-3 py-2.5 text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">All locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <select
                className="rounded-lg border border-gray-300 bg-gray-300 dark:bg-white  px-3 py-2.5 text-sm"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="">Any condition</option>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>

              <select
                className="rounded-lg border border-gray-300 bg-gray-300 dark:bg-white  px-3 py-2.5 text-sm"
                value={exchangeType}
                onChange={(e) => setExchangeType(e.target.value)}
              >
                <option value="">All exchange types</option>
                <option value="swap">Swap</option>
                <option value="donate">Donate</option>
                <option value="sell">Sell</option>
              </select>

              <select
                className="rounded-lg border border-gray-300 bg-gray-300 dark:bg-white  px-3 py-2.5 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">All languages</option>
                {languages.map((lng) => (
                  <option key={lng} value={lng}>
                    {lng}
                  </option>
                ))}
              </select>

              <select
                className="rounded-lg border border-gray-300 bg-gray-300 dark:bg-white px-3 py-2.5 text-sm"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">All genres</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <select
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | '')}
              >
                <option value="">Sorting</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Loading / Error states for the section */}
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 />
            </div>
          )}
          {isError && (
            <div className="text-red-600">
              Failed to load books:{' '}
              {(error as Error)?.message ?? 'Try again later.'}
            </div>
          )}

          {/* Book Results */}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.slice(0, 6).map((b) => (
                <article
                  key={b.id}
                  className="group rounded-xl border border-gray-200 bg-white dark:bg-gray-600  p-6 shadow-md hover:shadow-lg transition-shadow relative"
                >
                  {/* Favorite Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleFavorite(b.id);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
                    aria-label={
                      isFavorite(b.id)
                        ? 'Remove from favorites'
                        : 'Add to favorites'
                    }
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isFavorite(b.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400 hover:text-red-400'
                      }`}
                    />
                  </button>

                  <Link to={`/book/${b.id}`} className="block space-y-2">
                    <div className="h-40 w-full overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white 
                    group-hover:text-gray-600">
                      {b.title}
                    </h3>
                    <p className="text-sm text-gray-600
                    dark:text-white 
                    ">
                      {b.author} · {b.language}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white ">ISBN: {b.isbn}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-gray-100 text-black  dark:text-black px-2  py-1">
                        {b.location}
                      </span>
                      <span className="rounded bg-gray-100 text-black dark:text-black px-2 py-1">
                        {b.condition}
                      </span>
                      <span className="rounded bg-gray-100 text-black dark:text-black px-2 py-1">
                        {b.exchangeType}
                      </span>
                      <span className="rounded bg-gray-100 text-black dark:text-black px-2 py-1">
                        {b.genre}
                      </span>
                    </div>
                    <span className="mt-4 inline-block text-sm text-gray-600 dark:bg-gray-200 dark:text-black px-3 py-1  hover:bg-gray-600 hover:text-white border rounded-full">
                      View Details →
                    </span>
                  </Link>
                </article>
              ))}
              {results.length === 0 && (
                <div className="col-span-full text-center text-gray-600">
                  No matches. Try different keywords or filters.
                </div>
              )}
            </div>
          )}

          {/* want to be seller section */}
          <WantToBeSellerSection />
          {/* top seller section */}
          <TopSellersSection />
          {/* View All Button */}
          <div className="text-center">
            <Link
              to="/browse"
             className="inline-block px-8 py-3 bg-gray-500 dark:bg-gray-100 dark:text-black dark:border-gray-300 dark:border-1 text-white font-bold rounded-full shadow-lg hover:bg-gray-600 transition"
            >
              View All Books
            </Link>
          </div>
        </div>
      </div>
        <BookJourneyTimeline />
      <GlobalReaders />
      <InspirationalQuotes />
    </section>
  );
}
