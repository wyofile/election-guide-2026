import useSWRImmutable from 'swr/immutable'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const API_BASE_PATH = 'https://wyofile-cache.tmusselman.workers.dev/wp-json/wp/v2'
const EXCLUDED_CATEGORY_IDS = [9251] //exclude opinion category
const AFTER_DATE = '2025-01-01T00:00:00Z'
const REQUEST_FIELDS = ['id', 'date', 'link', 'title', 'jetpack_featured_media_url']

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
  const key = `${API_BASE_PATH}/posts?search=${candidateName}&per_page=${count}&categories=${categoryId}&categories_exclude=${EXCLUDED_CATEGORY_IDS}&after=${AFTER_DATE}&_fields=${REQUEST_FIELDS}`

  const {data: stories, isLoading, error} = useSWRImmutable(key, fetcher)

  return {
    stories,
    isLoading,
    error
  }
}