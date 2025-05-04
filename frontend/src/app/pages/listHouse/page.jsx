'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/header';
import apiClient from '@/app/utils/apiClient';
import axios from 'axios';

const AddHouse = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: [],
    address: '',
    price: '',
    area: '',
    numberOfBedrooms: '',
    numberOfBathrooms: '',
    type: '',
    availableFor: '',
    postedBy: '',
    furnishingStatus: '',
  });
const [imageUrl,setImageUrl]=useState();
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.area || formData.area <= 0) newErrors.area = 'Valid area is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setErrors((prev) => ({ ...prev, images: '' }));
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(
          'https://chat-backend-1-3dgt.onrender.com/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return res.data.imageUrl;
      });

      const newUrls = await Promise.all(uploadPromises);
      
      const updatedImageFiles = [...imageFiles, ...newUrls];
      setImageFiles(updatedImageFiles);
      setFormData((prev) => ({ ...prev, imageUrl: updatedImageFiles }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, images: 'Image upload failed. Please try again.' }));
    }
  };

  const removeImage = (index) => {
    const updatedImageFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedImageFiles);
    setFormData((prev) => ({ ...prev, imageUrl: updatedImageFiles }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/house/house', formData);
      if (res.status === 200) {
        setSuccess('Property listed successfully!');
        setFormData({
          title: '',
          description: '',
          imageUrl: [],
          address: '',
          price: '',
          area: '',
          numberOfBedrooms: '',
          numberOfBathrooms: '',
          type: '',
          availableFor: '',
          postedBy: '',
          furnishingStatus: '',
        });
        setImageFiles([]);
        setTimeout(() => router.push('/'), 2000);
      }
    } catch (err) {
      setErrors({ submit: 'Failed to list property. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">List a New Property</h1>
            <div className="w-20"></div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Beautiful 2BHK Flat"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 123 Main St, Colombo"
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 5000000"
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft) *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 1200"
                />
                {errors.area && <p className="mt-1 text-sm text-red-500">{errors.area}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bedrooms</label>
                <select
                  name="numberOfBedrooms"
                  value={formData.numberOfBedrooms}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {['1RK', '1BHK', '2BHK', '3BHK', '4+ BHK'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bathrooms</label>
                <select
                  name="numberOfBathrooms"
                  value={formData.numberOfBathrooms}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {['1', '2', '3', '4+'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {['Flat', 'Villa', 'Independent House', 'Studio', 'Penthouse'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available For</label>
                <select
                  name="availableFor"
                  value={formData.availableFor}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {['Family', 'Bachelors', 'Company', 'Anyone'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posted By</label>
                <select
                  name="postedBy"
                  value={formData.postedBy}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {['Owner', 'Broker', 'Builder'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing Status</label>
                <select
                  name="furnishingStatus"
                  value={formData.furnishingStatus}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {['Fully Furnished', 'Semi Furnished', 'Unfurnished'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the property..."
                rows="4"
              />
            </div>

            <div>

              <div className="flex">
                <input type="text" placeholder='enter image link'  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)}/>
                <button disabled={!imageUrl} className='h-12 w-20 bg-green-400 hover:bg-green-700 rounded-2xl m-2 ' onClick={()=>{
                  const newImages=[...formData.imageUrl,imageUrl];
                  setFormData({...formData,imageUrl:newImages})
                  setImageUrl("");
                }}>add</button>
                 </div>



              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Multiple) *</label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Supported formats: JPG, PNG (Max 5MB per image)</p>
              {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
              {imageFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageFiles.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
      
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors duration-200 ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Listing Property...' : 'List Property'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHouse;