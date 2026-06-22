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
                  View All WyoFile Election News <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="12" height="12" viewBox="0 0 48 48"><path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z"></path></svg>
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
                      Read Story <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="12" height="12" viewBox="0 0 48 48"><path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z"></path></svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Aligning to the bottom right/standard layout for the active grid */}
              <div className="cs-footer-link-wrapper">
                <Link className="cs-view-all" href={ELECTION_COVERAGE} target="_blank">
                  View All WyoFile Election News <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="12" height="12" viewBox="0 0 48 48"><path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z"></path></svg>
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