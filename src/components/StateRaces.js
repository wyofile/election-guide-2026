
import React, { useState, Suspense } from 'react'

import RaceCandidates from '@/components/RaceCandidates'
const DistrictMap = React.lazy(()=> import('@/components/DistrictMap'));


const StateRaces = ({ candidates }) => {
  const [chamber, setChamber] = useState('house')
  const [activeHouseDistrict, setActiveHouseDistrict] = useState('')
  const [activeSenateDistrict, setActiveSenateDistrict] = useState('')

  return (
    <>
      <div className='chamber-selector'>
        <div className={`selector ${chamber === 'house' ? 'active' : ''}`} onClick={() => setChamber('house')}>WY State House</div>
        <div className={`selector ${chamber === 'senate' ? 'active' : ''}`} onClick={() => setChamber('senate')}>WY State Senate</div>
      </div>
      <div className="state-race-container">
        <div className={`chamber-container ${chamber ==='house' && 'visible'}`}>
          <h3 className='race-header'>{activeHouseDistrict ? `State House District ${parseInt(activeHouseDistrict.substring(1))}` : "Select a house district to view candidates"}</h3>
          <Suspense fallback={<div className="map-container">Loading...</div>}>
            <DistrictMap chamber='house' activeDistrict={activeHouseDistrict} setActiveDistrict={setActiveHouseDistrict} />
          </Suspense>
          <RaceCandidates chamber='house' district={activeSenateDistrict} candidates={candidates.filter((candidate)=>candidate.office === `H${activeHouseDistrict.substring(1)}`)} />
        </div>
        <div className={`chamber-container ${chamber ==='senate' && 'visible'}`}>
          <h3 className='race-header'>{activeSenateDistrict ? `State Senate District ${parseInt(activeSenateDistrict)}` : "Select a senate district to view candidates"}</h3>
          <Suspense fallback={<div className="map-container">Loading...</div>}>
            <DistrictMap chamber='senate' activeDistrict={activeSenateDistrict} setActiveDistrict={setActiveSenateDistrict} />
          </Suspense>
          <RaceCandidates chamber='senate' district={activeSenateDistrict} candidates={candidates.filter((candidate)=> candidate.office === `S${activeSenateDistrict.substring(1)}`)} />
        </div>
      </div>
    </>
  )
}

export default StateRaces