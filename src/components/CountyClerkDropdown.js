import React, { useState } from 'react';
import Select from 'react-select';
import countyLinks from '@/data/county-clerks-links.json';

export default function CountyClerkDropdown() {
  const [selectedOption, setSelectedOption] = useState(null);

  // Format the JSON data into the shape required by react-select: { value, label }
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

  // Custom styling mirroring the StateRaces.js master selector, updated with sea-green
  const customSelectStyles = {
    container: (base) => ({
      ...base,
      width: '260px',
      fontFamily: '"Roboto", sans-serif'
    }),
    control: (base, state) => ({
      ...base,
      background: '#ffffff',
      border: '1px solid',
      borderColor: state.isFocused ? '#94a3b8' : '#cbd5e1',
      borderRadius: '8px',
      boxShadow: 'none',
      cursor: 'pointer',
      minHeight: '40px',
      '&:hover': {
        borderColor: '#94a3b8'
      }
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 12px',
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
      padding: '8px',
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
        ? 'var(--dark-sea-green, #89a6a0)' // Swapped goldenrod for dark-sea-green to match the button
        : state.isFocused 
          ? '#f1f5f9' 
          : '#ffffff',
      cursor: 'pointer',
      padding: '10px 16px',
      '&:active': { backgroundColor: 'var(--darker-sea-green, #77958f)' }
    })
  };

  return (
    <div 
      className="county-dropdown-container" 
      style={{ 
        marginTop: '1rem', 
        display: 'flex', 
        gap: '0.5rem', 
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingLeft: '16px'
      }}
    >
      <Select
        options={dropdownOptions}
        onChange={handleDropdownChange}
        value={selectedOption}
        placeholder="Select a County"
        isClearable
        styles={customSelectStyles}
        className="county-dropdown-select"
      />
      <button 
        onClick={handleGoClick}
        disabled={!selectedOption}
        className="county-dropdown-btn"
        style={{
          padding: '0 1.25rem',
          height: '40px',
          backgroundColor: selectedOption ? 'var(--dark-sea-green, #89a6a0)' : '#e2e8f0', // Implemented dark-sea-green
          color: selectedOption ? '#ffffff' : '#94a3b8',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '14px',
          fontFamily: '"Roboto", sans-serif',
          cursor: selectedOption ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          boxShadow: selectedOption ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
        }}
        onMouseEnter={(e) => {
          if (selectedOption) e.target.style.backgroundColor = 'var(--darker-sea-green, #77958f)'; // Implemented darker-sea-green on hover
        }}
        onMouseLeave={(e) => {
          if (selectedOption) e.target.style.backgroundColor = 'var(--dark-sea-green, #89a6a0)';
        }}
      >
        Go to County Clerk's Website <span className="external-arrow">&#8599;</span>
      </button>
    </div>
  );
}