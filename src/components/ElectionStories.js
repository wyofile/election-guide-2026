import Link from 'next/link'
import { useStories } from '@/lib/dataHooks'
import he from 'he'


import { formatDate } from '../lib/utils'

const ELECTION_COVERAGE = 'https://wyofile.com/elections-2026/'
const ELECTION_TAG_ID = '14174'
const NUM_STORIES = 6

const ElectionStories = () => {

  const {stories, isLoading, error} = useStories(ELECTION_TAG_ID, NUM_STORIES)
  // const stories = []
  // const error = null;
  // const isLoading = false;
  return (
    <div className='election-coverage'>
      <div className='election-coverage-title'>Latest Election Coverage from WyoFile</div>
      {error && <div className="load-error">Unable to Load Stories</div>}
      {isLoading && <div className="loading">Loading...</div>}
      {(!isLoading && !error && stories) && 
        <div className="election-coverage-stories home-cov-stories">
          {stories.map(story => {
            return(
              <Link key={`story-${story.id}`} href={story.link} target="_blank">
                <div className="election-coverage-story">
                  <div className="story-title">{he.decode(story.title.rendered)}</div>
                  <div className="story-date">{formatDate(new Date(story.date))}</div>
                  <div className="fake-link">Read Story <img src="external.svg"></img></div>
                </div>
              </Link>
            )
          })}
        </div>
      }
    <Link className='more-news-link' href={ELECTION_COVERAGE} target="_blank" >More election coverage on WyoFile.com <img src="external.svg"></img></Link>
    </div>
  )
}

export default ElectionStories