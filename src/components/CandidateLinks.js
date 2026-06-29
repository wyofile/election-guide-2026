const ExternalArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z" />
  </svg>
)

const smoothScroll = (id) => (e) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const CandidateLinks = ({ wyoleg, website, email }) => {
  return (
    <nav className="cand-links-bar" aria-label="Page sections">

      {/* Internal anchor links — jump to sections on this page */}
      <div className="cand-links-group">
        <a href="#questionnaire" onClick={smoothScroll('questionnaire')} className="cand-link-anchor">
          ↓ On the Issues
        </a>
        <a href="#coverage" onClick={smoothScroll('coverage')} className="cand-link-anchor">
          ↓ WyoFile Coverage
        </a>
      </div>

      {/* External links — open in new tab */}
      {(wyoleg || website || email) && (
        <div className="cand-links-group">
          {wyoleg && (
            <a href={wyoleg} target="_blank" rel="noopener noreferrer" className="cand-link-external">
              WyoLeg Profile <ExternalArrow />
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="cand-link-external">
              Candidate Website <ExternalArrow />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="cand-link-external">
              Campaign Email
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="currentColor"/>
              </svg>
            </a>
          )}
        </div>
      )}

    </nav>
  )
}

export default CandidateLinks
