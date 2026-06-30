import PortraitImage from './PortraitImage'
import { PARTIES, STATUS } from '../lib/styles'
import { formatRace, getPortraitPath } from '../lib/utils'

const CandidatePageSummary = ({ candidate }) => {
  const { party, slug, ballotName, office, isIncumbent, hasPhoto, status } = candidate
  const partyInfo = PARTIES.find(p => p.key === party)
  const statusInfo = STATUS.find(s => s.key === status)
  const portraitPath = getPortraitPath(hasPhoto, party, slug)

  return (
    <header className="page-header-summary">
      <div className="header-summary-grid">
        
        {/* Native Page Portrait */}
        <div className="header-portrait-zone">
          <PortraitImage
            alt={ballotName}
            src={portraitPath}
            width={180}
            height={180}
            priority
            className="header-portrait-frame"
            style={{
              background: `linear-gradient(5deg, #eeeeee 0%, #e5e3e2 6%, ${partyInfo.color} 92%)`,
              borderColor: partyInfo.color
            }}
          />
        </div>

        {/* Editorial Typography Zone */}
        <div className="header-meta-zone">
          <div className="header-breadcrumbs">
            Wyoming <span className="party-accent-text" style={{ color: partyInfo.color }}>{partyInfo.adjective}</span> Candidate 
            <span className="breadcrumb-divider">/</span> <strong>{formatRace(office)}</strong>
          </div>
          
          <h1 className="header-name">{ballotName}</h1>
          
          <div className="header-status-row">
            {isIncumbent && <span className="header-status-pill incumbent">Incumbent</span>}
            <span className="header-status-pill state-status">
              <span className="status-label">Candidate Status:</span> {statusInfo.label}
            </span>
          </div>
        </div>

      </div>
    </header>
  )
}

export default CandidatePageSummary