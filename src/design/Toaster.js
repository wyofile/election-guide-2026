import { useEffect, useState } from 'react'
import DonateButton from './DonateButton'

// Flip to true to turn the popup back on.
const ENABLED = false

const DISMISS_KEY = 'wf-toaster-dismissed-at'
const SESSION_START_KEY = 'wf-toaster-session-start'
const SESSION_SHOWN_KEY = 'wf-toaster-shown'
const DELAY_MS = 10 * 1000
const SUPPRESS_MS = 7 * 24 * 60 * 60 * 1000

// Fires once per browser tab session, 90s of cumulative time into the visit
// (not per-page — the clock is shared via sessionStorage across navigations).
// Dismissing suppresses it via localStorage for a week. Despite the name/keys,
// this now renders as a centered overlay rather than a corner toast.
const Toaster = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ENABLED) {
      return
    }
    let dismissedAt
    try {
      dismissedAt = parseInt(window.localStorage.getItem(DISMISS_KEY), 10)
    } catch (err) {
      return
    }
    if (dismissedAt && Date.now() - dismissedAt < SUPPRESS_MS) {
      return
    }

    let session
    try {
      session = window.sessionStorage
      if (session.getItem(SESSION_SHOWN_KEY)) {
        return
      }
    } catch (err) {
      return
    }

    let sessionStart = parseInt(session.getItem(SESSION_START_KEY), 10)
    if (!sessionStart) {
      sessionStart = Date.now()
      session.setItem(SESSION_START_KEY, String(sessionStart))
    }

    const remaining = Math.max(DELAY_MS - (Date.now() - sessionStart), 0)
    const timer = setTimeout(() => {
      session.setItem(SESSION_SHOWN_KEY, '1')
      setVisible(true)
    }, remaining)

    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch (err) {
      // localStorage unavailable — dismissal just won't persist across visits
    }
  }

  useEffect(() => {
    if (!visible) {
      return
    }
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        dismiss()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible])

  if (!visible) {
    return null
  }

  return (
    <div className="toaster-backdrop" onClick={dismiss}>
      <div
        className="toaster"
        role="dialog"
        aria-modal="true"
        aria-label="Support WyoFile"
        onClick={event => event.stopPropagation()}
      >
        <button type="button" className="toaster__close" onClick={dismiss} aria-label="Dismiss">
          &times;
        </button>
        <p className="toaster__wordmark">WyoFile</p>
        <p className="toaster__heading">Support independent journalism</p>
        <p className="toaster__body">
          WyoFile&rsquo;s election coverage is free for everyone to read &mdash; but it isn&rsquo;t free to produce.
        </p>
        <DonateButton variant="toaster" onClick={dismiss} />
      </div>
    </div>
  )
}

export default Toaster
