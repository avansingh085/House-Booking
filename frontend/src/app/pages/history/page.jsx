'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Card from '@/app/components/Card';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';

const HistoryPage = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('pastViewed');
  const [error, setError] = useState('');

  const user = useSelector((state) => state.user?.user);
  const houses = useSelector((state) => state.house?.houses);

  const historyData = {
    pastViewed: houses?.filter((house) => user?.pastViews?.includes(house._id)) || [],
    favorite: houses?.filter((house) => user?.favorites?.includes(house._id)) || [],
    housesListed: houses?.filter((house) => user?.houseListed?.includes(house._id)) || [],
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setError('');
  };

  const handleBack = () => {
    try {
      router.back();
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Error navigating back. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Header/>
    <div className="min-h-screen bg-gray-100 flex flex-col">
      

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-full sm:max-w-3xl md:max-w-4xl mx-auto">

          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-sm sm:text-base"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center flex-1">Property History</h1>
            <div className="w-12 sm:w-16" aria-hidden="true"></div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6 justify-center">
            {['pastViewed', 'favorite', 'housesListed'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 border w-full sm:w-auto ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                aria-pressed={activeCategory === category}
              >
                {category === 'pastViewed'
                  ? 'Past Viewed'
                  : category === 'favorite'
                  ? 'Favorite'
                  : 'Houses Listed'}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1">
            {historyData[activeCategory].length > 0 ? (
              historyData[activeCategory].map((house) => (
                <Card key={house._id} data={house} />
              ))
            ) : (
              <p className="text-gray-600 text-sm sm:text-base text-center">
                No properties found in this category.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
    <Footer/>
    </div>
  );
};

export default HistoryPage;
