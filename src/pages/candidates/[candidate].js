import candidateData from '@/data/candidate-data.json'
import textData from '../../data/static-text.json'
import wyoLegQs from '../../data/wyo-leg-qs.json'
import federalQs from '../../data/federal-qs.json'
// import primaryResults from '../../data/primary-results.json'
// import generalResults from '../../data/general-results.json'
import updateTime from '@/data/update-time.json'

import CandidateOpponents from '@/components/CandidateOpponents'
import CandidatePageSummary from '@/components/CandidatePageSummary'
import CandidateStories from '@/components/CandidateStories'
import CandidateLinks from '@/components/CandidateLinks'
import RaceResults from '@/components/RaceResults'
import Layout from '@/design/Layout'
import { formatRace } from '@/lib/utils'
import { PARTIES } from '@/lib/styles'
import { formatDateTime } from '@/lib/utils'

import Markdown from 'react-markdown'
import Link from 'next/link'

export async function getStaticPaths() {
  // Define routes that should be used for /[candidate] pages
  const slugs = candidateData.map(c => c.slug)
  return {
    paths: slugs.map(d => ({ params: { candidate: d } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const candidate = candidateData.find(c => c.slug === params.candidate)
  const candidatesInDistrict = candidateData.filter(c => (c.office === candidate.office))
  // const primaryRaceResults = primaryResults.find(r => r.district === candidate.district && r.party === candidate.party) || null
  // const generalRaceResults = generalResults.find(r => r.district === candidate.district && (candidate.status === 'active' || candidate.status === 'won-general' || candidate.status ==='lost-general')) || null
  const questions = (candidate.office[0] === 'u' ? federalQs : wyoLegQs)
  const questionnaireIntro = textData.questionnaireIntro
  const aboutProject = textData.aboutProject

  return {
      props: {
        candidate,
        // primaryRaceResults,
        // generalRaceResults,
        candidatesInDistrict,
        questions,
        questionnaireIntro,
        aboutProject
      }
  }
}

export default function CandidatePage({candidate, questions, questionnaireIntro, aboutProject, candidatesInDistrict}) {
  const pageDescription = `${candidate.ballotName} (${candidate.party}) is running as a candidate for ${formatRace(candidate.office)} in Wyoming's 2026 election. See biographic details, issue positions and information on how to vote.`
  
  return (
    <Layout 
      relativePath={candidate.slug}
      pageTitle={`${candidate.ballotName} | ${formatRace(candidate.office)} | 2026 Wyoming Election Guide`}
      pageDescription={pageDescription}
      siteSeoTitle={`${candidate.ballotName} | ${formatRace(candidate.office)} | WyoFile 2026 Election Guide`}
      seoDescription={pageDescription}
      socialTitle={`${candidate.ballotName} | The WyoFile 2026 Election Guide`}
      socialDescription={`Candidate for ${formatRace(candidate.office)}`}
    >
    <CandidatePageSummary candidate={candidate} />

    <CandidateLinks wyoleg={candidate.wyoleg} website={candidate.website} email={candidate.email}/>

    <CandidateOpponents candidatesInDistrict={candidatesInDistrict} currentSlug={candidate.slug} race={formatRace(candidate.office)} />

    <section>
      <a className="link-anchor" id="questionnaire"></a>
      <h2 className='section-header-prominent'>On the Issues</h2>
      <Markdown className='questionnaire-intro'>{questionnaireIntro}</Markdown>
      <div className="on-the-issues">
        {questions.map((q, i) => {
          const answer = candidate.hasResponses ? candidate.responses[i] : '_No candidate response._'
          return(
            <div key={`question-${i}`}>
              <h3 className="question-header">{q}</h3>
              <div className="answer">
                <Markdown>{answer}</Markdown>
              </div>
            </div>
          )
        })}
      </div>
    </section>

    {/* <section>
      <a className="link-anchor" id="results"></a>
      <h2 className='section-header'>Election Results</h2>
      {
        generalRaceResults && <RaceResults results={generalRaceResults} voteType='Candidate' raceTitle={`November 5 General Election${generalRaceResults.candidates.length === 1 ? " (uncontested)" : "" }`} isUncontested={generalRaceResults.candidates.length === 1}/> 
      }
      {
        primaryRaceResults ? <RaceResults results={primaryRaceResults} voteType='Candidate' raceTitle={`August 20 Primary – ${PARTIES.find(d=> d.key === candidate.party).adjective} candidates${primaryRaceResults.candidates.length === 1 ? " (uncontested)" : "" }`} isUncontested={primaryRaceResults.candidates.length === 1} /> : <p> There are no primary results available for this candidate.</p>
      }
      <div className="results-source">Election results provided by the Associated Press. Last updated {formatDateTime(new Date(updateTime.updateTime))}</div>
    </section> */}

    <section>
      <a className="link-anchor" id="coverage"></a>
      <h2 className='section-header-prominent'>WyoFile Coverage of {candidate.lastName}</h2>
      <CandidateStories tagId={candidate.tagId} slug={candidate.slug} ballotName={candidate.ballotName} />
    </section>

    <section>
      <h2 className='section-header-prominent'>About this Project</h2>
      <Markdown>{aboutProject}</Markdown>
    </section>

    </Layout>
  )
}