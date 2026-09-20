import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiMapPin, FiSearch, FiRefreshCw, FiList, FiMap } from 'react-icons/fi';
import { toast } from 'react-toastify';

import MapView from '@/components/Map/MapView';
import BookCard from '@/pages/Browse/BookCard';
import { geolocationService } from '@/services/geolocationService';
import type { GeolocationPosition } from '@/services/geolocationService';
import UseAxiosSecure from '@/axios/UseAxiosSecure';
import type { Book } from '@/types/Book';
import { normalizeBook } from '@/types/Book';

interface NearbyBooksResponse {
  books: Book[];
  count: number;
  userLocation: { latitude: number; longitude: number };
  radius: number;
}

// Helper function to get user's city from coordinates
const getCityFromCoordinates = (
  latitude: number,
  longitude: number
): string => {
  // Simple city detection based on coordinates
  // Dhaka: 23.8103, 90.4125
  // Sylhet: 24.8949, 91.8687
  // Rajshahi: 24.3745, 88.6042
  // Chittagong: 22.3569, 91.7832

  const cities = [
    { name: 'Dhaka', lat: 23.8103, lon: 90.4125, threshold: 0.5 },
    { name: 'Sylhet', lat: 24.8949, lon: 91.8687, threshold: 0.5 },
    { name: 'Rajshahi', lat: 24.3745, lon: 88.6042, threshold: 0.5 },
    { name: 'Chittagong', lat: 22.3569, lon: 91.7832, threshold: 0.5 },
    { name: 'Khulna', lat: 22.8098, lon: 89.5642, threshold: 0.5 },
    { name: 'Barisal', lat: 22.701, lon: 90.3535, threshold: 0.5 },
  ];

  for (const city of cities) {
    const distance = Math.sqrt(
      Math.pow(latitude - city.lat, 2) + Math.pow(longitude - city.lon, 2)
    );
    if (distance < city.threshold) {
      return city.name;
    }
  }

  return 'Dhaka'; // Default fallback
};

// Helper function to check if two cities are the same
const isSameCity = (city1: string, city2: string): boolean => {
  return city1.toLowerCase().trim() === city2.toLowerCase().trim();
};

// Generate sample books for demonstration
const generateSampleBooks = (userLat: number, userLon: number): Book[] => {
  const userCity = getCityFromCoordinates(userLat, userLon);

  const sampleBooks: Book[] = [
    {
      id: 'sample-1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      tags: ['classic', 'fiction', 'american'],
      location: userCity,
      condition: 'good',
      exchangeType: 'swap',
      language: 'english',
      genre: 'fiction',
      image:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      price: 0,
      coordinates: {
        latitude: userLat + (Math.random() - 0.5) * 0.01,
        longitude: userLon + (Math.random() - 0.5) * 0.01,
      },
    },
    {
      id: 'sample-2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      tags: ['classic', 'fiction', 'american'],
      location: userCity,
      condition: 'like new',
      exchangeType: 'sell',
      language: 'english',
      genre: 'fiction',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      price: 500,
      coordinates: {
        latitude: userLat + (Math.random() - 0.5) * 0.01,
        longitude: userLon + (Math.random() - 0.5) * 0.01,
      },
    },
    {
      id: 'sample-3',
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      tags: ['dystopian', 'fiction', 'classic'],
      location: userCity,
      condition: 'good',
      exchangeType: 'swap',
      language: 'english',
      genre: 'fiction',
      image:
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      price: 0,
      coordinates: {
        latitude: userLat + (Math.random() - 0.5) * 0.01,
        longitude: userLon + (Math.random() - 0.5) * 0.01,
      },
    },
  ];

  return sampleBooks;
};

