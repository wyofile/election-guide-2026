import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import countyLinks from '@/data/county-clerks-links.json';
import { ExternalArrow } from '@/components/CandidateStories';

const Select = dynamic(() => import('react-select'), { ssr: false });

const customSelectStyles = {
  control: (base) => ({
    ...base,
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
    minHeight: '44px',
  }),
  valueContainer: (base) => ({ ...base, padding: '0 16px' }),
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
    fontSize: '1rem',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#475569',
    padding: '8px 12px',
    cursor: 'pointer',
    '&:hover': { color: '#0f172a' },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menu: (base) => ({
    ...base,
    zIndex: 1000,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginTop: '4px',
  }),
  menuList: (base) => ({ ...base, maxHeight: '280px' }),
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
    '&:active': { backgroundColor: 'var(--darker-sea-green, #77958f)' },
  }),
};

export default function CountyClerkLocator() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const dropdownOptions = countyLinks.map(item => ({
    value: item.link,
    label: item.county,
  }));

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedOption(null);
  }, []);

  const handleGoClick = () => {
    if (selectedOption?.value) {
      window.open(selectedOption.value, '_blank', 'noopener,noreferrer');
    }
  };

  // Open via custom event dispatched by #clerk-locator links in FAQ markdown
  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    window.addEventListener('open-clerk-modal', onOpen);
    return () => window.removeEventListener('open-clerk-modal', onOpen);
  }, []);

  // Escape key + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close]);

  return (
    <>
      {isOpen && (
        <div
          className="clerk-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Find Your County Clerk"
        >
          <div className="clerk-modal-panel">
            <button className="clerk-modal-close" onClick={close} aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 className="clerk-locator-title">Find Your County Clerk</h3>
            <p className="clerk-locator-note">
              Many voting questions—registration, absentee ballots, and local races—are handled at the county level. Select your county to visit their official site.
            </p>

            <div className="clerk-field-wrapper">
              <div className="clerk-input-container">
                <div className="clerk-react-select-container">
                  <Select
                    options={dropdownOptions}
                    onChange={setSelectedOption}
                    value={selectedOption}
                    placeholder="Select a County..."
                    isClearable
                    styles={customSelectStyles}
                    instanceId="county-clerk-locator"
                    menuPlacement="auto"
                    menuPosition="fixed"
                    blurInputOnSelect={true}
                    isSearchable={false}
                  />
                </div>
                <button
                  onClick={handleGoClick}
                  disabled={!selectedOption}
                  className="clerk-submit-btn"
                >
                  Go <ExternalArrow />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
