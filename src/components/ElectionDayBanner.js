import { useEffect, useState } from 'react'

// TODO: swap in the real live-results link once WyoFile has one.
const ELECTION_RESULTS_URL = '#'

const ELECTION_DAY_MT = '2026-08-18'
const DISMISS_KEY = 'wf-election-day-banner-dismissed'
const CLOSE_ANIMATION_MS = 350
const HIDE = true

// Wyoming polls run on Mountain Time — check the date there specifically,
// not the visitor's own local date, so it doesn't show up a day early/late
// for readers (or previewers) in a different timezone.
const getMountainDateString = () => (
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
)

const ElectionDayBanner = () => {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (getMountainDateString() !== ELECTION_DAY_MT) {
      return
    }
    if (HIDE) {
      return
    }
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY)) {
        return
      }
    } catch (err) {
      // sessionStorage unavailable — just show it, no persistence
    }
    setVisible(true)
  }, [])

  const dismiss = () => {
    setClosing(true)
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1')
    } catch (err) {
      // ignore
    }
    // Wait for the slide-down animation to finish before unmounting.
    setTimeout(() => setVisible(false), CLOSE_ANIMATION_MS)
  }

  if (!visible) {
    return null
  }

  return (
    <div className={`election-day-banner${closing ? ' election-day-banner--closing' : ''}`}>
      <a href={ELECTION_RESULTS_URL} className="election-day-banner__link">
        🗳️ Today is Primary Election Day — click here for live results on WyoFile →
      </a>
      <button type="button" className="election-day-banner__close" onClick={dismiss} aria-label="Dismiss">
        &times;
      </button>
    </div>
  )
}

export default ElectionDayBanner
