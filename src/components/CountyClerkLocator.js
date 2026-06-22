import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import countyLinks from '@/data/county-clerks-links.json';

// Dynamically import react-select to prevent Next.js SSR hydration crashes
const Select = dynamic(() => import('react-select'), { ssr: false });

export default function CountyClerkLocator() {
  const [selectedOption, setSelectedOption] = useState(null);

  const dropdownOptions = countyLinks.map(item => ({
    value: item.link,
    label: item.county
  }));

  const handleDropdownChange = (option) => {
    setSelectedOption(option);
  };

  const handleGoClick = () => {
    if (selectedOption && selectedOption.value) {
      window.open(selectedOption.value, '_blank', 'noopener,noreferrer');
    }
  };

  // Custom styles for react-select, tailored to sit inside the unified wrapper
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      background: 'transparent',
      border: 'none', // Border is handled by the parent .clerk-input-container
      boxShadow: 'none',
      cursor: 'pointer',
      minHeight: '44px', // Slightly taller to match the CandidateSearch inputs
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 16px',
    }),
    singleValue: (base) => ({
      ...base,
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 600,
      color: '#0f172a',
      fontSize: '1rem',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#64748b',
      fontFamily: '"Roboto", sans-serif',
      fontSize: '1rem'
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#475569',
      padding: '8px 12px',
      cursor: 'pointer',
      '&:hover': { color: '#0f172a' }
    }),
    indicatorSeparator: () => ({ 
      display: 'none' 
    }),
    menu: (base) => ({
      ...base,
      zIndex: 1000,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      marginTop: '4px'
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '280px',
    }),
    option: (base, state) => ({
      ...base,
      fontFamily: '"Roboto", sans-serif',
      fontSize: '1rem',
      fontWeight: 500,
      color: state.isSelected ? '#ffffff' : '#0f172a',
      backgroundColor: state.isSelected 
        ? 'var(--dark-sea-green, #89a6a0)' 
        : state.isFocused 
          ? '#f1f5f9' 
          : '#ffffff',
      cursor: 'pointer',
      padding: '10px 16px',
      '&:active': { backgroundColor: 'var(--darker-sea-green, #77958f)' }
    })
  };

  return (
    <div className="clerk-locator-box">
      <h3 className="clerk-locator-title">Find Your County Clerk's Election Website</h3>
      <p className="clerk-locator-note">
        Many voting questions—including registration, absentee ballots, and local races—are handled at the county level. Select your county to visit their official site.
      </p>
      
      <div className="clerk-field-wrapper">
        <div className="clerk-input-container">
          <div className="clerk-react-select-container">
            <Select
              options={dropdownOptions}
              onChange={handleDropdownChange}
              value={selectedOption}
              placeholder="Select a County..."
              isClearable
              styles={customSelectStyles}
              instanceId="county-clerk-locator"
              blurInputOnSelect={true}
              isSearchable={false}
            />
          </div>
          
          <button 
            onClick={handleGoClick}
            disabled={!selectedOption}
            className="clerk-submit-btn"
          >
            Go <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14" height="14" viewBox="0 0 48 48"><path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}