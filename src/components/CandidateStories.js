import Link from 'next/link'
import { useStories } from '@/lib/dataHooks'
import { formatDate } from '@/lib/utils'
import he from 'he'

const ELECTION_COVERAGE = 'https://wyofile.com/elections-2026/'

const CandidateStories = ({slug, ballotName, tagId}) => {
  const {stories, isLoading, error} = useStories(tagId, 25)
  return(
    <div className='election-coverage-candidate'>
    {error && <div className="load-error">Unable to Load Stories</div>}
    {isLoading && <div className="loading">Loading...</div>}
    {stories && 
      <>
        {stories.length === 0 && <p>Currently no WyoFile stories on {ballotName}.</p>}
        <div className="election-coverage-stories">
          {!isLoading && stories.map(story => {
            return(
              <Link key={`story-${story.id}`} href={story.link} target="_blank">
                <div className="election-coverage-story" style={{border: '1px solid #666'}}>
                  <div className="story-title">{he.decode(story.title.rendered)}</div>
                  <div className="story-date">{formatDate(new Date(story.date))}</div>
                  <div className="fake-link">Read Story <img src="/election-guide-2026/external.svg"></img></div>
                </div>
              </Link>
            )
          })}
        </div>
      </>
    }
    <Link className='more-news-link' href={ELECTION_COVERAGE} target="_blank" >More election coverage on WyoFile.com <img src="/election-guide-2026/external.svg"></img></Link>
    </div>
  )
}

export default CandidateStories