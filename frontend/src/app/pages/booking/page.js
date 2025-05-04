'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const BookingPage = () => {
  const bookingHouse = useSelector((state) => state.user?.user.bookingHouse);
  const houses = useSelector((state) => state.house?.houses);
    const router = useRouter();

  const [bookedDetails, setBookedDetails] = useState([]);

  useEffect(() => {
    if (!bookingHouse || !houses) return;

    const merged = bookingHouse.map((booking) => {
      const house = houses.find((h) => h._id === booking.houseId);
      if (house) {
        return { ...house, ...booking };
      }
      return null;
    }).filter(Boolean);

    setBookedDetails(merged);
  }, [bookingHouse, houses]);
  const handleBack = () => {
    try {
      router.back();
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <button onClick={handleBack} className="flex items-center gap-2 text-white h-12 text-center rounded-2xl p-4 text-bold bg-amber-300 hover:bg-amber-500 " >Go Back</button>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-black mb-10">
          Your Bookings
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedDetails.length > 0 ? (
            bookedDetails.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-black rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={item.imageUrl?.[0] || "/default.jpg"}
                  alt={item.title}
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h2 className="text-xl font-semibold text-black mb-2">{item.title}</h2>
                    <p className="text-black text-sm line-clamp-2">{item.description}</p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-black">
                      <p><strong>Address:</strong> {item.address}</p>
                      <p><strong>Area:</strong> {item.area} sq.ft</p>
                      <p><strong>Bedrooms:</strong> {item.numberOfBedrooms}</p>
                      <p><strong>Bathrooms:</strong> {item.numberOfBathrooms}</p>
                      <p><strong>Type:</strong> {item.type}</p>
                      <p><strong>Furnishing:</strong> {item.furnishingStatus}</p>
                      <p><strong>Available For:</strong> {item.availableFor}</p>
                      <p><strong>Posted By:</strong> {item.postedBy}</p>
                    </div>
                    <p className="text-lg font-semibold text-black mt-3">₹{item.price}</p>
                  </div>

                  <div className="mt-4 border-t border-black pt-3 text-sm text-black">
                    <p><strong>Payment ID:</strong> {item.paymentId}</p>
                    <p><strong>Order ID:</strong> {item.orderId}</p>
                    <p><strong>Method:</strong> {item.paymentMethod}</p>
                    <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.status === 'completed' ? 'bg-black text-white' : 'bg-gray-200 text-black'
                        }`}
                      >
                        {item.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-black text-lg font-medium bg-gray-100 py-10 rounded-lg">
              No bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;