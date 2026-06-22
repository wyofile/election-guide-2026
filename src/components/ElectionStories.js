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
                    Read Story <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="12" height="12" viewBox="0 0 48 48"><path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z"></path></svg>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      }

      <div className="modern-coverage-footer">
        <Link className="modern-more-link" href={ELECTION_COVERAGE} target="_blank">
          View all election coverage on WyoFile.com <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="12" height="12" viewBox="0 0 48 48"><path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z"></path></svg>
        </Link>
      </div>
    </div>
  )
}

export default ElectionStories