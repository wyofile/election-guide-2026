

import Link from 'next/link'
import Image from 'next/image'

import { getPortraitPath } from '@/lib/utils'
import { useCandidateStories } from '@/lib/dataHooks'

const CandidateCard = ({ slug, ballotName, party, color, hasPhoto, hasResponses, isIncumbent, tagId }) => {

  const portraitPath = getPortraitPath(hasPhoto, party, slug)
  const {stories, isLoading, error} = useCandidateStories(tagId, 25)

  return (
    <div className="candidate" style={{ borderTop: `5px solid ${color}` }}>
      <Link href={`/candidates/${slug}`}>
        <div className="portrait-col" >
          <div className="portrait-container">
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

export default CandidateCard