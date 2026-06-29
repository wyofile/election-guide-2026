import React, { useState, Suspense } from 'react'
import Markdown from 'react-markdown'
import RaceCandidates from '@/components/RaceCandidates'
import Select from 'react-select'
const DistrictMap = React.lazy(() => import('@/components/DistrictMap'))

const StateRaces = ({ candidates, intro }) => {
  const [chamber, setChamber] = useState('house')
  
  // District State & Options
  const [activeHouseDistrict, setActiveHouseDistrict] = useState('')
  const [activeSenateDistrict, setActiveSenateDistrict] = useState('')
  const [houseOptions, setHouseOptions] = useState([])
  const [senateOptions, setSenateOptions] = useState([])
  
  // Unified Search State (Expanded to distinct fields)
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  
  const [searchStatus, setSearchStatus] = useState('')
  const [targetCoords, setTargetCoords] = useState(null)

  const currentOptions = chamber === 'house' ? houseOptions : senateOptions
  const activeDistrict = chamber === 'house' ? activeHouseDistrict : activeSenateDistrict
  const setActiveDistrict = chamber === 'house' ? setActiveHouseDistrict : setActiveSenateDistrict
  const labelPrefix = chamber === 'house' ? 'House District ' : 'Senate District '

  // --- REACT-SELECT OPTIONS & STYLES ---
  const selectOptions = [
    { value: '', label: `Select a ${chamber === 'house' ? 'House' : 'Senate'} District` },
    ...currentOptions.map(d => ({
      value: d,
      label: `${labelPrefix}${parseInt(d.substring(1))}`
    }))
  ]

  const currentSelectValue = selectOptions.find(opt => opt.value === activeDistrict) || selectOptions[0]

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
      justifyContent: 'center',
    }),
    singleValue: (base) => ({
      ...base,
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 800,
      textTransform: 'uppercase',
      color: '#0f172a',
      fontSize: '1.15rem',
      '@media (min-width: 800px)': { fontSize: '1.5rem' },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#475569',
      padding: '4px',
      cursor: 'pointer',
      '&:hover': { color: '#0f172a' }
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    menu: (base) => ({
      ...base,
      width: '260px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
        ? '#d8a032' 
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
    setStreet('')
    setCity('')
    setZip('')
    setSearchStatus('')
    setTargetCoords(null)
  }

  const handleManualDistrictChange = (districtToSet) => {
    setActiveDistrict(districtToSet)
    handleClearAddress()
  }

  const handleAddressSearch = async (e) => {
    e.preventDefault()
    if (!street.trim() && !city.trim() && !zip.trim()) return
    setSearchStatus('Searching...')

    try {
      // Assemble the parts and force Wyoming
      const searchQuery = `${street.trim()} ${city.trim()} ${zip.trim()}, Wyoming`.trim()
      
      const proxyEndpoint = `https://awe1jjtpmj.execute-api.us-east-1.amazonaws.com//geocode?address=${encodeURIComponent(searchQuery)}`
      
      const response = await fetch(proxyEndpoint)
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        const coords = result.geometry.location
        
        let resStreetNum = '', resRoute = '', resCity = '', resState = '', resZip = ''

        result.address_components.forEach(comp => {
          const types = comp.types
          if (types.includes('street_number')) resStreetNum = comp.long_name
          if (types.includes('route')) resRoute = comp.short_name
          if (types.includes('locality') || types.includes('sublocality')) resCity = comp.long_name
          if (types.includes('administrative_area_level_1')) resState = comp.short_name
          if (types.includes('postal_code')) resZip = comp.long_name
        });

        // 1. Boundary check
        if (resState !== 'WY' && resState !== 'Wyoming') {
          setSearchStatus('Please enter a valid Wyoming address.')
          return;
        }

        // 2. Vague Address Check (If Google only matched the state)
        if (!resRoute && !resCity && !resZip) {
          setSearchStatus('Address not found. Please try adding more details.')
          return;
        }

        // Populate the input fields cleanly based on Google's matched data
        setStreet(`${resStreetNum} ${resRoute}`.trim())
        setCity(resCity)
        setZip(resZip)
        
        setTargetCoords([coords.lng, coords.lat]);
        setSearchStatus('Address mapped successfully.')
      } else {
        setSearchStatus('Unable to map it.')
      }
    } catch (err) {
      console.error('Search error:', err)
      setSearchStatus('Error looking up address.')
    }
  }

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchStatus('Geolocation is not supported by your browser.')
      return
    }

    setSearchStatus('Locating...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        // Instant mathematical boundary check
        const isInsideWyoming = lat >= 41.0 && lat <= 45.0 && lon >= -111.05 && lon <= -104.05;

        if (!isInsideWyoming) {
          setSearchStatus('Current location is outside Wyoming.')
          return
        }

        setStreet('Current Location')
        setCity('')
        setZip('')
        setTargetCoords([lon, lat])
        setSearchStatus('Location mapped successfully.')
      },
      (error) => {
        console.error('Geolocation error:', error)
        setSearchStatus('Unable to retrieve location. Please check browser permissions.')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
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

  // Pass all individual states down
  const mapSearchProps = { 
    street, setStreet, 
    city, setCity, 
    zip, setZip, 
    handleAddressSearch, handleCurrentLocation, handleClearAddress, searchStatus, targetCoords 
  }

  return (
    <div className="legislature-dashboard">

      {intro && <div className="legislature-intro"><Markdown>{intro}</Markdown></div>}

      {/* 1. MASTER TITLE & CONTROL BAR */}
      <div className="dashboard-controls-modern">
        
        <div className="master-district-selector">
          <button className='master-arrow-btn' onClick={handlePrevDistrict}>&larr;</button>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <Select 
              value={currentSelectValue}
              onChange={(selectedOption) => handleManualDistrictChange(selectedOption.value)}
              options={selectOptions}
              styles={customSelectStyles}
              isSearchable={false}
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