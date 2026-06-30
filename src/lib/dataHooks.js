import useSWRImmutable from 'swr/immutable'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const STORIES_CACHE_BASE = 'https://projects.wyofile.com/data/election-guide-2026/stories'

export const useCachedStories = (slug) => {
  const key = slug ? `${STORIES_CACHE_BASE}/${slug}.json` : null

  // The cached JSON is { count, stories } — `stories` here is that whole
  // object, so callers use stories.count and stories.stories.
  const {data: stories, isLoading, error} = useSWRImmutable(key, fetcher)

  return {
    stories,
    isLoading,
    error
  }
}

export const useCachedElectionStories = () => {
  const key = `${STORIES_CACHE_BASE}/election-stories.json`

  const {data, isLoading, error} = useSWRImmutable(key, fetcher)

  return {
    stories: data?.stories,
    isLoading,
    error
  }
}