import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCandidateStories } from "@/lib/dataHooks"
import { PARTIES, STATUS } from "@/lib/styles"
import { formatRace, getPortraitPath } from "@/lib/utils"

const PLACEHOLDER = 'Enter candidate name...'

// THE REDESIGNED COMPACT LIST ITEM
const Candidate = ({ slug, ballotName, party, status, isIncumbent, hasResponses, office, tagId, hasPhoto }) => {
  const partyInfo = PARTIES.find(d => d.key === party)
  const statusInfo = STATUS.find(d => d.key === status)
  const portraitPath = getPortraitPath(hasPhoto, party, slug)

  return (
    <Link href={`/candidates/${slug}`} className="search-result-row">
      <div className="search-result-inner" style={{ borderLeftColor: partyInfo.color }}>
        
        {/* Tiny Avatar */}
        <div className="search-avatar-tiny" style={{ background: `linear-gradient(5deg, #eeeeee 0%, #e5e3e2 6%, ${partyInfo.color} 92%)` }}>
          <Image
            alt={ballotName}
            src={portraitPath}
            width={40}
            height={40}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>

        {/* Compact Info Row */}
        <div className="search-info-compact">
          <div className="search-primary-info">
            <span className="search-name-compact">{ballotName}</span>
            <span className="search-party-compact" style={{ color: partyInfo.color }}>({partyInfo.noun})</span>
          </div>
          <div className="search-secondary-info">
            {formatRace(office)} {isIncumbent && <span className="incumbent-dot">• Incumbent</span>}
          </div>
        </div>

        {/* Minimal Badges on the far right */}
        <div className="search-badges-compact">
          {hasResponses ? (
            <span className="tiny-badge text-success">✓ Q&A</span>
          ) : (
            <span className="tiny-badge text-neutral">No Q&A</span>
          )}
        </div>
      </div>
    </Link>
  )
}

const CandidateSearch = ({ candidates }) => {
  const [searchText, setSearchText] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const wrapperRef = useRef(null)

  // HANDLE CLICKING OUTSIDE TO CLOSE
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  const matchingCandidates = (searchText.length < 3) ? []
    : candidates
        .filter(d => d.ballotName.toUpperCase().includes(searchText.toUpperCase()))
        .slice(0, 5)

  // Handle typing to auto-open the dropdown
  const handleInputChange = (e) => {
    setSearchText(e.target.value)
    setIsDropdownOpen(true)
  }

  return (
    <div className="modern-search-box">
      <h3 className="modern-search-title">Search 2026 Wyoming candidates by name</h3>
      <p className="modern-search-note">
        This guide includes federal, statewide, and legislative candidates. County commissioners and other local positions are excluded.
      </p>
      
      {/* Wrapper ref attached here to detect clicks outside this specific block */}
      <div className="search-field-wrapper" ref={wrapperRef}>
        <form onSubmit={e => e.preventDefault()}>
          <div className="search-input-container">
            <span className="search-inline-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            
            <input 
              onChange={handleInputChange} 
              onFocus={() => { if(searchText.length > 0) setIsDropdownOpen(true) }}
              type="text" 
              value={searchText} 
              placeholder={PLACEHOLDER} 
              className="modern-search-input"
            />
            
            {searchText && (
              <button 
                type="button" 
                className="search-inline-clear" 
                onClick={() => { setSearchText(''); setIsDropdownOpen(false); }}
              >
                &times;
              </button>
            )}
          </div>
        </form>

        {/* THE COMPACT DROPDOWN PANEL */}
        {(isDropdownOpen && searchText.length > 0) && (
          <div className="search-results-dropdown">
            {searchText.length < 3 && <p className="search-dropdown-status">Keep typing (at least 3 characters)...</p>}
            {matchingCandidates.length === 0 && searchText.length >= 3 && <p className="search-dropdown-status">No candidates match your search.</p>}
            {matchingCandidates.length > 0 && (
              <div className="dropdown-results-list">
                {matchingCandidates.map(c => <Candidate key={c.slug} {...c} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CandidateSearch