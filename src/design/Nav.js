import { useState, useEffect, useRef, Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDistrict } from '@/lib/DistrictContext'

const PAGE_LINKS = [
  {
    id: 'federal-delegation', label: 'Federal', path: '/#federal-delegation',
    children: [
      { id: 'us-senate', label: 'U.S. Senate', path: '/#us-senate' },
      { id: 'us-house', label: 'U.S. House', path: '/#us-house' },
    ]
  },
  {
    id: 'statewide', label: 'Statewide', path: '/#statewide',
    children: [
      { id: 'governor', label: 'Governor', path: '/#governor' },
      { id: 'sec-of-state', label: 'Sec. of State', path: '/#sec-of-state' },
      { id: 'superintendent', label: 'Superintendent', path: '/#superintendent' },
      { id: 'treasurer', label: 'Treasurer', path: '/#treasurer' },
      { id: 'auditor', label: 'Auditor', path: '/#auditor' },
    ]
  },
  { id: 'legislature', label: 'Legislature', path: '/#legislature' },
  { id: 'voter-faq', label: 'Voting Info', path: '/#voter-faq' }
]

const RACE_ABBREVS = { superintendent: 'Supt.' }

const ALL_ANCHORS = PAGE_LINKS.flatMap(link => [
  { id: link.id, section: link.id, label: link.label, raceLabel: null },
  ...(link.children || []).map(child => ({
    id: child.id, section: link.id, label: link.label,
    raceLabel: RACE_ABBREVS[child.id] || child.label
  }))
])

const Nav = ({ candidateName }) => {
  const router = useRouter()
  const { chamber, activeHouseDistrict, activeSenateDistrict } = useDistrict()
  const [activeSection, setActiveSection] = useState('top')
  const [activeAnchor, setActiveAnchor] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)
  const navRef = useRef(null)
  const mobileRef = useRef(null)
  const triggerRef = useRef(null)

  const toggleSection = (id) => setExpandedSection(prev => prev === id ? null : id)

  const isHomePage = router.pathname === '/'
  const isCandidatePage = router.pathname.startsWith('/candidates')

  // Precise Scroll Tracker (unchanged)
  useEffect(() => {
    if (!isHomePage) {
      setActiveSection('')
      setActiveAnchor(null)
      return
    }

    const handleScroll = () => {
      const triggerLine = 250
      let currentSection = 'top'
      let currentAnchor = null

      for (const anchor of ALL_ANCHORS) {
        const element = document.getElementById(anchor.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= triggerLine) {
            currentSection = anchor.section
            currentAnchor = anchor
          }
        }
      }

      setActiveSection(currentSection)
      setActiveAnchor(currentAnchor)
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

  // Reset accordion when dropdown closes
  useEffect(() => {
    if (!isOpen) setExpandedSection(null)
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

  const activeDistrict = chamber === 'house' ? activeHouseDistrict : activeSenateDistrict
  const activeDistrictLabel = activeDistrict
    ? `${chamber === 'house' ? 'HD' : 'SD'} ${parseInt(activeDistrict.substring(1))}`
    : null

  const currentLabel = isCandidatePage
    ? (candidateName || 'Candidate')
    : activeSection === 'legislature' && activeDistrictLabel
      ? `Legislature: ${activeDistrictLabel}`
      : activeAnchor?.raceLabel
        ? `${activeAnchor.label}: ${activeAnchor.raceLabel}`
        : (activeAnchor?.label ?? mobileItems[0].label)

  return (
    <nav className="smart-nav-container" ref={navRef}>
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
            onClick={() => {
              if (!isOpen) {
                const inSection = PAGE_LINKS.find(l => l.id === activeSection && l.children)
                if (inSection) setExpandedSection(activeSection)
                if (navRef.current) {
                  const eyebrowHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--eyebrow-height')) || 56
                  const navTop = window.scrollY + navRef.current.getBoundingClientRect().top - eyebrowHeight
                  window.scrollTo({ top: Math.max(0, navTop), behavior: 'smooth' })
                }
              }
              setIsOpen(o => !o)
            }}
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
              const isExpanded = expandedSection === link.id
              return (
                <Fragment key={link.id}>
                  <li className="smart-nav-panel-item" role="none">
                    {link.children ? (
                      <button
                        className={`smart-nav-panel-link smart-nav-panel-parent ${active ? 'is-active' : ''}`}
                        aria-expanded={isExpanded}
                        onClick={() => toggleSection(link.id)}
                      >
                        <span>{link.label}</span>
                        <svg
                          className={`smart-nav-chevron ${isExpanded ? 'is-expanded' : ''}`}
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          aria-hidden="true"
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={link.path}
                        role="menuitem"
                        aria-current={active ? 'true' : undefined}
                        className={`smart-nav-panel-link ${active ? 'is-active' : ''}`}
                        onClick={(e) => handleMobileSelect(e, link)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                  {isExpanded && (
                    <>
                      <li className="smart-nav-panel-item" role="none">
                        <Link
                          href={link.path}
                          role="menuitem"
                          className="smart-nav-panel-link smart-nav-panel-sublink smart-nav-panel-sublink--all"
                          onClick={(e) => handleMobileSelect(e, link)}
                        >
                          ↑ All {link.label}
                        </Link>
                      </li>
                      {link.children.map(child => {
                        const childActive = child.id === activeAnchor?.id
                        return (
                          <li key={child.id} className="smart-nav-panel-item" role="none">
                            <Link
                              href={child.path}
                              role="menuitem"
                              aria-current={childActive ? 'true' : undefined}
                              className={`smart-nav-panel-link smart-nav-panel-sublink ${childActive ? 'is-active' : ''}`}
                              onClick={(e) => handleMobileSelect(e, child)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        )
                      })}
                    </>
                  )}
                </Fragment>
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
              <span className="smart-nav-link is-active">{candidateName || 'Candidate'}</span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Nav