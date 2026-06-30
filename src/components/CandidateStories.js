import { useState } from 'react'
import Link from 'next/link'
import { useCachedStories } from '@/lib/dataHooks'
import { formatDate } from '@/lib/utils'
import he from 'he'

export const ELECTION_COVERAGE = 'https://wyofile.com/elections-2026/'

export const ExternalArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z" />
  </svg>
)

const CandidateStories = ({ slug, ballotName }) => {
  const { stories, isLoading, error } = useCachedStories(slug)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="cs-section">

      {error && (
        <div className="stories-alert">Unable to load stories. Please try again later.</div>
      )}

      {isLoading && (
        <div className="stories-loading">
          <span className="stories-pulse" />
          Fetching latest articles…
        </div>
      )}

      {(!isLoading && !error && stories) && (
        <>
          {stories.count === 0 ? (

            /* Empty state */
            <div className="cs-empty-state">
              <p className="cs-empty-text">
                No articles on record yet. WyoFile reporters are actively covering the 2026 elections. If <strong>{ballotName}</strong> makes the news, it will appear right here.
              </p>
              <Link className="stories-all-link" href={ELECTION_COVERAGE} target="_blank" rel="noopener noreferrer">
                View all WyoFile election news <ExternalArrow />
              </Link>
            </div>

          ) : (

            /* Story grid — reuses shared story-card styles from election-coverage.css */
            <>
              <div className={`stories-grid ${expanded ? 'is-expanded' : ''}`}>
                {stories.stories.map(story => (
                  <Link
                    key={`story-${story.id}`}
                    href={story.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="story-card"
                  >
                    {story.jetpack_featured_media_url && (
                      <img
                        src={story.jetpack_featured_media_url}
                        alt=""
                        className="story-card-img"
                        loading="lazy"
                      />
                    )}
                    <article>
                      <time className="story-date">{formatDate(new Date(story.date))}</time>
                      <h3 className="story-headline">{he.decode(story.title.rendered)}</h3>
                      <span className="story-read-link">
                        Read Story <ExternalArrow />
                      </span>
                    </article>
                  </Link>
                ))}
              </div>

              {!expanded && stories.count > 3 && (
                <button
                  type="button"
                  className="stories-load-more"
                  onClick={() => setExpanded(true)}
                >
                  Load more stories…
                </button>
              )}

              <div className="stories-footer">
                <Link className="stories-all-link" href={ELECTION_COVERAGE} target="_blank" rel="noopener noreferrer">
                  View all WyoFile election news <ExternalArrow />
                </Link>
              </div>
            </>

          )}
        </>
      )}

    </div>
  )
}

export default CandidateStories
