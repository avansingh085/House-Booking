'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setFilter } from '../redux/houseSlice';
const FilterSection = ({ title, options, selectedOptions, onToggleOption, onClear }) => (
  <div className="grid gap-2 mt-4">
    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <button
        type="button"
        onClick={onClear}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded transition"
      >
        Clear
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((option, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onToggleOption(option)}
          className={`px-3 py-1 rounded-lg border text-sm transition-all duration-200 ${
            selectedOptions.includes(option)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const FilterBox = ({ onFilterChange }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    hideSeen: false,
    budgetMin: '',
    budgetMax: '',
    bedrooms: [],
    date: '',
    propertyType: [],
    availableFor: [],
    postedBy: [],
    furnishingStatus: [],
    bathrooms: [],
  });
  useEffect(()=>{
    dispatch(setFilter(filters));
  },[filters])
  const [error, setError] = useState('');

  const applyFilter = useCallback(
    (newFilters) => {
      try {
        onFilterChange?.(newFilters);
        setError('');
      } catch {
        setError('Error applying filter. Please try again.');
      }
    },
    [onFilterChange]
  );

  const toggleOption = useCallback(
    (key, option) => {
      setFilters((prev) => {
        const options = prev[key];
        const updatedOptions = options.includes(option)
          ? options.filter((opt) => opt !== option)
          : [...options, option];
        const newFilters = { ...prev, [key]: updatedOptions };
        applyFilter(newFilters);
        return newFilters;
      });
    },
    [applyFilter]
  );

  const updateBudget = useCallback(
    (name, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: value };
        if (
          newFilters.budgetMin &&
          newFilters.budgetMax &&
          Number(newFilters.budgetMin) > Number(newFilters.budgetMax)
        ) {
          setError('Minimum budget cannot exceed maximum budget.');
          return prev;
        }
        applyFilter(newFilters);
        return newFilters;
      });
    },
    [applyFilter]
  );

  const updateDate = useCallback(
    (value) => {
      setFilters((prev) => {
        const newFilters = { ...prev, date: value };
        applyFilter(newFilters);
        return newFilters;
      });
    },
    [applyFilter]
  );

  const toggleHideSeen = useCallback(
    (checked) => {
      setFilters((prev) => {
        const newFilters = { ...prev, hideSeen: checked };
        applyFilter(newFilters);
        return newFilters;
      });
    },
    [applyFilter]
  );

  const clearSection = useCallback(
    (key) => {
      setFilters((prev) => {
        const newFilters = {
          ...prev,
          [key]: key === 'hideSeen' ? false : key === 'date' ? '' : [],
          ...(key === 'budgetMin' || key === 'budgetMax' ? { budgetMin: '', budgetMax: '' } : {}),
        };
        applyFilter(newFilters);
        return newFilters;
      });
    },
    [applyFilter]
  );

  const clearAll = useCallback(() => {
    const clearedFilters = {
      hideSeen: false,
      budgetMin: '',
      budgetMax: '',
      bedrooms: [],
      date: '',
      propertyType: [],
      availableFor: [],
      postedBy: [],
      furnishingStatus: [],
      bathrooms: [],
    };
    setFilters(clearedFilters);
    applyFilter(clearedFilters);
  }, [applyFilter]);

  const goBack = useCallback(() => {
    try {
      router.back();
    } catch {
      setError('Error navigating back. Please try again.');
    }
  }, [router]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-sm"
          aria-label="Go back to previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-semibold text-gray-800 flex-1 text-center">Filters</h1>
        <button
          type="button"
          onClick={clearAll}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded transition"
        >
          Clear All
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <input
          type="checkbox"
          checked={filters.hideSeen}
          onChange={(e) => toggleHideSeen(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="text-gray-700 text-sm">Hide already seen properties</label>
      </div>

      <div className="grid gap-2 mb-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Budget (₹)</h2>
          <button
            type="button"
            onClick={() => clearSection('budgetMin')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded transition"
          >
            Clear
          </button>
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            name="budgetMin"
            value={filters.budgetMin}
            onChange={(e) => updateBudget('budgetMin', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Min"
          />
          <input
            type="number"
            name="budgetMax"
            value={filters.budgetMax}
            onChange={(e) => updateBudget('budgetMax', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Max"
          />
        </div>
      </div>

      <div className="grid gap-2 mb-4 bg-white">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Available Date</h2>
          <button
            type="button"
            onClick={() => clearSection('date')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded transition"
          >
            Clear
          </button>
        </div>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={(e) => updateDate(e.target.value)}
          min={today}
          className="w-full border h-20 border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <FilterSection
        title="No. of Bedrooms"
        options={['1RK', '1BHK', '2BHK', '3BHK', '4+ BHK']}
        selectedOptions={filters.bedrooms}
        onToggleOption={(option) => toggleOption('bedrooms', option)}
        onClear={() => clearSection('bedrooms')}
      />
      <FilterSection
        title="Type of Property"
        options={['Flat', 'Villa', 'Independent House', 'Studio', 'Penthouse']}
        selectedOptions={filters.propertyType}
        onToggleOption={(option) => toggleOption('propertyType', option)}
        onClear={() => clearSection('propertyType')}
      />
      <FilterSection
        title="Available for"
        options={['Family', 'Bachelors', 'Company', 'Anyone']}
        selectedOptions={filters.availableFor}
        onToggleOption={(option) => toggleOption('availableFor', option)}
        onClear={() => clearSection('availableFor')}
      />
      <FilterSection
        title="Posted by"
        options={['Owner', 'Broker', 'Builder']}
        selectedOptions={filters.postedBy}
        onToggleOption={(option) => toggleOption('postedBy', option)}
        onClear={() => clearSection('postedBy')}
      />
      <FilterSection
        title="Furnishing Status"
        options={['Fully Furnished', 'Semi Furnished', 'Unfurnished']}
        selectedOptions={filters.furnishingStatus}
        onToggleOption={(option) => toggleOption('furnishingStatus', option)}
        onClear={() => clearSection('furnishingStatus')}
      />
      <FilterSection
        title="No. of Bathrooms"
        options={['1', '2', '3', '4+']}
        selectedOptions={filters.bathrooms}
        onToggleOption={(option) => toggleOption('bathrooms', option)}
        onClear={() => clearSection('bathrooms')}
      />
    </div>
  );
};

export default FilterBox;