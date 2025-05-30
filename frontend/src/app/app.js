'use client';
import { useEffect, useState } from 'react';
import FilterBox from './components/filterBox';
import Card from './components/Card';
import Header from './components/header';
import Footer from './components/footer';
import { useSelector } from 'react-redux';
const App = () => {
  const [showFilter, setShowFilter] = useState(false);
  const House = useSelector((state) => state.house)
  
 
  return (<div className="min-h-screen bg-gray-100 overflow-hidden">

    <Header />

    <div className="md:hidden fixed top-16 right-4 z-50">
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="m-4 p-3 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition-colors duration-200"
        aria-label={showFilter ? 'Hide filters' : 'Show filters'}
      >
        {showFilter ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18" />
          </svg>
        )}
      </button>
    </div>

    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] overscroll-none">

      <div
        className={`${showFilter ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static w-4/5 md:w-1/3 bg-white border-r border-gray-200 p-4 transition-transform duration-300 ease-in-out z-40 md:z-0 h-[calc(100vh-64px)] overflow-y-auto overscroll-contain`}
      >
        <FilterBox />
      </div>

      {showFilter && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowFilter(false)}
        />
      )}
      
        
         <div className="grid grid-cols-1 pt-7 gap-4 max-w-7xl mx-auto items-center justify-items-center w-full h-full">
  {House?.loading ? (
    <div className="flex items-center justify-center h-40 w-full">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-blue-500"></div>
    </div>
  ) : (
    House?.houses?.map((data, key) => (
      <Card className="w-full h-full" data={data} key={key} />
    ))
  )}
</div>
     
    </div>
    <Footer />

  </div>);
}
export default App;