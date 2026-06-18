import Link from 'next/link'
import { usePath } from '@/lib/utils'

const CandidateLinks = ({ wyoleg, website, email }) => {
  return (
    <div className="modern-links-bar">
      <ul className="modern-links-list">
        <li><Link href="#questionnaire" className="modern-btn-link anchor-link">On The Issues</Link></li>
        <li><Link href="#coverage" className="modern-btn-link anchor-link">WyoFile Coverage</Link></li>
        
        {wyoleg && (
          <li>
            <Link href={wyoleg} target="_blank" className="modern-btn-link external-link">
              WyoLeg Profile <span className="link-icon">&#8599;</span>
            </Link>
          </li>
        )}
        {website && (
          <li>
            <Link href={website} target="_blank" className="modern-btn-link external-link">
              Candidate Website <span className="link-icon">&#8599;</span>
            </Link>
          </li>
        )}
        {email && (
          <li>
            <Link href={`mailto:${email}`} target="_blank" className="modern-btn-link contact-link">
              Campaign Contact <span className="link-icon">✉</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default CandidateLinks