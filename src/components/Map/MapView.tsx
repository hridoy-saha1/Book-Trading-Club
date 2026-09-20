import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Book } from '@/types/Book';
import BookMarkerPopup from './BookMarkerPopup';

// Fix for default markers in react-leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  iconRetinaUrl: markerRetina,
});

interface MapViewProps {
  books: Book[];
  userLocation: { latitude: number; longitude: number } | null;
  radius: number;
  onBookClick?: (book: Book) => void;
  onViewDetails?: (book: Book) => void;
  onAddToFavorites?: (book: Book) => void;
  onContactOwner?: (book: Book) => void;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
  books,
  userLocation,
  radius,
  onBookClick,
  onViewDetails,
  onAddToFavorites,
  onContactOwner,
  className = '',
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8103, 90.4125]); // Default to Dhaka

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude]);
    }
  }, [userLocation]);

  const handleMarkerClick = (book: Book) => {
    if (onBookClick) {
      onBookClick(book);
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={DefaultIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-green-600">Your Location</h3>
                <p className="text-sm text-gray-600">
                  {radius}km search radius
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Search radius circle */}
        {userLocation && (
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={radius * 1000} // Convert km to meters
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        )}

        {/* Book markers */}
        {books.map((book) => {
          if (!book.coordinates?.latitude || !book.coordinates?.longitude) {
            return null;
          }

          return (
            <Marker
              key={book.id}
              position={[book.coordinates.latitude, book.coordinates.longitude]}
              icon={DefaultIcon}
              eventHandlers={{
                click: () => handleMarkerClick(book),
              }}
            >
              <Popup>
                <BookMarkerPopup
                  book={book}
                  onViewDetails={onViewDetails}
                  onAddToFavorites={onAddToFavorites}
                  onContactOwner={onContactOwner}
                />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
