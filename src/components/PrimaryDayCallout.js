import { useEffect, useState } from 'react'

const LIVE_BLOG_URL = 'https://wyofile.com/wyoming-primary-election-live-updates/'
const RESULTS_URL = 'https://wyofile.com/live-results-from-wyomings-2026-primary-elections/'

// Wyoming polls run on Mountain Time (MDT, UTC-6 in August). These are
// absolute instants, so comparing against `new Date()` is unaffected by the
// reader's (or a previewer's) own local timezone.
const LIVE_BLOG_START = new Date('2026-08-18T00:00:00-06:00') // primary day begins
const RESULTS_LIVE_START = new Date('2026-08-18T19:00:00-06:00') // 7 p.m. MT, polls close
const RESULTS_FINAL_START = new Date('2026-08-19T09:00:00-06:00') // 9 a.m. MT the next morning — vote counting has wound down overnight

// null (not primary day yet) | 'live-blog' (before 7pm MT on primary day) |
// 'results-live' (7pm MT election night through 9am MT the next morning —
// votes are actively coming in) | 'results-final' (9am MT the next day
// onward — stays in this phase forever after, since the results link stays
// useful, but it's no longer accurate to call them "live")
const getPhase = () => {
  const now = new Date()
  if (now < LIVE_BLOG_START) {
    return null
  }
  if (now < RESULTS_LIVE_START) {
    return 'live-blog'
  }
  if (now < RESULTS_FINAL_START) {
    return 'results-live'
  }
  return 'results-final'
}

const PrimaryDayCallout = () => {
  const [phase, setPhase] = useState(null)

  useEffect(() => {
    setPhase(getPhase())
  }, [])

  if (!phase) {
    return null
  }

  const isLiveBlog = phase === 'live-blog'
  const showLiveTag = phase === 'live-blog' || phase === 'results-live'

  return (
    <section className="primary-day-callout">
      <a
        href={isLiveBlog ? LIVE_BLOG_URL : RESULTS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="primary-day-callout__link"
      >
        {showLiveTag && (
          <span className="primary-day-callout__tag">
            <span className="live-dot" aria-hidden="true"></span>
            Live
          </span>
        )}
        {/* Headline is phase-specific, not just the CTA — "It's Election Day"
            would be wrong the moment the calendar flips to the 19th, so the
            results-phase copy is written to stay true on any later day too,
            not just election night. */}
        <span className="primary-day-callout__headline">
          {isLiveBlog ? 'It’s Wyoming’s Primary Election Day' : 'Wyoming’s 2026 Primary Election Results'}
        </span>
        {/* A non-breaking space before the arrow glues it to the last word,
            so it can never end up wrapped alone onto its own line. */}
        <span className="primary-day-callout__cta">
          {isLiveBlog ? 'Read live blog coverage from WyoFile' : 'See results from WyoFile'}
          {' →'}
        </span>
        {isLiveBlog && (
          <span className="primary-day-callout__note">Check back after 7 p.m. MT for live election results.</span>
        )}
      </a>
    </section>
  )
}

export default PrimaryDayCallout
