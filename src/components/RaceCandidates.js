import senateHoldovers from '../data/senate-holdovers.json'
import Link from 'next/link'
import { pluralize } from '../lib/utils'
import { PARTIES } from '../lib/styles'
import Candidate from './Candidate'

const ELECTION_CYCLE = 'primary'

const OutOfCycleBox = ({holdover}) => {
  const holdoverPartyInfo = PARTIES.find(party => party.key === holdover.party)
  
  return (
    <div className="modern-out-of-cycle">
      <div className="ooc-header">
        <strong>SD {parseInt(holdover.office.substring(1))}</strong> is out of cycle in 2026.
      </div>
      <div className="ooc-body">
        <Link target="_blank" href={holdover.wyoleg} className="holdover-card" style={{ '--party-color': holdoverPartyInfo.color }}>
          <div className="holdover-avatar" style={{ backgroundColor: holdoverPartyInfo.color }}>
            {holdover.party[0]}
          </div>
          <div className="holdover-info">
            <h5 className="holdover-name">Sen. {holdover.displayName}</h5>
            <span className="holdover-link-text">View on WyoLeg.gov &#8599;</span>
          </div>
        </Link>
        <div className="ooc-footer">will represent the district as a holdover.</div>
      </div>
    </div>
  )
}

const RaceCandidates = ({district, candidates, chamber}) => {
  const activeCandidates = candidates.filter(c => c.status === 'active' || c.status === 'won-general' || c.status === 'lost-general' )
  const lostPrimaryCandidates = candidates.filter(c => c.status === 'lost-primary' )
  const withdrawnCandidates = candidates.filter(c => c.status === 'dropout' )

  return (
    <div className="race-candidates-wrapper">
      {candidates.length > 0 &&
        <div className="modern-party-buckets">
          {PARTIES.map(party => {
            const candidatesInBucket = activeCandidates.filter(candidate => candidate.party === party.key)
            const isUncontestedPrimary = candidatesInBucket.length === 1 && (party.key === "REP" || party.key === "DEM")
            const isUncontestedGeneral = activeCandidates.length === 1 && candidatesInBucket.length === 1
            const isMinorPartyNoCandidates = candidatesInBucket.length === 0 && (party.key !== "REP" && party.key !== "DEM")
            const isIndependent = party.key === 'IND'
            
            if (isMinorPartyNoCandidates) return null
            
            return (
              <div className="party-bucket-col" key={party.key}>
                <h4 className="party-bucket-title" style={{ color: party.color, borderBottomColor: party.color }}>
                  {pluralize(party.noun, candidatesInBucket.length)}
                </h4>
                
                {candidatesInBucket.length === 0 && (
                  <div className="modern-party-note">No {party.adjective} candidates {ELECTION_CYCLE === 'post-election' ? 'ran' : 'are running'} for this office.</div>
                )}
                
                <div className="candidate-grid">
                  {candidatesInBucket.map(candidate => <Candidate key={candidate.slug} color={party.color} {...candidate} />)}
                </div>
                
                {(isUncontestedPrimary && ELECTION_CYCLE === 'primary') && <div className="modern-party-note">This candidate is running uncontested in the {party.adjective} primary.</div>}
                {(isUncontestedGeneral && ELECTION_CYCLE === 'general') && <div className="modern-party-note">This candidate is running uncontested in the general election.</div>}
                {(isIndependent && ELECTION_CYCLE ==='primary') && <div className="modern-party-note">Independent candidates do not participate in a primary election. They must collect signatures to appear on the general election ballot.</div>}
              </div>
            )
          })}
        </div>
      }
      
      {(district && candidates.length === 0 && chamber === 'senate') && 
        <OutOfCycleBox holdover={senateHoldovers.find((holdover) => holdover.office === `S${district.substring(1)}`)} />
      }

      {/* Reusable Accordion Function for Dropouts/Lost */}
      {[
        { condition: lostPrimaryCandidates.length > 0, title: "Candidates defeated in Aug 20 primary", data: lostPrimaryCandidates },
        { condition: withdrawnCandidates.length > 0, title: "Withdrawn Candidates", data: withdrawnCandidates }
      ].map((section, idx) => section.condition && (
        <details className="modern-details-accordion" key={idx}>
          <summary>{section.title}</summary>
          <div className="modern-party-buckets accordion-inner">
            {PARTIES.map(party => {
              const candidatesInBucket = section.data.filter(c => c.party === party.key)
              if (candidatesInBucket.length === 0) return null
              return(
                <div className="party-bucket-col" key={party.key}>
                  <h4 className="party-bucket-title" style={{ color: party.color, borderBottomColor: party.color }}>
                    {pluralize(party.noun, candidatesInBucket.length)}
                  </h4>
                  <div className="candidate-grid">
                    {candidatesInBucket.map(candidate => <Candidate key={candidate.slug} color={party.color} {...candidate} />)}
                  </div>
                </div>
              )
            })}
          </div>
        </details>
      ))}
    </div>
  )
}

export default RaceCandidates