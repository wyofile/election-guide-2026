import React, { useState, Suspense } from 'react'
import RaceCandidates from '@/components/RaceCandidates'
import Select from 'react-select' // NEW: Import react-select
const DistrictMap = React.lazy(() => import('@/components/DistrictMap'))

const StateRaces = ({ candidates }) => {
  const [chamber, setChamber] = useState('house')
  
  // District State & Options
  const [activeHouseDistrict, setActiveHouseDistrict] = useState('')
  const [activeSenateDistrict, setActiveSenateDistrict] = useState('')
  const [houseOptions, setHouseOptions] = useState([])
  const [senateOptions, setSenateOptions] = useState([])
  
  // Unified Search State
  const [address, setAddress] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [targetCoords, setTargetCoords] = useState(null)

  const currentOptions = chamber === 'house' ? houseOptions : senateOptions
  const activeDistrict = chamber === 'house' ? activeHouseDistrict : activeSenateDistrict
  const setActiveDistrict = chamber === 'house' ? setActiveHouseDistrict : setActiveSenateDistrict
  const labelPrefix = chamber === 'house' ? 'House District ' : 'Senate District '

  // --- REACT-SELECT OPTIONS & STYLES ---
  // Build the options array required by react-select
  const selectOptions = [
    { value: '', label: `Select a ${chamber === 'house' ? 'House' : 'Senate'} District` },
    ...currentOptions.map(d => ({
      value: d,
      label: `${labelPrefix}${parseInt(d.substring(1))}`
    }))
  ]

  // Find the current active object to feed to react-select
  const currentSelectValue = selectOptions.find(opt => opt.value === activeDistrict) || selectOptions[0]

  // Custom styling to make the control look like a header, and the menu look normal
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
      minHeight: 'auto',
      flex: 1
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 8px',
      justifyContent: 'center', // Centers the text
    }),
    singleValue: (base) => ({
      ...base,
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 800,
      textTransform: 'uppercase', // Keeps the header strictly uppercase
      color: '#0f172a',
      fontSize: '1.15rem', // Mobile size
      '@media (min-width: 800px)': { fontSize: '1.5rem' }, // Desktop size
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#475569',
      padding: '4px',
      cursor: 'pointer',
      '&:hover': { color: '#0f172a' }
    }),
    indicatorSeparator: () => ({ display: 'none' }), // Removes the default vertical line
    menu: (base) => ({
      ...base,
      width: '260px', // Constrains the width so it doesn't match the massive header
      left: '50%',
      transform: 'translateX(-50%)', // Centers the dropdown box perfectly under the title
      zIndex: 1000,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '280px', // Stops the list from hitting the bottom of the screen
    }),
    option: (base, state) => ({
      ...base,
      fontFamily: '"Roboto", sans-serif',
      fontSize: '1rem',
      fontWeight: 500,
      color: state.isSelected ? '#ffffff' : '#0f172a',
      backgroundColor: state.isSelected 
        ? '#d8a032' // Highlights the active selection in goldenrod
        : state.isFocused 
          ? '#f1f5f9' 
          : '#ffffff',
      cursor: 'pointer',
      padding: '10px 16px',
      '&:active': { backgroundColor: '#b07d20' }
    })
  }

  // --- ACTIONS ---
  const handleClearAddress = () => {
    setAddress('')
    setSearchStatus('')
    setTargetCoords(null)
  }

  const handleManualDistrictChange = (districtToSet) => {
    setActiveDistrict(districtToSet)
    handleClearAddress()
  }

  const handleAddressSearch = async (e) => {
    e.preventDefault()
    if (!address.trim()) return
    setSearchStatus('Searching...')
    
    try {
      let searchQuery = address.trim()
      if (!/wyoming|wy\b/i.test(searchQuery)) searchQuery += ', Wyoming'

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`)
      const data = await response.json()

      if (data && data.length > 0) {
        const addrDetails = data[0].address
        const stateName = addrDetails?.state || ''
        const displayName = data[0].display_name || ''
        
        if ((addrDetails && !stateName.toLowerCase().includes('wyoming')) || (!addrDetails && !displayName.toLowerCase().includes('wyoming'))) {
          setSearchStatus('Please enter a valid Wyoming address.')
          return 
        }

        const lon = parseFloat(data[0].lon)
        const lat = parseFloat(data[0].lat)
        
        if (addrDetails) {
          const street = `${addrDetails.house_number || ''} ${addrDetails.road || ''}`.trim()
          const city = addrDetails.city || addrDetails.town || addrDetails.village || ''
          const zip = addrDetails.postcode || ''

          let formatted = []
          if (street) formatted.push(street)
          if (city) formatted.push(city)
          
          let finalAddress = formatted.join(', ')
          if (stateName) finalAddress += `, ${stateName}`
          if (zip) finalAddress += ` ${zip}`

          setAddress(finalAddress)
        } else {
          setAddress(displayName) 
        }
        
        setTargetCoords([lon, lat])
        setSearchStatus('Address mapped successfully.')
      } else {
        setSearchStatus('Address not found.')
      }
    } catch (err) {
      setSearchStatus('Error looking up address.')
    }
  }

  const handlePrevDistrict = () => {
    if (!currentOptions.length) return
    let idx = activeDistrict ? currentOptions.indexOf(activeDistrict) : 0
    let prevIdx = (idx - 1 + currentOptions.length) % currentOptions.length
    handleManualDistrictChange(currentOptions[prevIdx])
  }

  const handleNextDistrict = () => {
    if (!currentOptions.length) return
    let idx = activeDistrict ? currentOptions.indexOf(activeDistrict) : -1
    let nextIdx = (idx + 1) % currentOptions.length
    handleManualDistrictChange(currentOptions[nextIdx])
  }

  const mapSearchProps = { address, setAddress, handleAddressSearch, handleClearAddress, searchStatus, targetCoords }

  return (
    <div className="legislature-dashboard">
      
      {/* 1. MASTER TITLE & CONTROL BAR */}
      <div className="dashboard-controls-modern">
        
        <div className="master-district-selector">
          <button className='master-arrow-btn' onClick={handlePrevDistrict}>&larr;</button>
          
          <div style={{ flex: 1, position: 'relative' }}>
            {/* REACT-SELECT COMPONENT */}
            <Select 
              value={currentSelectValue}
              onChange={(selectedOption) => handleManualDistrictChange(selectedOption.value)}
              options={selectOptions}
              styles={customSelectStyles}
              isSearchable={false} // CRITICAL for mobile: prevents the keyboard from popping up
              blurInputOnSelect={true}
              instanceId="district-selector"
            />
          </div>
          
          <button className='master-arrow-btn' onClick={handleNextDistrict}>&rarr;</button>
        </div>

        <div className="chamber-toggle-pill">
          <button className={`pill-btn ${chamber === 'house' ? 'active' : ''}`} onClick={() => setChamber('house')}>State House</button>
          <button className={`pill-btn ${chamber === 'senate' ? 'active' : ''}`} onClick={() => setChamber('senate')}>State Senate</button>
        </div>
        
      </div>

      {/* 2. SPLIT-PANE MAIN CONTENT */}
      {/* House Layout */}
      <div className={`chamber-pane ${chamber === 'house' ? 'is-active' : ''}`}>
        <div className="dashboard-split">
          <div className="map-column">
            <Suspense fallback={<div className="map-skeleton">Loading Map...</div>}>
              <DistrictMap chamber='house' activeDistrict={activeHouseDistrict} setActiveDistrict={setActiveHouseDistrict} setDistrictOptions={setHouseOptions} {...mapSearchProps} />
            </Suspense>
          </div>
          <div className="candidates-column">
            {activeHouseDistrict ? (
              <RaceCandidates chamber='house' district={activeHouseDistrict} candidates={candidates.filter((candidate) => candidate.office === `H${activeHouseDistrict.substring(1)}`)} />
            ) : (
              <div className="empty-district-prompt">
                <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <h4>Find Your Candidates</h4>
                <p>Select a district from the map, use the dropdown menu, or enter your address to view the candidates running in your area.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Senate Layout */}
      <div className={`chamber-pane ${chamber === 'senate' ? 'is-active' : ''}`}>
        <div className="dashboard-split">
          <div className="map-column">
            <Suspense fallback={<div className="map-skeleton">Loading Map...</div>}>
              <DistrictMap chamber='senate' activeDistrict={activeSenateDistrict} setActiveDistrict={setActiveSenateDistrict} setDistrictOptions={setSenateOptions} {...mapSearchProps} />
            </Suspense>
          </div>
          <div className="candidates-column">
            {activeSenateDistrict ? (
              <RaceCandidates chamber='senate' district={activeSenateDistrict} candidates={candidates.filter((candidate) => candidate.office === `S${activeSenateDistrict.substring(1)}`)} />
            ) : (
              <div className="empty-district-prompt">
                <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <h4>Find Your Candidates</h4>
                <p>Select a district from the map, use the dropdown menu, or enter your address to view the candidates running in your area.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default StateRaces