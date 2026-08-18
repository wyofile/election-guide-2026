import { useState } from 'react'
import { ExternalArrow } from './CandidateStories'
import { formatDate, formatDateTime, numberFormat, scrollPastStickyHeader } from '@/lib/utils'
import campaignFinanceMeta from '@/data/campaign-finance-meta.json'
import updateTime from '@/data/update-time.json'

const WY_CAMPAIGN_FINANCE_URL = 'https://www.wycampaignfinance.gov/WYCFWebApplication/GSF_Authentication/Default.aspx'
const WY_SEARCH_CONTRIBUTIONS_URL = 'https://www.wycampaignfinance.gov/WYCFWebApplication/GSF_SystemConfiguration/SearchContributions.aspx'
const FEC_DATA_URL = 'https://www.fec.gov/data/'
const FEC_SEARCH_CONTRIBUTIONS_URL = 'https://www.fec.gov/data/receipts/individual-contributions/'
const DONORS_PER_PAGE = 5

const CandidateCampaignFinance = ({ campaignFinance, candidateSlug, office, fecCandidateId, comparisonPool = [] }) => {
  const [visibleDonorCount, setVisibleDonorCount] = useState(DONORS_PER_PAGE)

  // Federal candidates (us-sen, us-house) file with the FEC, not the state
  // — different site, different links, and "as of" means something
  // different (the FEC data is fetched live at build time, so its
  // freshness tracks the site's last update rather than a dated CSV export).
  const isFederal = office === 'us-sen' || office === 'us-house'

  // Non-federal candidates always get a campaignFinance object (even if it's
  // all zeros) — only federal candidates without an fecCandidateId, or whose
  // FEC lookup failed, come through as null. Show the section anyway for
  // those rather than hiding it, so it's clear data wasn't found rather than
  // just missing from the page.
  if (!campaignFinance && !isFederal) {
    return null
  }

  const source = isFederal
    ? {
        label: 'FEC.gov',
        url: fecCandidateId ? `https://www.fec.gov/data/candidate/${fecCandidateId}/` : FEC_DATA_URL,
        searchUrl: FEC_SEARCH_CONTRIBUTIONS_URL,
        searchLabel: 'Search all FEC contributions',
        fullName: 'Federal Election Commission',
      }
    : {
        label: 'Wyoming Campaign Finance System',
        url: WY_CAMPAIGN_FINANCE_URL,
        searchUrl: WY_SEARCH_CONTRIBUTIONS_URL,
        searchLabel: 'Search all Wyoming campaign contributions',
        fullName: 'Wyoming Campaign Finance Information System',
      }

  if (!campaignFinance) {
    return (
      <section>
        <a className="link-anchor" id="campaign-finance"></a>
        <div className="section-header">
          <h2 className="section-header__title">Campaign Finance</h2>
          <div className="section-header__actions">
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="stories-teaser-all">
              {source.label} <ExternalArrow />
            </a>
            <a href="#page-top" className="back-to-top back-to-top--persist" onClick={scrollPastStickyHeader('page-top')}>↑ Top</a>
          </div>
        </div>
        <p className="finance-unavailable">Campaign finance data is not yet available for this candidate.</p>
      </section>
    )
  }

  const { totalContributions, totalExpenditures, topContributors } = campaignFinance
  const maxDonorAmount = topContributors.length ? topContributors[0].amount : 1
  const visibleContributors = topContributors.slice(0, visibleDonorCount)
  const hasMoreContributors = visibleDonorCount < topContributors.length
  const canCollapseContributors = visibleDonorCount > DONORS_PER_PAGE

  // House and Senate districts each only have a couple of candidates, so
  // comparing against just the district race isn't a very meaningful
  // benchmark — compare against the whole chamber instead. comparisonPool
  // is pre-filtered to the right group (chamber-wide vs. district) and
  // trimmed to just {slug, ballotName, totalContributions} server-side, in
  // getStaticProps — see [candidate].js.
  const isHouse = /^H\d{2}$/.test(office)
  const isSenate = /^S\d{2}$/.test(office)
  const comparisonLabel = isHouse ? 'the Wyoming House' : isSenate ? 'the Wyoming Senate' : 'this race'

  // Scale both figures against the top fundraiser in the comparison pool,
  // rather than against each other — that tells readers something
  // ("outraised by how much?") instead of just which of the two happens to
  // be bigger.
  const raceLeader = comparisonPool
    .reduce((leader, c) => (
      !leader || c.totalContributions > leader.totalContributions ? c : leader
    ), null)
  const raceMaxRaised = Math.max(raceLeader?.totalContributions || 0, totalContributions, 1)
  const isRaceLeader = raceLeader?.slug === candidateSlug

  return (
    <section>
      <a className="link-anchor" id="campaign-finance"></a>
      <div className="section-header">
        <h2 className="section-header__title">Campaign Finance</h2>
        <div className="section-header__actions">
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="stories-teaser-all">
            {source.label} <ExternalArrow />
          </a>
          <a href="#page-top" className="back-to-top back-to-top--persist" onClick={scrollPastStickyHeader('page-top')}>↑ Top</a>
        </div>
      </div>

      <p className="finance-as-of">
        {isFederal
          ? `As of ${formatDateTime(new Date(updateTime.updateTime))}, per FEC filings.`
          : `As of ${formatDate(new Date(`${campaignFinanceMeta.asOfDate}T00:00:00`))}, per state filings.`}
      </p>

      <div className="finance-totals">
        <div className="finance-total-row">
          <div className="finance-total-row__header">
            <span className="finance-total-label">Total Raised</span>
            <span className="finance-total-value">${numberFormat(totalContributions)}</span>
          </div>
          <div className="finance-bar-track">
            <div className="finance-bar-fill" style={{ width: `${Math.min((totalContributions / raceMaxRaised) * 100, 100)}%` }} />
          </div>
        </div>
        <div className="finance-total-row">
          <div className="finance-total-row__header">
            <span className="finance-total-label">Total Spent</span>
            <span className="finance-total-value">${numberFormat(totalExpenditures)}</span>
          </div>
          <div className="finance-bar-track">
            <div className="finance-bar-fill" style={{ width: `${Math.min((totalExpenditures / raceMaxRaised) * 100, 100)}%` }} />
          </div>
        </div>
        {raceLeader && (
          <p className="finance-race-context">
            {isRaceLeader
              ? `Shown relative to the top fundraiser in ${comparisonLabel} — ${raceLeader.ballotName} raised more than any other candidate.`
              : `Shown relative to the top fundraiser in ${comparisonLabel}: ${raceLeader.ballotName}, with $${numberFormat(raceLeader.totalContributions)} raised.`}
          </p>
        )}
      </div>

      {topContributors.length > 0 && (
        <div className="finance-donors">
          <h3 className="finance-donors__title">Top Contributors<span className="finance-donor-asterisk">*</span></h3>
          <ol className="finance-donor-list">
            {visibleContributors.map((donor, i) => (
              <li key={`${donor.name}-${i}`} className="finance-donor-row">
                <span className="finance-donor-name">{donor.name}</span>
                <span className="finance-donor-bar-track">
                  <span className="finance-donor-bar-fill" style={{ width: `${(donor.amount / maxDonorAmount) * 100}%` }} />
                </span>
                <span className="finance-donor-amount">${numberFormat(donor.amount)}</span>
              </li>
            ))}
          </ol>
          {(hasMoreContributors || canCollapseContributors) && (
            <div className="finance-donor-toggle-row">
              {hasMoreContributors && (
                <button
                  type="button"
                  className="finance-donor-show-more"
                  onClick={() => setVisibleDonorCount(c => Math.min(c + DONORS_PER_PAGE, topContributors.length))}
                >
                  Show {Math.min(DONORS_PER_PAGE, topContributors.length - visibleDonorCount)} more ↓
                </button>
              )}
              {canCollapseContributors && (
                <button
                  type="button"
                  className="finance-donor-show-more"
                  onClick={() => setVisibleDonorCount(DONORS_PER_PAGE)}
                >
                  Show less ↑
                </button>
              )}
            </div>
          )}
          {!hasMoreContributors && (
            <p className="finance-donor-search-link">
              <a href={source.searchUrl} target="_blank" rel="noopener noreferrer">
                {source.searchLabel} <ExternalArrow />
              </a>
            </p>
          )}
          <p className="finance-donor-disclosure">
            <span className="finance-donor-asterisk">*</span> Contributions are grouped by donor name and reported ZIP code — two donors who share both could
            be counted as one, and the same donor could be split into separate entries if they were reported
            giving from two different addresses. Errors in how a candidate or committee reported a
            contribution may also make these totals inaccurate.
          </p>
        </div>
      )}

      <p className="finance-source">
        Full records, individual transactions, and filings {isFederal ? 'for federal candidates are' : 'for all Wyoming candidates are'} available from the{' '}
        <a href={source.url} target="_blank" rel="noopener noreferrer">{source.fullName}</a>.
      </p>
    </section>
  )
}

export default CandidateCampaignFinance
