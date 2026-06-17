import React, { useState, Suspense } from 'react'
import RaceCandidates from '@/components/RaceCandidates'
const DistrictMap = React.lazy(() => import('@/components/DistrictMap'))

const StateRaces = ({ candidates }) => {
  const [chamber, setChamber] = useState('house')
  const [activeHouseDistrict, setActiveHouseDistrict] = useState('')
  const [activeSenateDistrict, setActiveSenateDistrict] = useState('')
  
  const [address, setAddress] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [targetCoords, setTargetCoords] = useState(null)

  const handleClearAddress = () => {
    setAddress('')
    setSearchStatus('')
    setTargetCoords(null)
  }

  const handleAddressSearch = async (e) => {
    e.preventDefault()
    if (!address.trim()) return
    setSearchStatus('Searching...')
    
    try {
      // 1. Prevent duplicate "Wyoming" tags which break the Nominatim search algorithm
      let searchQuery = address.trim()
      if (!/wyoming|wy\b/i.test(searchQuery)) {
        searchQuery += ', Wyoming'
      }

      // 2. Add &addressdetails=1 to the fetch URL so we get clean, separated data
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`)
      const data = await response.json()

      if (data && data.length > 0) {
        const lon = parseFloat(data[0].lon)
        const lat = parseFloat(data[0].lat)
        
        // 3. Format the address beautifully (Standard US format)
        const addrDetails = data[0].address
        if (addrDetails) {
          // Grab street info (trimming in case house_number is missing)
          const street = `${addrDetails.house_number || ''} ${addrDetails.road || ''}`.trim()
          // Nominatim sometimes categorizes smaller cities as towns or villages
          const city = addrDetails.city || addrDetails.town || addrDetails.village || ''
          const state = addrDetails.state || 'WY'
          const zip = addrDetails.postcode || ''

          // Build the string: "1024 Palmer Drive, Laramie, WY 82070"
          let formatted = []
          if (street) formatted.push(street)
          if (city) formatted.push(city)
          
          let finalAddress = formatted.join(', ')
          if (state) finalAddress += `, ${state}`
          if (zip) finalAddress += ` ${zip}`

          setAddress(finalAddress)
        } else {
          // Fallback just in case address details are missing
          setAddress(data[0].display_name) 
        }
        
        setTargetCoords([lon, lat])
        setSearchStatus('District found!')
        setTimeout(() => setSearchStatus(''), 3000)
      } else {
        setSearchStatus('Address not found.')
      }
    } catch (err) {
      setSearchStatus('Error looking up address.')
    }
  }

  return (
    <div className="legislature-dashboard">
      
      {/* 1. UNIFIED CONTROL BAR */}
      <div className="dashboard-controls">
        <div className="search-widget">
          <form onSubmit={handleAddressSearch} className="address-form-inline">
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Enter your address..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="dashboard-search-input"
                />
                {address && (
                  <button 
                    type="button" 
                    className="clear-address-btn" 
                    onClick={handleClearAddress}
                    aria-label="Clear address"
                  >
                    &times;
                  </button>
                )}
              </div>
              <button type="submit" className="dashboard-search-btn">Search</button>
            </form>
          {searchStatus && <span className="search-status-inline">{searchStatus}</span>}
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
      {/* House Layout (Hidden safely via CSS when inactive) */}
      <div className={`chamber-pane ${chamber === 'house' ? 'is-active' : ''}`}>
        <div className="dashboard-split">
          <div className="map-column">
            <Suspense fallback={<div className="map-skeleton">Loading Map...</div>}>
              <DistrictMap chamber='house' activeDistrict={activeHouseDistrict} setActiveDistrict={setActiveHouseDistrict} targetCoords={targetCoords} />
            </Suspense>
          </div>
          <div className="candidates-column">
            <h3 className='race-header'>
              {activeHouseDistrict ? `House District ${parseInt(activeHouseDistrict.substring(1))}` : "Select a House district"}
            </h3>
            <RaceCandidates chamber='house' district={activeHouseDistrict} candidates={candidates.filter((candidate) => candidate.office === `H${activeHouseDistrict.substring(1)}`)} />
          </div>
        </div>
      </div>

      {/* Senate Layout */}
      <div className={`chamber-pane ${chamber === 'senate' ? 'is-active' : ''}`}>
        <div className="dashboard-split">
          <div className="map-column">
            <Suspense fallback={<div className="map-skeleton">Loading Map...</div>}>
              <DistrictMap chamber='senate' activeDistrict={activeSenateDistrict} setActiveDistrict={setActiveSenateDistrict} targetCoords={targetCoords} />
            </Suspense>
          </div>
          <div className="candidates-column">
            <h3 className='race-header'>
              {activeSenateDistrict ? `Senate District ${parseInt(activeSenateDistrict)}` : "Select a Senate district"}
            </h3>
            <RaceCandidates chamber='senate' district={activeSenateDistrict} candidates={candidates.filter((candidate) => candidate.office === `S${activeSenateDistrict.substring(1)}`)} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default StateRaces