import { useState } from 'react'
import Link from 'next/link'

const PAGE_LINKS = [
  { path: '/', label: 'All Races' },
  { path: '/#federal-delegation', label: 'Federal Races' },
  { path: '/#statewide', label: 'Statewide Races' },
  { path: '/#legislature', label: 'Legislative Races' },
  { path: '/#voter-faq', label: 'Voting Info' }
]

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="nav-container">
      {/* Mobile Header Bar */}
      <div className="nav-mobile-bar">
        <span className="nav-brand">Menu</span> 
        <button 
          className={`nav-toggle ${isOpen ? 'is-active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Adaptable Menu Link List */}
      <ul className={`nav-menu ${isOpen ? 'is-open' : ''}`}>
        {PAGE_LINKS.map((link) => (
          <li key={link.path} className="nav-item">
            <Link 
              href={link.path} 
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav