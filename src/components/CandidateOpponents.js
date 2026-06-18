import { PARTIES } from '@/lib/styles'
import { pluralize, getPortraitPath } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

const Candidate = ({ slug, ballotName, party, hasPhoto, isCurrentPage }) => {
  const partyInfo = PARTIES.find(d => d.key === party)
  const portraitPath = getPortraitPath(hasPhoto, party, slug)

  return (
    <div className={`modern-opp-row ${isCurrentPage ? 'active-opp' : ''}`} style={{ '--party-color': partyInfo.color }}>
      <Link href={slug} scroll={false} className="modern-opp-link">
        <div className="modern-opp-avatar-frame" style={{ background: `linear-gradient(5deg, #eeeeee 0%, #e5e3e2 6%, ${partyInfo.color} 92%)` }}>
          <Image
            alt={ballotName}
            src={portraitPath}
            width={36}
            height={36}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>
        <span className="modern-opp-name">{ballotName}</span>
        {isCurrentPage && <span className="current-label-badge">Viewing</span>}
      </Link>
    </div>
  )
}

const CandidateOpponents = ({ candidatesInDistrict, race, currentSlug }) => {
  const order = { "REP": 1, "DEM": 2, "LBR": 3, "CTR": 4, "IND": 5 }

  const processGridGroup = (list) => {
    const sorted = [...list]
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
      .sort((a, b) => order[a.party] - order[b.party])
    
    let prevParty
    return sorted.map(c => {
      const showLabel = c.party !== prevParty
      prevParty = c.party
      return { ...c, showLabel }
    })
  }

  const activeCandidates = processGridGroup(candidatesInDistrict.filter(c => ['active', 'won-general', 'lost-general'].includes(c.status)))
  const inactiveCandidates = processGridGroup(candidatesInDistrict.filter(c => !['active', 'won-general', 'lost-general'].includes(c.status)))

  // Helper function to render grid items sequentially to fix mobile spacing
  const renderGrid = (candidates) => {
    return candidates.map(c => {
      const party = PARTIES.find(p => p.key === c.party)
      const partyCount = candidates.filter(opp => opp.party === c.party).length
      const nodes = []

      // If it's the first candidate of a party, insert the heading element first
      if (c.showLabel) {
        nodes.push(
          <h4 key={`header-${c.party}`} className="modern-bucket-heading" style={{ color: party.color }}>
            {pluralize(party.noun, partyCount)}
          </h4>
        )
      }

      // Then insert the candidate card
      nodes.push(<Candidate key={c.slug} isCurrentPage={c.slug === currentSlug} {...c} />)
      return nodes
    })
  }

  return (
    <div className="modern-opponents-section">
      <h3 className="opponents-meta-title">ACTIVE CANDIDATES FOR <span className="race-text-highlight">{race}</span></h3>
      
      <div className="opponents-flex-stack">
        {renderGrid(activeCandidates)}
      </div>

      {inactiveCandidates.length > 0 && (
        <div className="inactive-wrapper-zone">
          <h4 className="opponents-meta-title inactive-title">Inactive Candidates</h4>
          <div className="opponents-flex-stack">
            {renderGrid(inactiveCandidates)}
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateOpponents