import candidateData from '@/data/candidate-data.json'
import { metaData } from '@/config'

export default function sitemap() {
  const { baseUrl } = metaData

  const homePage = {
    url: `${baseUrl}/`,
    changeFrequency: 'daily',
    priority: 1,
  }

  const candidatePages = candidateData.map(({ slug }) => ({
    url: `${baseUrl}/candidates/${slug}/`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [homePage, ...candidatePages]
}
