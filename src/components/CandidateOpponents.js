import { PARTIES } from '@/lib/styles'
import { pluralize, getPortraitPath } from '@/lib/utils'
import Link from 'next/link'
import PortraitImage from './PortraitImage'

const CandidateChip = ({ slug, ballotName, party, hasPhoto, isCurrentPage }) => {
  const partyInfo = PARTIES.find(d => d.key === party)
  const portraitPath = getPortraitPath(hasPhoto, party, slug)

  return (
    <div className={`opp-chip-row ${isCurrentPage ? 'opp-chip-active' : ''}`} style={{ '--party-color': partyInfo.color }}>
      <Link href={slug} scroll={false} className="opp-chip">
        <PortraitImage
          alt={ballotName}
          src={portraitPath}
          width={28}
          height={28}
          className="opp-chip-avatar"
          style={{ background: `linear-gradient(5deg, #eeeeee 0%, #e5e3e2 6%, ${partyInfo.color} 92%)` }}
        />
        <span className="opp-chip-name">{ballotName}</span>
        {isCurrentPage && <span className="opp-chip-viewing">Viewing</span>}
      </Link>
    </div>
  )
}

const CandidateOpponents = ({ candidatesInDistrict, race, currentSlug }) => {
  const order = { REP: 1, DEM: 2, LBR: 3, CTR: 4, IND: 5 }

  const sortCandidates = (list) =>
    [...list]
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
      .sort((a, b) => order[a.party] - order[b.party])

  const activeCandidates   = sortCandidates(candidatesInDistrict.filter(c => ['active','won-general','lost-general'].includes(c.status)))
  const inactiveCandidates = sortCandidates(candidatesInDistrict.filter(c => !['active','won-general','lost-general'].includes(c.status)))

  const renderPartyGroups = (list) => {
    const groups = {}
    list.forEach(c => {
      if (!groups[c.party]) groups[c.party] = []
      groups[c.party].push(c)
    })
    return Object.entries(groups).map(([partyKey, members]) => {
      const partyInfo = PARTIES.find(p => p.key === partyKey)
      return (
        <div key={partyKey} className="opp-party-group">
          <h4 className="opp-party-label" style={{ color: partyInfo.color }}>
            {pluralize(partyInfo.noun, members.length)}
          </h4>
          <div className="opp-chip-grid">
            {members.map(c => (
              <CandidateChip key={c.slug} isCurrentPage={c.slug === currentSlug} {...c} />
            ))}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="opp-section">
      <p className="opp-meta-title">
        Active candidates for <span className="opp-race-name">{race}</span>
      </p>

      {renderPartyGroups(activeCandidates)}

      {inactiveCandidates.length > 0 && (
        <div className="opp-inactive-zone">
          <p className="opp-meta-title">Inactive candidates</p>
          {renderPartyGroups(inactiveCandidates)}
        </div>
      )}
    </div>
  )
}

export default CandidateOpponents
