import { useState } from "react"
import Link from "next/link"
import { useCandidateStories } from "@/lib/dataHooks"

import { PARTIES, STATUS } from "@/lib/styles"
import { formatRace } from "@/lib/utils"

const PLACEHOLDER = 'Enter candidate (e.g., John Barrasso)'

const Candidate = ({slug, ballotName, party, status, isIncumbent, hasResponses, office, tagId}) => {
    const partyInfo = PARTIES.find(d => d.key === party)
    const statusInfo = STATUS.find(d => d.key === status)
    const {stories, isLoading, error} = useCandidateStories(tagId, 25)

    return <div className="search-candidate" style={{ borderTop: `3px solid ${partyInfo.color}` }}><Link href={`/candidates/${slug}`}>
        <div className="search-party-label" >
            <div className="search-party-text" style={{ background: partyInfo.color }}>{party[0]}</div>
        </div>
        <div className="search-info-col">
            <div>
                <div className="search-name">{ballotName}</div>
                <div className="search-position"><span style={{ color: partyInfo.color }}>{partyInfo.noun}</span> for {formatRace(office)}</div>
                <div className="search-incum">{isIncumbent ? "Incumbent" : ""}</div>
                <div className="search-status">{statusInfo.label}</div>

                <div className="search-tag-line">
                    {hasResponses && <span className="tag">✏️ Candidate Q&A</span>}
                    {!hasResponses && <span className="tag">🚫 No Q&A response</span>}
                    { isLoading && <span className='tag'></span> }
                    { (!isLoading && !error && stories.length > 0) && <span className="tag">📰 <strong>{stories.length >= 25 ? '25+' : stories.length}</strong> {(stories.length === 1) ? 'article' : 'articles'}</span>}
                </div>
            </div>

            <div className="search-fakelink">See more »</div>
        </div>
    </Link ></div >
}

const CandidateSearch = ({candidates}) => {
    const [searchText, setSearchText] = useState('')

    const matchingCandidates = ((searchText !== null) && (searchText.length < 3)) ? []
        : candidates
            .filter(d => d.ballotName.toUpperCase().includes(searchText.toUpperCase()))
            .slice(0, 5)

    function handleChange(event) {
        const input = event.target.value
        setSearchText(input)
    }

    return <div className="search-box">
        <div className="search-title">Search 2026 Wyoming candidates by name</div>
        <div className="note">This guide includes federal and legislative candidates. County commissioners and other local positions are excluded.</div>
        <form onSubmit={e => { e.preventDefault(); }}>
            <input onChange={handleChange} type="text" value={searchText} placeholder={PLACEHOLDER} />
        </form>
        { (searchText.length > 0 && searchText.length < 3) && <p className="note">Keep typing...</p>}
        { (matchingCandidates.length === 0 && searchText.length >= 3) && <p className="note">No candidates match your search...</p>}
        {
            matchingCandidates.map(c => <Candidate key={c.slug} {...c} />)
        }
    </div>
}

export default CandidateSearch