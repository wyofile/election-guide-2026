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
  }
}

export const getPortraitPath = (hasPhoto, party, slug) => {
  if (hasPhoto) {
    return usePath(`/portraits-t/${slug}.png`)
  } else {
    return usePath('/portraits-t/non-participant.png')
  }
}