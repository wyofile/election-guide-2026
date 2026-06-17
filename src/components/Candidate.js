import Link from 'next/link'
import Image from 'next/image'

import { getPortraitPath } from '@/lib/utils'
import { useCandidateStories } from '@/lib/dataHooks'

const Candidate = ({ slug, ballotName, status, party, color, hasPhoto, hasResponses, isIncumbent, tagId }) => {

  const portraitPath = getPortraitPath(hasPhoto, party, slug)
  const {stories, isLoading, error} = useCandidateStories(tagId, 25)

  return (
    <Link href={`/candidates/${slug}`} className="modern-candidate-card" style={{ '--party-color': color }}>
      <div className="candidate-card-inner">
        
        {/* Avatar Column */}
        <div className="candidate-avatar-col">
          {/* FIX 2 & 3: Re-added the gradient background and changed to a rounded square */}
          <div 
            className="avatar-rounded" 
            style={{ background: `linear-gradient(5deg, #eeeeee 0%, #e5e3e2 6%, ${color} 92%)` }}
          >
            <Image
              alt={ballotName}
              src={portraitPath}
              width={84}
              height={84}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </div>
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
            
            {(!isLoading && !error && stories.length > 0) && (
              <span className="ui-badge badge-news">
                <strong>{stories.length >= 25 ? '25+' : stories.length}</strong> {stories.length === 1 ? 'Article' : 'Articles'}
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