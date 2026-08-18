import { timeFormat } from 'd3-time-format'
import { format } from 'd3-format'
import { useRouter } from 'next/router'

export const formatDate = timeFormat('%b %-d, %Y')
export const formatDateTime = timeFormat('%b %-d, %Y - %I:%M %p')
export const numberFormat = format(',.0f')
export const percentFormat = format('.1%')

export const pluralize = (text, value) => value === 1 ? text : `${text}s`

export const usePath = (path) => {
  return `${useRouter().basePath}${path}`
}

export const formatRace = office => {
  if (office === 'us-sen') {
    return "U.S. Senate"
  } else if (office === 'us-house') {
    return "U.S. House of Representatives"
  } else if (office[0] === 'H') {
    return `WY House District ${parseInt(office.substring(1))}`
  } else if (office[0] === 'S') {
    return `WY Senate District ${parseInt(office.substring(1))}`
  } else if (office === 'sos') {
    return "Secretary of State"
  } else if (office === 'aud') {
    return "State Auditor"
  } else if (office === 'treas') {
    return "State Treasurer"
  } else if (office === 'sup') {
    return "State Superintendent of Public Instruction"
  } else if (office === 'gov') {
    return "Governor"
  }
  
}

// Scrolls an element into view flush beneath the sticky eyebrow bar + nav,
// measuring their actual current height rather than assuming a fixed value
// (their combined height isn't constant — the nav in particular differs
// between the mobile dropdown and desktop menu).
export const scrollPastStickyHeader = (id) => (e) => {
  e.preventDefault()
  const target = document.getElementById(id)
  if (!target) {
    return
  }
  const eyebrow = document.querySelector('.eyebrow-bar')
  const nav = document.querySelector('.smart-nav-container')
  const stickyHeight = (eyebrow?.offsetHeight || 0) + (nav?.offsetHeight || 0)
  const targetY = target.getBoundingClientRect().top + window.scrollY - stickyHeight
  window.scrollTo({ top: targetY, behavior: 'smooth' })
}

export const getPortraitPath = (hasPhoto, party, slug) => {
  if (hasPhoto) {
    return usePath(`/portraits-t/${slug}.webp`)
  } else {
    return usePath('/portraits-t/non-participant.png')
  }
}