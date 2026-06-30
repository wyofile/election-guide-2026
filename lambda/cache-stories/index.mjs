import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'

// Real WordPress REST API — not the Cloudflare worker the front end hits.
// This Lambda *is* the new cache layer, so it talks to WyoFile directly.
const WP_API_BASE = 'https://wyofile.com/wp-json/wp/v2'
const EXCLUDED_CATEGORY_IDS = [9251] // opinion category
const EXCLUDED_TAG_IDS = [15647] // exclude-election-guide tag
const AFTER_DATE = '2025-01-01T00:00:00Z'
const REQUEST_FIELDS = ['id', 'date', 'link', 'title', 'jetpack_featured_media_url']
const ELECTION_CATEGORY_ID = '14113'
const CANDIDATE_STORY_COUNT = 12
const ELECTION_STORY_COUNT = 6

const BUCKET = 'projects.wyofile.com'
const REGION = 'us-east-2'
const CANDIDATE_DATA_KEY = 'data/election-guide-2026/candidate-data.json'
const STORIES_PREFIX = 'data/election-guide-2026/stories'
const DISTRIBUTION_ID = 'E1LSUP0GLMODKL'
const INVALIDATION_PATH = '/data/election-guide-2026/stories/*'

// Paced to match the rest of the pipeline's WP request throttling (inputs/fetch-ids.mjs)
const REQUEST_DELAY_MS = 350

const s3 = new S3Client({ region: REGION })
const cloudfront = new CloudFrontClient({ region: REGION })

// Mirrors src/lib/dataHooks.js cleanNameForSearch exactly
const SUFFIX_PATTERN = /\b(jr\.?|sr\.?|ii|iii|iv|v|esq\.?|md|m\.d\.|ph\.?d\.?|dds|do)\b\.?/gi
const MIDDLE_INITIAL_PATTERN = /\b[A-Z]\.\s*/g

const cleanNameForSearch = (name) =>
  name
    .replace(SUFFIX_PATTERN, '')
    .replace(MIDDLE_INITIAL_PATTERN, '')
    .replace(/,/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Mirrors useSearchStories (no category filter — that's also true of the live hook)
const buildCandidateSearchUrl = (ballotName) => {
  const cleanedName = cleanNameForSearch(ballotName)
  return `${WP_API_BASE}/posts?search=${encodeURIComponent(cleanedName)}&per_page=${CANDIDATE_STORY_COUNT}&categories_exclude=${EXCLUDED_CATEGORY_IDS}&tags_exclude=${EXCLUDED_TAG_IDS}&after=${AFTER_DATE}&_fields=${REQUEST_FIELDS}`
}

// Mirrors useElectionStories
const buildElectionStoriesUrl = () =>
  `${WP_API_BASE}/posts?categories=${ELECTION_CATEGORY_ID}&per_page=${ELECTION_STORY_COUNT}&categories_exclude=${EXCLUDED_CATEGORY_IDS}&after=${AFTER_DATE}&_fields=${REQUEST_FIELDS}`

async function fetchStories(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`WP API request failed (${response.status}): ${url}`)
  }
  return response.json()
}

async function getCandidates() {
  const result = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: CANDIDATE_DATA_KEY }))
  const body = await result.Body.transformToString()
  return JSON.parse(body)
}

async function putJson(key, data) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json'
  }))
}

async function invalidateCache() {
  await cloudfront.send(new CreateInvalidationCommand({
    DistributionId: DISTRIBUTION_ID,
    InvalidationBatch: {
      Paths: { Quantity: 1, Items: [INVALIDATION_PATH] },
      CallerReference: `cache-stories-${Date.now()}`
    }
  }))
}

async function cacheCandidateStories(candidates) {
  for (const candidate of candidates) {
    const { slug, ballotName } = candidate
    if (!slug || !ballotName) continue

    try {
      const stories = await fetchStories(buildCandidateSearchUrl(ballotName))
      await putJson(`${STORIES_PREFIX}/${slug}.json`, { count: stories.length, stories })
      console.log(`[OK] ${slug}: ${stories.length} stories`)
    } catch (err) {
      console.error(`[FAIL] ${slug}:`, err.message)
    }

    await sleep(REQUEST_DELAY_MS)
  }
}

async function cacheElectionStories() {
  const stories = await fetchStories(buildElectionStoriesUrl())
  await putJson(`${STORIES_PREFIX}/election-stories.json`, { stories })
  console.log(`[OK] election-stories: ${stories.length} stories`)
}

export const handler = async () => {
  const candidates = await getCandidates()
  console.log(`Loaded ${candidates.length} candidates`)

  await cacheCandidateStories(candidates)
  await cacheElectionStories()
  await invalidateCache()

  return { statusCode: 200, body: 'Story cache refreshed' }
}
