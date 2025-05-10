'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
const getHouseData = (data = {}) => {
  const {
    _id,
    title = `Luxury House `,
    imageUrl = [],
    description = "A beautiful modern house with spacious rooms and a large backyard. Perfect for families or professionals.",
    price = "$500,000",
    location = "123 Dream Street, Cityville",
    features = ["4 Bedrooms", "3 Bathrooms", "2 Car Garage", "Large Backyard", "Modern Kitchen"],
  } = data;

  return {
    _id,
    
    title,
    imageUrl,
    description,
    price,
    location,
    features,
  };
};

export default function HouseDetail() {
  const { id } = useParams();

  const houseData = useSelector((state) => state?.house?.houses);
 
  const houseDetails = houseData?.find((house) => String(house._id) === String(id));
console.log(houseDetails,id)
  const house = getHouseData(houseDetails);
  const [currentImage, setCurrentImage] = useState(0);

  const images = house?.imageUrl||[];
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="mi-h-screen w-screen">
       <Header/>
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <main className="max-w-7xl mx-auto mt-10 p-4 md:p-6 pt-20">
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
        
          <div className="relative w-full h-64 md:h-96">
            <img
              src={images[currentImage]}
              alt={`House image ${currentImage + 1}`}
              className="w-full h-full object-cover"
            />

            <button
              onClick={prevImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 text-amber-600 hover:bg-white rounded-full p-2 shadow-md"
              aria-label="Previous Image"
            >
              &#8592;
            </button>

            <button
              onClick={nextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 text-amber-600 hover:bg-white rounded-full p-2 shadow-md"
              aria-label="Next Image"
            >
              &#8594;
            </button>
          </div>

          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{house.title}</h1>
            <p className="text-xl md:text-2xl text-amber-600 font-semibold mb-4">{house.price}</p>
            <p className="text-base md:text-lg text-gray-600 mb-4">{house.location}</p>
            <p className="text-gray-700 mb-6 text-sm md:text-base">{house.description}</p>

            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {house.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600 text-sm md:text-base">
                  <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
             
              <Link
                href={`/pages/${id}/payment`}
                className="bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition text-center"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </main>
      
    </div>
    <Footer/>
    </div>
  );
}
