import Image from "next/image";
import { css } from "@emotion/react";

import { PARTIES, STATUS } from '../lib/styles'
import { formatRace, getPortraitPath } from '../lib/utils'

const CandidatePageSummary = ({candidate}) => {

  const {party, slug, ballotName, office, isIncumbent, hasPhoto, status} = candidate
  const partyInfo = PARTIES.find(p => p.key === party)
  const statusInfo = STATUS.find(s => s.key === status)

  const portraitPath = getPortraitPath(hasPhoto, party, slug)

  return <div className="candidate-summary" style={{ borderTop: `5px solid ${partyInfo.color}` }}>

      <div className="summ-portrait-col">
          <div className="summ-portrait-container" style={{background: `linear-gradient(5deg, #eeeeee 0%, #e5e3e2 6%, ${partyInfo.color} 92%)`}}>
              <Image
                  alt={`${ballotName}`}
                  src={portraitPath}
                  width={200}
                  height={200}
              />
          </div>
      </div>
      <div className="summ-info-col">
          <div className="summ-info-container">
              <div className="summ-intro-line">
                  <div>Wyoming <strong style={{ color: partyInfo.color }}>{partyInfo.adjective}</strong> candidate</div>
                  <div> for <strong>{formatRace(office)}</strong></div>
              </div>
              <h1 className="summ-name">{ballotName}</h1>
              <div className="incum-line"><em>{isIncumbent ? "Incumbent • " : ""}</em>{ statusInfo.label }</div>
          </div>
      </div>
  </div>
}

export default CandidatePageSummary