const AroundMe: React.FC = () => {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
    null
  );
  const [radius, setRadius] = useState<number>(5);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [, setSelectedBook] = useState<Book | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const axiosSecure = UseAxiosSecure();

  // Get user location on component mount
  useEffect(() => {
    const getLocation = async () => {
      setIsLoadingLocation(true);
      try {
        const position = await geolocationService.getPositionWithFallback();
        setUserLocation(position);
      } catch (error) {
        console.error('Error getting location:', error);
        toast.error('Unable to get your location. Using default location.');
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getLocation();
  }, []);

  // Fetch all books and filter by location on frontend
  const {
    data: nearbyBooksData,
    isLoading: isLoadingBooks,
    isError: isBooksError,
    refetch: refetchBooks,
  } = useQuery<NearbyBooksResponse>({
    queryKey: [
      'nearby-books',
      userLocation?.latitude,
      userLocation?.longitude,
      radius,
    ],
    queryFn: async () => {
      if (!userLocation) {
        throw new Error('User location not available');
      }

      try {
        // Get all books and filter by city
        const response = await axiosSecure.get('/api/books');
        console.log('API response:', response.data);

        // Handle different response formats
        let booksData = response.data;
        if (Array.isArray(response.data)) {
          booksData = response.data;
        } else if (response.data.books) {
          booksData = response.data.books;
        } else if (response.data.data) {
          booksData = response.data.data;
        }

        const allBooks = booksData
          .map((book: any) => {
            try {
              return normalizeBook(book);
            } catch (error) {
              console.error('Error normalizing book:', book, error);
              return null;
            }
          })
          .filter((book: any) => book); // Filter out any null/undefined books

        // Get user's city from coordinates
        const userCity = getCityFromCoordinates(
          userLocation.latitude,
          userLocation.longitude
        );
        console.log(`User is in: ${userCity}`);

        // Filter books by city instead of coordinates
        const booksInSameCity = allBooks.filter((book: any) => {
          if (!book.location) return false;

          // Check if book location matches user's city
          return isSameCity(book.location, userCity);
        });

        let booksToFilter = allBooks;
        if (booksInSameCity.length === 0) {
          console.log(`No books found in ${userCity}, adding demo books`);
          // Add some sample books for the user's city
          const sampleBooks = generateSampleBooks(
            userLocation.latitude,
            userLocation.longitude
          );
          booksToFilter = [...allBooks, ...sampleBooks];
        } else {
          console.log(`Found ${booksInSameCity.length} books in ${userCity}`);
          booksToFilter = booksInSameCity;
        }
        void setRadius;

        // Return all books in the same city
        const nearbyBooks = booksToFilter;

        console.log(`Found ${nearbyBooks.length} books in ${userCity}`);
        console.log('Books data:', nearbyBooks);

        return {
          books: nearbyBooks,
          count: nearbyBooks.length,
          userLocation: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          radius: radius,
        };
      } catch (error) {
        console.error('Error fetching books:', error);
        console.log('Using demo books as fallback');
        // Return sample books as final fallback
        const sampleBooks = generateSampleBooks(
          userLocation.latitude,
          userLocation.longitude
        );
        return {
          books: sampleBooks,
          count: sampleBooks.length,
          userLocation: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          radius: radius,
        };
      }
    },
    enabled: !!userLocation,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  const handleRefreshLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const position = await geolocationService.getCurrentPosition();
      setUserLocation(position);
      toast.success('Location updated successfully!');
    } catch (error) {
      console.error('Error refreshing location:', error);
      toast.error('Failed to update location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const handleBookClick = useCallback(
    (book: Book) => {
      setSelectedBook(book);
      if (viewMode === 'list') {
        setViewMode('map');
      }
    },
    [viewMode]
  );

  const handleViewDetails = useCallback((book: Book) => {
    // Navigate to book details page
    window.location.href = `/book/${book.id}`;
  }, []);

  const handleAddToFavorites = useCallback((book: Book) => {
    // Add to favorites functionality
    toast.success(`"${book.title}" added to favorites!`);
  }, []);

  const handleContactOwner = useCallback((book: Book) => {
    // Contact owner functionality
    toast.info(`Contacting owner of "${book.title}"...`);
  }, []);

  // const handleRadiusChange = useCallback((newRadius: number) => {
  //   setRadius(newRadius);
  // }, []);

  const books = nearbyBooksData?.books || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AroundMe</h1>
              <p className="text-gray-600 mt-1">
                Discover books available for trade in your city
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Location Status */}
              <div className="flex items-center space-x-2">
                <FiMapPin className="text-blue-500" />
                <span className="text-sm text-gray-600">
                  {userLocation ? 'Location detected' : 'Getting location...'}
                </span>
              </div>

              {/* Refresh Location Button */}
              <button
                onClick={handleRefreshLocation}
                disabled={isLoadingLocation}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50"
              >
                <FiRefreshCw
                  className={`${isLoadingLocation ? 'animate-spin' : ''}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            {/* City Display */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Your City:
              </label>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg">
                  {userLocation
                    ? getCityFromCoordinates(
                        userLocation.latitude,
                        userLocation.longitude
                      )
                    : 'Loading...'}
                </span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  viewMode === 'map'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiMap />
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiList />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoadingLocation ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiRefreshCw className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Getting your location...</p>
            </div>
          </div>
        ) : !userLocation ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiMapPin className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading AroundMe...</p>
            </div>
          </div>
        ) : isBooksError ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to load nearby books
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading books from the server. Using demo books
              for demonstration.
            </p>
            <button
              onClick={() => refetchBooks()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map View */}
            {viewMode === 'map' && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border h-96 lg:h-[600px] overflow-hidden">
                  {isLoadingBooks ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FiRefreshCw className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-600">Loading map...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full">
                      <MapView
                        books={books}
                        userLocation={userLocation}
                        radius={radius}
                        onBookClick={handleBookClick}
                        onViewDetails={handleViewDetails}
                        onAddToFavorites={handleAddToFavorites}
                        onContactOwner={handleContactOwner}
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Books List */}
            <div
              className={`${
                viewMode === 'map' ? 'lg:col-span-1' : 'lg:col-span-3'
              }`}
            >
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Books Found ({books.length})
                      </h3>
                      {books.length > 0 &&
                        books[0].id.startsWith('sample-') && (
                          <p className="text-xs text-blue-600 mt-1">
                            📍 Showing demo books for demonstration
                          </p>
                        )}
                    </div>
                    {viewMode === 'list' && (
                      <button
                        onClick={() => refetchBooks()}
                        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <FiRefreshCw />
                        <span>Refresh</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  {isLoadingBooks ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex space-x-4">
                            <div className="w-16 h-20 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : books.length === 0 ? (
                    <div className="text-center py-8">
                      <FiSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No books found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        No books are available for trade in your city. Demo
                        books are shown for demonstration purposes.
                      </p>
                      <p className="text-sm text-gray-500">
                        Note: Books are filtered by city location (Dhaka,
                        Sylhet, Rajshahi, etc.). Currently showing demo books
                        for demonstration purposes.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {books.map((book) => (
                        <motion.div
                          key={book.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => handleBookClick(book)}
                          className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg border transition-colors"
                        >
                          <BookCard book={book} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AroundMe;
