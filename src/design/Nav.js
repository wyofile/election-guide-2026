import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const PAGE_LINKS = [
  { id: 'federal-delegation', label: 'Federal', path: '/#federal-delegation' },
  { id: 'statewide', label: 'Statewide', path: '/#statewide' },
  { id: 'legislature', label: 'Legislature', path: '/#legislature' },
  { id: 'voter-faq', label: 'Voting Info', path: '/#voter-faq' }
]

const Nav = () => {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('top')
  const [isOpen, setIsOpen] = useState(false)
  const mobileRef = useRef(null)
  const triggerRef = useRef(null)

  const isHomePage = router.pathname === '/'
  const isCandidatePage = router.pathname.startsWith('/candidates')

  // Precise Scroll Tracker (unchanged)
  useEffect(() => {
    if (!isHomePage) {
      setActiveSection('')
      return
    }

    const handleScroll = () => {
      const triggerLine = 250
      let current = 'top'

      for (const link of PAGE_LINKS) {
        if (link.id === 'top') continue
        const element = document.getElementById(link.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= triggerLine) {
            current = link.id
          }
        }
      }

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  // Close dropdown on outside click / Escape
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  // Close dropdown after navigating to a new page
  useEffect(() => {
    setIsOpen(false)
  }, [router.asPath])

  // Smart Scroll / Routing Handler (unchanged)
  const handleNavClick = (e, link) => {
    if (isHomePage) {
      e.preventDefault()

      if (link.id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const element = document.getElementById(link.id)
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  const handleMobileSelect = (e, link) => {
    handleNavClick(e, link)
    setIsOpen(false)
  }

  // Build the dropdown's option list + its current label from the same state
  const mobileItems = isHomePage
    ? [{ id: 'top', label: '↑ Top', path: '/' }, ...PAGE_LINKS]
    : [{ id: 'home', label: 'Home', path: '/' }, ...PAGE_LINKS]

  const activeMobileId = isHomePage ? (activeSection || 'top') : null

  const currentLabel = isCandidatePage
    ? 'Candidate'
    : (mobileItems.find((i) => i.id === activeMobileId)?.label ?? mobileItems[0].label)

  return (
    <nav className="smart-nav-container">
      <div className="smart-nav-wrapper">

        {/* ===== MOBILE: dropdown ===== */}
        <div ref={mobileRef} className={`smart-nav-mobile ${isOpen ? 'is-open' : ''}`}>
          <button
            ref={triggerRef}
            type="button"
            className="smart-nav-trigger"
            aria-haspopup="true"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((o) => !o)}
          >
            <span className="smart-nav-trigger-left">
              <svg className="smart-nav-hamburger-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {isOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
              </svg>
              <span className="smart-nav-menu-label">{isOpen ? 'Close' : 'Menu'}</span>
            </span>
            <span className="smart-nav-section-indicator">{currentLabel}</span>
          </button>

          <ul className="smart-nav-panel" role="menu">
            {mobileItems.map((link) => {
              const active = link.id === activeMobileId
              return (
                <li key={link.id} className="smart-nav-panel-item" role="none">
                  <Link
                    href={link.path}
                    role="menuitem"
                    aria-current={active ? 'true' : undefined}
                    className={`smart-nav-panel-link ${active ? 'is-active' : ''}`}
                    onClick={(e) => handleMobileSelect(e, link)}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ===== DESKTOP: horizontal bar (unchanged) ===== */}
        <ul className="smart-nav-menu">
          {isHomePage ? (
            <li key="top" className="smart-nav-item">
              <Link
                href="/"
                className={`smart-nav-link ${activeSection === 'top' ? 'is-active' : ''}`}
                onClick={(e) => handleNavClick(e, { id: 'top', label: '↑ Top', path: '/' })}
              >
                ↑ Top
              </Link>
            </li>
          ) : (
            <li className="smart-nav-item">
              <Link href="/" className="smart-nav-link">
                Home
              </Link>
            </li>
          )}
          {PAGE_LINKS.map((link) => {
            const isActive = isHomePage && activeSection === link.id
            return (
              <li key={link.id} className="smart-nav-item">
                <Link
                  href={link.path}
                  className={`smart-nav-link ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}

          {isCandidatePage && (
            <li className="smart-nav-item candidate-nav-indicator">
              <span className="smart-nav-link is-active">Candidate</span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Nav