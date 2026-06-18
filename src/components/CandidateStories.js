import Link from 'next/link'
import { useCandidateStories } from '@/lib/dataHooks'
import { formatDate } from '@/lib/utils'
import he from 'he'

const ELECTION_COVERAGE = 'https://wyofile.com/elections-2026/'

const CandidateStories = ({ slug, ballotName, tagId }) => {
  const { stories, isLoading, error } = useCandidateStories(tagId, 25)

  return (
    <div className="cs-section">

      {error && <div className="cs-alert">Unable to load stories. Please try again later.</div>}
      {isLoading && (
        <div className="cs-loading">
          <div className="cs-pulse"></div> Fetching latest articles...
        </div>
      )}

      {(!isLoading && !error && stories) && (
        <>
          {stories.length === 0 ? (
            /* --- INTERACTIVE EMPTY STATE (With bottom-left link) --- */
            <>
              <div className="cs-empty-state">
                <div className="cs-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                    <path d="M18 14h-8"></path>
                    <path d="M15 18h-5"></path>
                    <path d="M10 6h8v4h-8V6Z"></path>
                  </svg>
                </div>
                <h4 className="cs-empty-title">No articles on record... yet.</h4>
                <p className="cs-empty-text" style={{ marginBottom: 0 }}>
                  WyoFile reporters are actively covering the 2026 elections. If <strong>{ballotName}</strong> makes the news, it will appear right here.
                </p>
              </div>

              {/* Aligning to the bottom left for the empty state */}
              <div className="cs-footer-link-wrapper cs-left-align">
                <Link className="cs-view-all" href={ELECTION_COVERAGE} target="_blank">
                  View All WyoFile Election News <span className="cs-arrow">&#8599;</span>
                </Link>
              </div>
            </>
          ) : (
            /* --- POPULATED STATE --- */
            <>
              <div className="cs-grid">
                {stories.map(story => (
                  <Link key={`story-${story.id}`} href={story.link} target="_blank" className="cs-story-card">
                    <div className="cs-story-content">
                      <h4 className="cs-story-headline">{he.decode(story.title.rendered)}</h4>
                      <time className="cs-story-date">{formatDate(new Date(story.date))}</time>
                    </div>
                    <div className="cs-story-action">
                      Read Story <span className="cs-arrow">&#8599;</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Aligning to the bottom right/standard layout for the active grid */}
              <div className="cs-footer-link-wrapper">
                <Link className="cs-view-all" href={ELECTION_COVERAGE} target="_blank">
                  View All WyoFile Election News <span className="cs-arrow">&#8599;</span>
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