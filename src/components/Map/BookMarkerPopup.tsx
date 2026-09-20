import React from 'react';
import type { Book } from '@/types/Book';
import { FiMapPin, FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

interface BookMarkerPopupProps {
  book: Book;
  onViewDetails?: (book: Book) => void;
  onAddToFavorites?: (book: Book) => void;
  onContactOwner?: (book: Book) => void;
}

const BookMarkerPopup: React.FC<BookMarkerPopupProps> = ({
  book,
  onViewDetails,
  onAddToFavorites,
  onContactOwner,
}) => {
  return (
    <div className="max-w-xs bg-white rounded-lg shadow-lg border">
      {/* Book Image and Basic Info */}
      <div className="flex items-start space-x-3 p-4">
        {book.image && (
          <img
            src={book.image}
            alt={book.title}
            className="w-16 h-20 object-cover rounded-lg shadow-sm"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
            {book.title}
          </h3>
          <p className="text-xs text-gray-600 mb-2">
            by {book.author}
          </p>
          
          {/* Book Details */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {book.condition}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {book.exchangeType}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              📍 {book.location}
            </p>
            <p className="text-sm font-semibold text-green-600">
              ${book.price}
            </p>
          </div>
        </div>
      </div>

      {/* Description Preview */}
      {book.description && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-600 line-clamp-2">
            {book.description}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(book)}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiEye className="w-3 h-3" />
              <span>View</span>
            </button>
          )}
          
          {onAddToFavorites && (
            <button
              onClick={() => onAddToFavorites(book)}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FiHeart className="w-3 h-3" />
              <span>Save</span>
            </button>
          )}
          
          {onContactOwner && (
            <button
              onClick={() => onContactOwner(book)}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiMessageCircle className="w-3 h-3" />
              <span>Contact</span>
            </button>
          )}
        </div>
      </div>

      {/* Distance Info (if available) */}
      {book.distance && (
        <div className="px-4 pb-3 border-t pt-3">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <FiMapPin className="w-3 h-3" />
            <span>{book.distance.toFixed(1)} km away</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookMarkerPopup;
