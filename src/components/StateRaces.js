import React, { useState, Suspense } from 'react'
import RaceCandidates from '@/components/RaceCandidates'
const DistrictMap = React.lazy(() => import('@/components/DistrictMap'))

const StateRaces = ({ candidates }) => {
  const [chamber, setChamber] = useState('house')
  
  // District State & Options
  const [activeHouseDistrict, setActiveHouseDistrict] = useState('')
  const [activeSenateDistrict, setActiveSenateDistrict] = useState('')
  const [houseOptions, setHouseOptions] = useState([])
  const [senateOptions, setSenateOptions] = useState([])
  
  // Unified Search State (Persists across chamber toggles)
  const [address, setAddress] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [targetCoords, setTargetCoords] = useState(null)

  // Derived active properties based on selected chamber
  const currentOptions = chamber === 'house' ? houseOptions : senateOptions
  const activeDistrict = chamber === 'house' ? activeHouseDistrict : activeSenateDistrict
  const setActiveDistrict = chamber === 'house' ? setActiveHouseDistrict : setActiveSenateDistrict
  const labelPrefix = chamber === 'house' ? 'House District ' : 'Senate District '

  const handleAddressSearch = async (e) => {
    e.preventDefault()
    if (!address.trim()) return
    setSearchStatus('Searching...')
    
    try {
      let searchQuery = address.trim()
      // Append Wyoming to help guide the initial search
      if (!/wyoming|wy\b/i.test(searchQuery)) searchQuery += ', Wyoming'

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`)
      const data = await response.json()

      if (data && data.length > 0) {
        const addrDetails = data[0].address
        const stateName = addrDetails?.state || ''
        const displayName = data[0].display_name || ''
        
        // SECURITY CHECK: Ensure the geocoder actually returned a location in Wyoming
        if (
          (addrDetails && !stateName.toLowerCase().includes('wyoming')) || 
          (!addrDetails && !displayName.toLowerCase().includes('wyoming'))
        ) {
          setSearchStatus('Please enter a valid Wyoming address.')
          return // Stop processing so we don't drop a pin in another state
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

  // Master Control Arrows
  const handleClearAddress = () => {
    setAddress('')
    setSearchStatus('')
    setTargetCoords(null)
  }

  // NEW: Wrapper that clears the address form when they manually change districts
  const handleManualDistrictChange = (districtToSet) => {
    setActiveDistrict(districtToSet)
    handleClearAddress()
  }

  // Master Control Arrows (Now using the wrapper)
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

  const mapSearchProps = {
    address, setAddress, handleAddressSearch, handleClearAddress, searchStatus, targetCoords
  }

  return (
    <div className="legislature-dashboard">
      
      {/* 1. MASTER TITLE & CONTROL BAR */}
      <div className="dashboard-controls-modern">
        
        <div className="master-district-selector">
          <button className='master-arrow-btn' onClick={handlePrevDistrict}>&larr;</button>
          
          {/* Dropdown now uses the wrapper */}
          <select 
            className="master-ui-dropdown" 
            onChange={(e) => handleManualDistrictChange(e.target.value)} 
            value={activeDistrict || ''}
          >
            <option value=''>All {chamber === 'house' ? 'House' : 'Senate'} Districts</option>
            {currentOptions.map(d => <option key={d} value={d}>{labelPrefix + parseInt(d.substring(1))}</option>)}
          </select>
          
          <button className='master-arrow-btn' onClick={handleNextDistrict}>&rarr;</button>
        </div>

        <div className="chamber-toggle-pill">
          <button 
            className={`pill-btn ${chamber === 'house' ? 'active' : ''}`} 
            onClick={() => setChamber('house')}
          >
            State House
          </button>
          <button 
            className={`pill-btn ${chamber === 'senate' ? 'active' : ''}`} 
            onClick={() => setChamber('senate')}
          >
            State Senate
          </button>
        </div>
        
      </div>

      {/* 2. SPLIT-PANE MAIN CONTENT */}
      {/* House Layout */}
      <div className={`chamber-pane ${chamber === 'house' ? 'is-active' : ''}`}>
        <div className="dashboard-split">
          <div className="map-column">
            <Suspense fallback={<div className="map-skeleton">Loading Map...</div>}>
              <DistrictMap 
                chamber='house' 
                activeDistrict={activeHouseDistrict} 
                setActiveDistrict={setActiveHouseDistrict} 
                setDistrictOptions={setHouseOptions}
                {...mapSearchProps}
              />
            </Suspense>
          </div>
          <div className="candidates-column">
            {activeHouseDistrict ? (
              <RaceCandidates chamber='house' district={activeHouseDistrict} candidates={candidates.filter((candidate) => candidate.office === `H${activeHouseDistrict.substring(1)}`)} />
            ) : (
              <div className="empty-district-prompt">
                <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
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
              <DistrictMap 
                chamber='senate' 
                activeDistrict={activeSenateDistrict} 
                setActiveDistrict={setActiveSenateDistrict}
                setDistrictOptions={setSenateOptions} 
                {...mapSearchProps}
              />
            </Suspense>
          </div>
          <div className="candidates-column">
            {activeSenateDistrict ? (
              <RaceCandidates chamber='senate' district={activeSenateDistrict} candidates={candidates.filter((candidate) => candidate.office === `S${activeSenateDistrict.substring(1)}`)} />
            ) : (
              <div className="empty-district-prompt">
                <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
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