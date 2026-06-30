import Link from 'next/link'

import PortraitImage from './PortraitImage'
import { getPortraitPath } from '@/lib/utils'
import { useCachedStories } from '@/lib/dataHooks'

const Candidate = ({ slug, ballotName, status, party, color, hasPhoto, hasResponses, isIncumbent, tagId }) => {

  const portraitPath = getPortraitPath(hasPhoto, party, slug)
  const {stories, isLoading, error} = useCachedStories(slug)

  return (
    <Link href={`/candidates/${slug}`} className="modern-candidate-card" style={{ '--party-color': color }}>
      <div className="candidate-card-inner">
        
        {/* Avatar Column */}
        <div className="candidate-avatar-col">
          {/* FIX 2 & 3: Re-added the gradient background and changed to a rounded square */}
          <PortraitImage
            alt={ballotName}
            src={portraitPath}
            width={84}
            height={84}
            className="avatar-rounded"
            style={{ background: `linear-gradient(5deg, #eeeeee 0%, #e5e3e2 6%, ${color} 92%)` }}
          />
          {status === 'won-general' && (
            <div className="winner-badge" style={{ backgroundColor: color }}>
              <span className="winner-icon">✓</span> Winner
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="candidate-info-col">
          <div className="candidate-header">
            <h4 className="candidate-name">{ballotName}</h4>
            {isIncumbent && <span className="incumbent-pill">Incumbent</span>}
          </div>
          
          <div className="candidate-badges">
            {hasResponses ? (
              <span className="ui-badge badge-success">Q&A Response</span>
            ) : (
              <span className="ui-badge badge-neutral">No Q&A</span>
            )}
            
            {(!isLoading && !error && stories.count > 0) && (
              <span className="ui-badge badge-news">
                {`${stories.count >= 12 ? '12+' : stories.count} ${stories.count === 1 ? 'Article' : 'Articles'}`}
              </span>
            )}
          </div>

          <div className="candidate-action">
            View Profile <span className="action-arrow">&rarr;</span>
          </div>
        </div>

      </div>
    </Link>
  )
}

export default Candidate