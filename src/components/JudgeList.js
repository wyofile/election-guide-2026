import { useState } from 'react'
import dynamic from 'next/dynamic'
import judgeData from '@/data/judge-retention.json'
import { ExternalArrow } from '@/components/CandidateStories'
import JudicialDistrictMap from '@/components/JudicialDistrictMap'

const Select = dynamic(() => import('react-select'), { ssr: false })

// Wyoming's 9 judicial districts are fixed geographic boundaries, independent
// of judge-retention.json's contents — this mapping doesn't need to change
// when that file is swapped out for 2026 names/links.
const COUNTY_DISTRICTS = {
  Laramie: 1,
  Albany: 2, Carbon: 2,
  Lincoln: 3, Sweetwater: 3, Uinta: 3,
  Johnson: 4, Sheridan: 4,
  'Big Horn': 5, 'Hot Springs': 5, Park: 5, Washakie: 5,
  Campbell: 6, Crook: 6, Weston: 6,
  Natrona: 7,
  Converse: 8, Goshen: 8, Niobrara: 8, Platte: 8,
  Fremont: 9, Sublette: 9, Teton: 9,
}

const countyOptions = Object.keys(COUNTY_DISTRICTS).sort().map(county => ({ value: county, label: county }))

const customSelectStyles = {
  control: (base) => ({
    ...base,
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
    minHeight: '44px',
  }),
  valueContainer: (base) => ({ ...base, padding: '0 16px' }),
  singleValue: (base) => ({
    ...base,
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 600,
    color: '#0f172a',
    fontSize: '1rem',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#64748b',
    fontFamily: '"Roboto", sans-serif',
    fontSize: '1rem',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#475569',
    padding: '8px 12px',
    cursor: 'pointer',
    '&:hover': { color: '#0f172a' },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menu: (base) => ({
    ...base,
    zIndex: 1000,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginTop: '4px',
  }),
  menuList: (base) => ({ ...base, maxHeight: '280px' }),
  option: (base, state) => ({
    ...base,
    fontFamily: '"Roboto", sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    color: state.isSelected ? '#ffffff' : '#0f172a',
    backgroundColor: state.isSelected
      ? 'var(--dark-sea-green, #89a6a0)'
      : state.isFocused
      ? '#f1f5f9'
      : '#ffffff',
    cursor: 'pointer',
    padding: '10px 16px',
    '&:active': { backgroundColor: 'var(--darker-sea-green, #77958f)' },
  }),
}

const JudgeLinkList = ({ title, judges, prefix }) => {
  if (!judges.length) return null
  return (
    <div className="jd-judge-group">
      <h4 className="jd-section-label">{title}</h4>
      <ul className="jd-judge-list">
        {judges.map((judge, i) => (
          <li key={`${title}-${i}`} className="jd-judge-row">
            {judge.link ? (
              <a href={judge.link} target="_blank" rel="noopener noreferrer" className="jd-judge-link">
                {prefix}{judge.name} <ExternalArrow />
              </a>
            ) : (
              <span className="jd-judge-name">{prefix}{judge.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const JudgeList = () => {
  const [county, setCounty] = useState(null)
  const districtIndex = county ? COUNTY_DISTRICTS[county] : null
  const district = districtIndex ? judgeData.districts[districtIndex - 1] : null

  return (
    <div className="jd-wrapper">

      <div className="jd-panel">
        <div className="jd-panel-header">
          <h3 className="jd-card-title">Find Your Judges</h3>
          <p className="jd-card-subtitle">Click your county on the map, or choose it from the list.</p>
        </div>

        <div className="jd-panel-body">
          <JudicialDistrictMap
            countyDistricts={COUNTY_DISTRICTS}
            selectedCounty={county}
            onSelectCounty={setCounty}
          />

          <div className="jd-panel-results">
            <div className="jd-picker-select">
              <Select
                aria-label="Select your county"
                options={countyOptions}
                value={county ? { value: county, label: county } : null}
                onChange={(opt) => setCounty(opt?.value ?? null)}
                placeholder="Select your county…"
                isClearable
                isSearchable={false}
                styles={customSelectStyles}
                instanceId="judge-county-select"
                menuPlacement="auto"
              />
            </div>

            <div className="jd-card-picker-result">
              {district ? (
                <>
                  <div className="jd-district-label">
                    <h4 className="jd-card-title jd-card-title--sm">{district.title}</h4>
                    <p className="jd-card-subtitle">{district.counties}</p>
                  </div>
                  <JudgeLinkList title="Supreme Court Justices (Statewide)" judges={judgeData.supremeCourt.judges} prefix="Justice " />
                  <JudgeLinkList title="Chancery Court Judges (Statewide)" judges={judgeData.chanceryCourt.judges} prefix="Judge " />
                  <JudgeLinkList title="District Judges" judges={district.districtJudges} prefix="" />
                  <JudgeLinkList title="Circuit Judges" judges={district.circuitJudges} prefix="Judge " />
                </>
              ) : (
                <div className="jd-card-picker-empty">
                  <p className="jd-empty-text">Select your county above to see the Supreme Court, Chancery Court, district and circuit court judges up for retention.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default JudgeList
