import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFavorites } from '@/hooks/useFavorites';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '@/axios/UseAxiosSecure';
import Loader2 from '@/components/Loaders/Loader2';

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  isbn: string;
  tags: string[];
  location: string;
  condition: string;
  exchangeType: string;
  language: string;
  genre: string;
  image: string;
};

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

// ✅ Normalize backend data into frontend-friendly format
const normalize = (b: ApiBook): Book => ({
  id: b._id,
  title: b.title,
  author: b.author,
  isbn: b.ISBN ?? 'N/A',
  tags: b.tags ?? [],
  location: b.Location ?? 'Dhaka',
  condition: (b.Condition ?? 'Good').toLowerCase(),
  exchangeType: (b.Exchange ?? 'Swap').toLowerCase(),
  language: b.Language ?? 'English',
  genre: b.category ?? 'Fiction',
  image: b.imageUrl,
  price: b.price,
});

export default function FavouriteBooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const axiosSecure = UseAxiosSecure();

  // ✅ Fetch all books
  const {
    data: allBooks = [],
    isLoading: booksLoading,
  } = useQuery<Book[], Error>({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axiosSecure.get<ApiBook[]>('/api/books');
      return (res.data ?? []).map(normalize);
    },
  });

  // ✅ Favorites hook
  const {
    favorites,
    toggleFavorite,
    isFavorite,
    isAuthenticated,
    loading,
    error,
  } = useFavorites();

  // ✅ Safe Hook Order — useMemo after all hooks
  const favoriteBooks = useMemo(
    () => allBooks.filter((book) => favorites.includes(book.id)),
    [allBooks, favorites]
  );

  const filteredBooks = useMemo(
    () =>
      favoriteBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [favoriteBooks, searchQuery]
  );

  // ✅ Early Loading State
  if (booksLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 />
      </div>
    );
  }

  // ✅ Favorite Toggle Handler
  const handleToggleFavorite = async (bookId: string) => {
    const book = allBooks.find((b) => b.id === bookId);
    const bookTitle = book?.title || 'Unknown Book';

    if (!isAuthenticated) {
      toast.error('Please log in to manage favorites');
      return;
    }

    const wasFavorite = isFavorite(bookId);
    const success = await toggleFavorite(bookId);

    if (success) {
      toast.success(
        `"${bookTitle}" ${
          wasFavorite ? 'removed from' : 'added to'
        } favourites`,
        { toastId: `${wasFavorite ? 'remove' : 'add'}-${bookId}` }
      );
    } else {
      toast.error('Failed to update favorites');
    }
  };

  // ✅ UI Section
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="rounded-2xl border border-sand-200 bg-gradient-to-br from-sand-50 via-white to-leaf-50 p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-semibold text-soil-900 tracking-tight">
            My Favourite Books
          </h1>
        </div>
        <p className="text-sand-700">
          Your favorite books saved for future reading or trading.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your favourite books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Book Count */}
      <div className="mb-6">
        {loading && <p className="text-blue-600">Loading your favourites...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && (
          <p className="text-gray-600">
            {filteredBooks.length}{' '}
            {filteredBooks.length === 1 ? 'book' : 'books'} in your favourites
          </p>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const fav = isFavorite(book.id);
            return (
              <article
                key={book.id}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow relative"
              >
                {/* Favorite Heart */}
                <button
                  onClick={() => handleToggleFavorite(book.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
                  aria-label={
                    fav ? 'Remove from favorites' : 'Add to favorites'
                  }
                >
                  <Heart
                    className={`w-5 h-5 transition-colors duration-200 ${
                      fav
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  />
                </button>

                <Link to={`/book/${book.id}`} className="block space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-leaf-600">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {book.author} · {book.language}
                  </p>
                  <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded bg-purple-100 text-purple-700 px-2 py-1">
                      {book.location}
                    </span>
                    <span className="rounded bg-blue-100 text-blue-700 px-2 py-1">
                      {book.condition}
                    </span>
                    <span className="rounded bg-green-100 text-green-700 px-2 py-1">
                      {book.exchangeType}
                    </span>
                    <span className="rounded bg-pink-100 text-pink-700 px-2 py-1">
                      {book.genre}
                    </span>
                  </div>
                </Link>

                {/* Buttons */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-leaf-500 hover:bg-leaf-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Trade Now
                  </button>
                  <Link
                    to={`/book/${book.id}`}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchQuery ? 'No books found' : 'Your favourites list is empty'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? 'Try adjusting your search terms.'
              : 'Start adding books to your favourites by clicking the heart icon on any book.'}
          </p>
          {!searchQuery && (
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-leaf-500 hover:bg-leaf-600 text-white rounded-lg font-medium transition-colors"
            >
              Browse Books
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
