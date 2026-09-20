import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import notify from '@/lib/notify';

type ApiBook = {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  isbn?: string;
  ISBN?: string;
  location?: string;
  Location?: string;
  condition?: string;
  Condition?: string;
  exchangeType?: string;
  Exchange?: string;
  language?: string;
  Language?: string;
  category?: string;
  tags?: string[];
  price?: number;
  description?: string;
  image?: string;
  imageUrl?: string;
};

type BookCardProps = { book: ApiBook };

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const bookId = book.id ?? book._id;
  const img = book.image ?? book.imageUrl;
  const location = book.location ?? book.Location;
  const condition = book.condition ?? book.Condition;
  const exchangeType = book.exchangeType ?? book.Exchange;
  const language = book.language ?? book.Language;
  const { toggleFavorite, isFavorite, isAuthenticated } = useFavorites();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!bookId) return;
    if (!isAuthenticated) {
      notify.error('Please log in to add books to favorites');
      return;
    }
    const wasFavorite = isFavorite(String(bookId));
    const ok = await toggleFavorite(String(bookId));
    if (!ok) return notify.error('Failed to update favorites');
    const title = book.title || 'Unknown Book';
    notify.success(
      wasFavorite
        ? `"${title}" removed from favourites`
        : `"${title}" added to favourites`
    );
  };

  const handleCardClick = () => {
    if (bookId) navigate(`/book/${bookId}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="cursor-pointer rounded-xl border border-sand-200 bg-white p-5 shadow-subtle hover:shadow-md transition-shadow relative"
    >
      {/* Favorite Heart Icon */}
      {bookId && (
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
          aria-label={isFavorite(String(bookId)) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${
              isFavorite(String(bookId))
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-400'
            }`}
          />
        </button>
      )}
      {/* Book image */}
      <div className="h-40 w-full overflow-hidden rounded-md bg-sand-100/60">
        <img
          src={img!}
          alt={book.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Title + Author */}
      <h3 className="mt-3 font-semibold text-soil-900">{book.title}</h3>
      <p className="text-sm text-sand-700">
        {book.author} · {language}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {location && (
          <span className="rounded bg-sand-100 px-2 py-1">{location}</span>
        )}
        {condition && (
          <span className="rounded bg-sand-100 px-2 py-1">{condition}</span>
        )}
        {exchangeType && (
          <span className="rounded bg-sand-100 px-2 py-1">{exchangeType}</span>
        )}
      </div>

      {/* View Details link */}
      {bookId && (
        <Link
          to={`/book/${bookId}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-4 inline-block text-sm text-blue-600 px-3 py-1 hover:text-white hover:bg-blue-600 border rounded-xl"
        >
          View Details →
        </Link>
      )}
    </article>
  );
};

export default BookCard;
