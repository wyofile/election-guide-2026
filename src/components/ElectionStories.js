import Link from 'next/link'
import { useElectionStories } from '@/lib/dataHooks'
import he from 'he'
import { formatDate } from '../lib/utils'

const ELECTION_COVERAGE = 'https://wyofile.com/elections-2026/'
const ELECTION_CATEGORY_ID = '14113'
const NUM_STORIES = 6

const ElectionStories = () => {
  const {stories, isLoading, error} = useElectionStories(ELECTION_CATEGORY_ID, NUM_STORIES)

  return (
    <div className="modern-coverage-wrapper">
      <div className="modern-coverage-header">
        <h2 className="modern-coverage-title">Latest Election Coverage from WyoFile</h2>
      </div>

      {error && <div className="modern-coverage-alert">Unable to load stories. Please try again later.</div>}
      {isLoading && (
        <div className="modern-coverage-loading">
          <div className="pulse-dot"></div> Loading latest coverage...
        </div>
      )}

      {(!isLoading && !error && stories) && 
        <div className="modern-coverage-grid home-cov-stories">
          {stories.map(story => {
            return (
              <Link key={`story-${story.id}`} href={story.link} target="_blank" className="modern-story-link">
                <article className="modern-story-card">
                  <div className="story-content">
                    <h3 className="modern-story-title">{he.decode(story.title.rendered)}</h3>
                    <time className="modern-story-date">{formatDate(new Date(story.date))}</time>
                  </div>
                  <div className="modern-story-action">
                    Read Story <span className="external-arrow">&#8599;</span>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      }

      <div className="modern-coverage-footer">
        <Link className="modern-more-link" href={ELECTION_COVERAGE} target="_blank">
          View all election coverage on WyoFile.com <span className="external-arrow">&#8599;</span>
        </Link>
      </div>
    </div>
  )
}

export default ElectionStories