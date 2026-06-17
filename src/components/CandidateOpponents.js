import { PARTIES } from '@/lib/styles'
import { pluralize, getPortraitPath, usePath } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

const Candidate = ({ slug, ballotName, party, hasPhoto, isCurrentPage }) => {

  const partyInfo = PARTIES.find(d => d.key === party)
  const portraitPath = getPortraitPath(hasPhoto,party,slug)

  return (
    <div className={ `opponent-candidate ${isCurrentPage && 'active-opp'}` } style={{ borderTop: `3px solid ${partyInfo.color}` }}>
      <Link href={slug} scroll={ false }>
        <div className="opp-portrait-col">
          <div className="opp-portrait-container" style={{background: `linear-gradient(5deg, #eeeeee 0%, #e5e3e2 6%, ${partyInfo.color} 92%)`}}>
            <Image
              alt={ `${ballotName}` }
              src={ portraitPath }
              width={ 40 }
              height={ 40 }
              style={{ width: '100%', height: 'auto'}}
            />
          </div>
        </div>
        <div className="opp-info-col">
          <div className="opp-name">{ballotName}</div>
        </div>
      </Link>
    </div>
  )
}

const CandidateOpponents = ({candidatesInDistrict, race, currentSlug}) => {

  const order = {
    "REP": 1,
    "DEM": 2,
    "LBR": 3,
    "CTR": 4,
    "IND": 5
  }

  const activeCandidates = candidatesInDistrict.filter(c => c.status === 'active' || c.status ==='won-general' || c.status === 'lost-general')
  const inactiveCandidates = candidatesInDistrict.filter(c => c.status !== 'active' && c.status !== 'won-general' && c.status !== 'lost-general')

  activeCandidates.sort((a, b) => a.lastName - b.lastName)
  activeCandidates.sort((a, b) => order[a.party] - order[b.party])

  let prevParty
  activeCandidates.forEach(opp => {
    opp["label"] = opp.party != prevParty
    prevParty = opp.party
  })

  inactiveCandidates.sort((a, b) => a.lastName - b.lastName)
  inactiveCandidates.sort((a, b) => order[a.party] - order[b.party])

  let prevInactiveParty
  inactiveCandidates.forEach(opp => {
    opp["label"] = opp.party != prevInactiveParty
    prevInactiveParty = opp.party
  })

  return (
    <div className='opponents-container'>
      <h4 className='opponents-title'>Active Candidates for {race}</h4>
      <div className="opp-grid">
        { activeCandidates.map(c => {
          const party = PARTIES.find(p => p.key === c.party)
          const partyCount = activeCandidates.filter(opp => opp.party === party.key).length
          return <div className="opp-tile" key={c.slug}>
            {c.label && <h4 className="bucket-label" style={{color: party.color}}>{pluralize(party.noun, partyCount)}</h4>}
            <Candidate key={c.slug} isCurrentPage={c.slug === currentSlug} {...c} />
          </div>
        })}
      </div><br />
      { inactiveCandidates.length > 0 && (
        <h4 className='opponents-title'>Inactive Candidates</h4>
      )}
      <div className="opp-grid">
        { inactiveCandidates.map(c => {
          const party = PARTIES.find(p => p.key === c.party)
          const partyCount = inactiveCandidates.filter(opp => opp.party === party.key).length
          return <div className="opp-tile" key={c.slug}>
            {c.label && <h4 className="bucket-label" style={{color: party.color}}>{pluralize(party.noun, partyCount)}</h4>}
            <Candidate key={c.slug} isCurrentPage={c.slug === currentSlug} {...c} />
          </div>
        })}
      </div>
    </div>
  )
}

export default CandidateOpponents
