import { useEffect, useState } from 'react'

const PRIMARY_DAY_MT = '2026-08-18'
const RESULTS_HOUR_MT = 19 // 7 p.m.

const LIVE_BLOG_URL = 'https://wyofile.com/wyoming-primary-election-live-updates/'
const RESULTS_URL = 'https://wyofile.com/live-results-from-wyomings-2026-primary-elections/'

// Wyoming polls run on Mountain Time — check the date/hour there specifically,
// not the visitor's own local time, so the phase switches at the right moment
// regardless of where the reader (or a previewer) actually is.
const getMountainNow = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Denver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type) => parts.find((p) => p.type === type)?.value
  return { date: `${get('year')}-${get('month')}-${get('day')}`, hour: parseInt(get('hour'), 10) }
}

// null (not primary day yet) | 'live-blog' (before 7pm MT on primary day) |
// 'results' (7pm MT on primary day onward — stays in this phase forever
// after, not just election night, since the results link stays useful)
const getPhase = () => {
  const { date, hour } = getMountainNow()
  if (date < PRIMARY_DAY_MT) {
    return null
  }
  if (date === PRIMARY_DAY_MT && hour < RESULTS_HOUR_MT) {
    return 'live-blog'
  }
  return 'results'
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

  return (
    <section className="primary-day-callout">
      <a
        href={isLiveBlog ? LIVE_BLOG_URL : RESULTS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="primary-day-callout__link"
      >
        <span className="primary-day-callout__tag">
          <span className="live-dot" aria-hidden="true"></span>
          Live
        </span>
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
