

import Link from 'next/link'
import Image from 'next/image'

import { getPortraitPath } from '@/lib/utils'
import { useStories } from '@/lib/dataHooks'

const Candidate = ({ slug, ballotName, status, party, color, hasPhoto, hasResponses, isIncumbent, tagId }) => {

  const portraitPath = getPortraitPath(hasPhoto, party, slug)
  const {stories, isLoading, error} = useStories(tagId, 25)

  return (
    <div className="candidate" style={{ borderTop: `5px solid ${color}` }}>
      <Link href={`/candidates/${slug}`}>
        <div className="portrait-col" >
          <div className="portrait-container" style={{background: `linear-gradient(5deg, #eeeeee 0%, #e5e3e2 6%, ${color} 92%)`}}>
              <Image
                  alt={ballotName}
                  src={portraitPath}
                  width={100}
                  height={100}
                  style={{
                      width: '100%',
                      height: 'auto',
                  }}
              />
          </div>
          { status === 'won-general' && <div className='winner-label' style={{backgroundColor: color}}><span className='winner-checkmark'>✓ </span><span className='winner-label-text'>Winner</span></div>}
        </div>
        <div className="info-col">
          <div className="name">{ballotName}</div>
          <div className="summary-line">{isIncumbent && 'Incumbent'}</div>
          <div className="tag-line">
            { hasResponses && <div className="tag">✏️ Candidate Q&A</div> }
            { !hasResponses && <div className="tag">🚫 No Q&A response</div> }
            { isLoading && <div className='tag'>⏳</div> }
            { (!isLoading && !error && stories.length > 0) && <div className="tag">📰 <strong>{stories.length >= 25 ? '25+' : stories.length}</strong> {(stories.length === 1) ? 'article' : 'articles'}</div>}
          </div>
          <div className="fakelink">
            <span>See more »</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Candidate