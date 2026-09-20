// Book type definition for the frontend application
export interface Book {
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
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // Distance from user location in kilometers
}

// API shape coming from the backend Mongoose model
export interface ApiBook {
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
  uid: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Normalize function to convert API book to frontend Book type
export const normalizeBook = (apiBook: ApiBook): Book => ({
  id: apiBook._id,
  title: apiBook.title,
  author: apiBook.author,
  price: apiBook.price,
  isbn: apiBook.ISBN || 'N/A',
  tags: apiBook.tags || [],
  location: apiBook.Location || 'Unknown',
  condition: apiBook.Condition || 'Good',
  exchangeType: apiBook.Exchange || 'Swap',
  language: apiBook.Language || 'English',
  genre: apiBook.category || 'Fiction',
  image: apiBook.imageUrl,
  description: apiBook.description,
  coordinates: apiBook.coordinates?.latitude && apiBook.coordinates?.longitude ? {
    latitude: apiBook.coordinates.latitude,
    longitude: apiBook.coordinates.longitude,
  } : undefined,
});

// Book condition types
export type BookCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';

// Exchange type options
export type ExchangeType = 'Swap' | 'Sell' | 'Donate';

// Language options
export type BookLanguage = 'English' | 'Bangla' | 'Hindi' | 'Arabic' | 'Chinese' | 'Other';

// Category options
export type BookCategory = 'fiction' | 'non-fiction' | 'education' | 'comics';
