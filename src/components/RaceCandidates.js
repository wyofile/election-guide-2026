import senateHoldovers from '../data/senate-holdovers.json'

import Link from 'next/link'

import { pluralize } from '../lib/utils'
import { PARTIES } from '../lib/styles'

import Candidate from './Candidate'

// ELECTION_CYCLE Options:
// primary, general, post-election
const ELECTION_CYCLE = 'primary'

const OutOfCycleBox = ({holdover}) => {
  const holdoverPartyInfo = PARTIES.find(party => party.key === holdover.party)
  console.log(holdoverPartyInfo)
  return (
    <div className="out-of-cycle-note">
      <div><strong>SD {parseInt(holdover.office.substring(1))}</strong> is out of cycle in 2026</div>
      <br />
      <div>
          <Link target="_blank" href={holdover.wyoleg} className="holdover" style={{ borderTop: `3px solid ${holdoverPartyInfo.color}` }}>
              <div className="holdover-party-icon" style={{ backgroundColor: holdoverPartyInfo.color }}>{holdover.party[0]}</div>
              <div className="holdover-info">
                <div className="holdover-name">Sen. {holdover.displayName}</div>
                <div className="wyoleg-note">
                  View on WyoLeg.gov <img src="external.svg"></img>
                </div>
              </div>
          </Link>
          <div>will represent the district as a holdover.</div>
      </div>
    </div>
  )
}

const RaceCandidates = ({office, candidates, chamber}) => {

  const activeCandidates = candidates.filter(c => c.status === 'active' || c.status === 'won-general' || c.status === 'lost-general' )
  const lostPrimaryCandidates = candidates.filter(c => c.status === 'lost-primary' )
  const withdrawnCandidates = candidates.filter(c => c.status === 'dropout' )

  return (
    <>
    {candidates.length > 0 &&
      <div className="party-buckets">
          {
              PARTIES.map(party => {
                  const candidatesInBucket = activeCandidates.filter(candidate => candidate.party === party.key)
                  const isUncontestedPrimary = candidatesInBucket.length === 1 && (party.key === "REP" || party.key === "DEM")
                  const isUncontestedGeneral = activeCandidates.length === 1 && candidatesInBucket.length === 1
                  const isMinorPartyNoCandidates = candidatesInBucket.length === 0 && (party.key != "REP" && party.key != "DEM")
                  const isIndependent = party.key === 'IND'
                  
                  if (isMinorPartyNoCandidates) return null
                  return <div className="party-bucket" key={party.key} style={{ borderLeft: `3px solid ${party.color}` }}>
                      <h4 style={{
                          color: party.color
                      }}>{pluralize(party.noun, candidatesInBucket.length)}</h4>
                      {candidatesInBucket.length === 0 && <div className="party-note">No {party.adjective} candidates {ELECTION_CYCLE === 'post-election' ? 'ran' : 'are running'} in this district.</div>}
                      <div>{candidatesInBucket.map(candidate => <Candidate key={candidate.slug} color={party.color} {...candidate} />)}</div>
                      {(isUncontestedPrimary && ELECTION_CYCLE === 'primary') && <div className="party-note">This candidate is running uncontested in the {party.adjective} primary.</div>}
                      {(isUncontestedGeneral && ELECTION_CYCLE === 'general') && <div className="party-note">This candidate is running uncontested in the general election.</div>}
                      {(isIndependent && ELECTION_CYCLE ==='primary') && <div className="party-note">Independent candidates do not participate in a primary election. They must collect signatures to appear on the general election ballot.</div>}
                  </div>
              })
          }
      </div>
    }
    {(office && candidates.length === 0 && chamber === 'senate') && 
      <OutOfCycleBox holdover={senateHoldovers.find((holdover) => holdover.office === `S${office.substring(1)}`)} />
    }
    { lostPrimaryCandidates.length > 0 && 
      <details>
        <summary>Candidates defeated in Aug 20 primary election</summary>
        <div className="party-buckets">
          {
            PARTIES.map(party => {
              const candidatesInBucket = lostPrimaryCandidates.filter(c => c.party === party.key)
              if (candidatesInBucket.length === 0) return null
              return(
                <div className="party-bucket" key={party.key} style={{ borderLeft: `3px solid ${party.color}` }}>
                      <h4 style={{
                          color: party.color
                      }}>{pluralize(party.noun, candidatesInBucket.length)}</h4>
                      <div>{candidatesInBucket.map(candidate => <Candidate key={candidate.slug} color={party.color} {...candidate} />)}</div>
                </div>
              )
            })
          }
        </div>
      </details>
    }
    { withdrawnCandidates.length > 0 && 
      <details>
        <summary>Withdrawn Candidates</summary>
        <div className="party-buckets">
          {
            PARTIES.map(party => {
              const candidatesInBucket = withdrawnCandidates.filter(c => c.party === party.key)
              if (candidatesInBucket.length === 0) return null
              return(
                <div className="party-bucket" key={party.key} style={{ borderLeft: `3px solid ${party.color}` }}>
                      <h4 style={{
                          color: party.color
                      }}>{pluralize(party.noun, candidatesInBucket.length)}</h4>
                      <div>{candidatesInBucket.map(candidate => <Candidate key={candidate.slug} color={party.color} {...candidate} />)}</div>
                </div>
              )
            })
          }
        </div>
      </details>
    }
    </>
  )
}

export default RaceCandidates

