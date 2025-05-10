'use client';
import Link from 'next/link';
import apiClient from '../utils/apiClient';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/userSlice';
import { useEffect, useState } from 'react';
import ViewContact from './ViewContact';
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
  const [isOpen, setIsOpen] = useState(false);
  const [contact, setContact] = useState();
  useEffect(()=>{
    const getContactInfo=async ()=>{
       let res=await apiClient.get(`/house/contactInfo?id=${_id}`);
       let contactInfo=res.data;
      
        setContact({
    name:contactInfo?.name|| 'N/A',
    email:contactInfo?.email||'N/A',
    mobile:contactInfo?.phoneNumber|| 'N/A'
  })

    }
    getContactInfo();
   
  },[]);
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < imageUrl.length - 1 ? prev + 1 : prev));
  };

  const updatePastView = async (id) => {
    setIsViewLoading(true);
    try {
      const res = await apiClient.post('/user/user/addPastView', { id });
      if(res.data.success)
      dispatch(updateUser(res.data.user));
    } catch (error) {
      console.log('Error updating past view:', error);
    } finally {
      setIsViewLoading(false);
    }
  };

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
    <div className="flex flex-col sm:flex-row w-full max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden transition-transform hover:shadow-2xl duration-300 mb-4 sm:mb-6">
     
      <div className="relative w-full sm:w-1/3 sm:min-w-[150px] md:min-w-[200px]" onClick={() => updatePastView(_id)}>
        <NavLink href={`pages/${_id}`}>
          <img
            src={imageUrl[currentImageIndex] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="w-full h-48 sm:h-48 md:h-64 object-cover transition-opacity duration-300"
            loading="lazy"
          />
        </NavLink>
      
        {imageUrl.length > 1 && (
          <>
            <button
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 transition ${
                currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
              aria-label="Previous Image"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 transition ${
                currentImageIndex === imageUrl.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={handleNextImage}
              disabled={currentImageIndex === imageUrl.length - 1}
              aria-label="Next Image"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
       
        <button
          className={`absolute right-2 bottom-2 ${
            user?.favorites?.includes(_id) ? 'bg-white text-black' : 'bg-red-500 text-white'
          } px-2 sm:px-3 py-1 rounded-md shadow-md hover:bg-red-600 transition disabled:opacity-50 text-xs sm:text-sm`}
          onClick={() => updateFavorite(_id)}
          disabled={isFavoriteLoading}
          aria-label="Add to Favorites"
        >
          {isFavoriteLoading ? 'Saving...' : 'Favorite'}
        </button>
      </div>

      <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 w-full sm:w-2/3">
        
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 line-clamp-1">{title}</h2>
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-1">{address}</p>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-600">₹ {price.toLocaleString()}</h3>
            <p className="text-xs text-gray-500">{pricePerSqFt} /sqft</p>
          </div>
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-600">{area} sqft</h3>
            <p className="text-xs text-gray-500">Built-up Area</p>
          </div>
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-600">{type}</h3>
            <p className="text-xs text-gray-500">Property Type</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700">
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

        <div className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{description}</div>

        <div className="flex gap-2 sm:gap-4 mt-3 sm:mt-4">
          <div>
           <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        View Contact
      </button>

      <ViewContact isOpen={isOpen} onClose={() => setIsOpen(false)} contact={contact} />
        </div >
         
        </div>
      </div>
    </div>
  );
}

export default Card;