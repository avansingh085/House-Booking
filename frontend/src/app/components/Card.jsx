'use client';
import Link from 'next/link';
import apiClient from '../utils/apiClient';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/userSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function Card({ data }) {
  const {
    _id,
    title = 'No Title',
    description = 'No Description',
    price = 0,
    address = 'No Address',
    imageUrl = [],
    area = 0,
    numberOfBedrooms = 'N/A',
    numberOfBathrooms = 'N/A',
    type = 'N/A',
    availableFor = 'N/A',
    postedBy = 'N/A',
    furnishingStatus = 'N/A',
  } = data || {};

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const pricePerSqFt = area && price ? Math.round(price / area) : 0;
 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);

  // Image navigation handlers
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < imageUrl.length - 1 ? prev + 1 : prev));
  };

  // Update past view
  const updatePastView = async (id) => {
    setIsViewLoading(true);
    try {
      const res = await apiClient.post('/user/user/addPastView', { id });
      dispatch(updateUser(res.data.user));
    } catch (error) {
      console.error('Error updating past view:', error);
    } finally {
      setIsViewLoading(false);
    }
  };

  // Update favorite
  const updateFavorite = async (id) => {
    setIsFavoriteLoading(true);
    try {
      
      const res = await apiClient.post('/user/user/favorite', { id });
      dispatch(updateUser(res.data.user));
    } catch (error) {
      console.log('Error updating favorite:', error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden transition-transform hover:shadow-2xl duration-300">
      {/* Image Section */}
      <div className="relative w-1/3" onClick={() => updatePastView(_id)}>
        <Link href={`/pages/${_id}`} >
          <img
            src={imageUrl[currentImageIndex] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="w-full h-64 object-cover transition-opacity duration-300"
            loading="lazy"
          />
        </Link>
        {/* Navigation Arrows */}
        {imageUrl.length > 1 && (
          <>
            <button
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition ${
                currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
              aria-label="Previous Image"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition ${
                currentImageIndex === imageUrl.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={handleNextImage}
              disabled={currentImageIndex === imageUrl.length - 1}
              aria-label="Next Image"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        {/* Favorite Button */}
        <button
          className={`absolute right-2 bottom-2 ${user?.favorites?.includes(_id) ? 'bg-white text-black' : 'bg-red-500 text-white'}  px-3 py-1 rounded-md shadow-md hover:bg-red-600 transition disabled:opacity-50`}
          onClick={() => updateFavorite(_id)}
          disabled={isFavoriteLoading}
          aria-label="Add to Favorites"
        >
          {isFavoriteLoading ? 'Saving...' : 'Favorite'}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 w-2/3">
        {/* Title and Address */}
        <h2 className="text-2xl font-bold text-gray-800 line-clamp-1">{title}</h2>
        <p className="text-gray-600 text-sm line-clamp-1">{address}</p>

        {/* Price and Area Info */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-lg font-semibold text-blue-600">₹ {price.toLocaleString()}</h3>
            <p className="text-xs text-gray-500">{pricePerSqFt} /sqft</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-600">{area} sqft</h3>
            <p className="text-xs text-gray-500">Built-up Area</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-600">{type}</h3>
            <p className="text-xs text-gray-500">Property Type</p>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
          <p>
            <strong>Bedrooms:</strong> {numberOfBedrooms}
          </p>
          <p>
            <strong>Bathrooms:</strong> {numberOfBathrooms}
          </p>
          <p>
            <strong>Furnishing:</strong> {furnishingStatus}
          </p>
          <p>
            <strong>Available For:</strong> {availableFor}
          </p>
          <p>
            <strong>Posted By:</strong> {postedBy}
          </p>
        </div>

        {/* Description */}
        <div className="text-gray-600 text-sm line-clamp-3">{description}</div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isViewLoading}
            aria-label="View Contact Details"
          >
            {isViewLoading ? 'Loading...' : 'View Contact'}
          </button>
          <button
            className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition"
            aria-label="Contact Property Owner"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;