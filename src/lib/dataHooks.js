import useSWRImmutable from 'swr/immutable'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const API_BASE_PATH = 'https://wyofile-cache.tmusselman.workers.dev/wp-json/wp/v2'
const EXCLUDED_CATEGORY_IDS = [9251] //exclude opinion category
const AFTER_DATE = '2025-01-01T00:00:00Z'
const REQUEST_FIELDS = ['id', 'date', 'link', 'title', 'jetpack_featured_media_url']

// Strip middle initials and common name suffixes so "John A. Smith Jr." → "John Smith"
const SUFFIX_PATTERN = /\b(jr\.?|sr\.?|ii|iii|iv|v|esq\.?|md|m\.d\.|ph\.?d\.?|dds|do)\b\.?/gi
const MIDDLE_INITIAL_PATTERN = /\b[A-Z]\.\s*/g

export const cleanNameForSearch = (name) =>
  name
    .replace(SUFFIX_PATTERN, '')
    .replace(MIDDLE_INITIAL_PATTERN, '')
    .replace(/,/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

export const useCandidateStories = (tagId, count) => {
  const key = `${API_BASE_PATH}/posts?tags=${tagId}&per_page=${count}&categories_exclude=${EXCLUDED_CATEGORY_IDS}&after=${AFTER_DATE}&_fields=${REQUEST_FIELDS}`

  const {data: stories, isLoading, error} = useSWRImmutable(key, fetcher)

  return {
    stories,
    isLoading,
    error
  }
}

export const useElectionStories = (categoryId, count) => {
  const key = `${API_BASE_PATH}/posts?categories=${categoryId}&per_page=${count}&categories_exclude=${EXCLUDED_CATEGORY_IDS}&after=${AFTER_DATE}&_fields=${REQUEST_FIELDS}`

  const {data: stories, isLoading, error} = useSWRImmutable(key, fetcher)

  return {
    stories,
    isLoading,
    error
  }
}

export const useSearchStories = (candidateName, count, categoryId) => {
  const cleanedName = cleanNameForSearch(candidateName)
  console.log(cleanedName)
  const key = `${API_BASE_PATH}/posts?search=${encodeURIComponent(cleanedName)}&per_page=${count}&categories=${categoryId}&categories_exclude=${EXCLUDED_CATEGORY_IDS}&after=${AFTER_DATE}&_fields=${REQUEST_FIELDS}`

  const {data: stories, isLoading, error} = useSWRImmutable(key, fetcher)

  return {
    stories,
    isLoading,
    error
  }
}