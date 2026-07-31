import Link from 'next/link'

const DONATE_LINK = 'https://wyofile.fundjournalism.org/donate/?campaign=701Pl00001eHzE2IAK'

/**
 * variant: 'eyebrow' (compact pill, sits in the black eyebrow bar),
 * 'hero' (centered pill below the share buttons), or
 * 'section' (larger CTA with lead-in text, used at the end of
 * "About this Project" sections).
 */
const DonateButton = ({ variant = 'eyebrow' }) => {
  const button = (
    <Link
      href={DONATE_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`donate-btn donate-btn--${variant}`}
    >
      <span>Support this work <span className="donate-heart">❤️</span></span>
    </Link>
  )

  if (variant === 'eyebrow') {
    return button
  }

  return (
    <div className={`donate-cta donate-cta--${variant}`}>
      {variant === 'section' && (
        <p className="donate-cta__lead">Enjoying WyoFile&rsquo;s election coverage?</p>
      )}
      {button}
    </div>
  )
}

export default DonateButton
