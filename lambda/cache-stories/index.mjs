import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
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

const CANDIDATE_DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPmJVB9NgM-rrPq34eowXldtaMyWZa-a0NqjBaBiWvTtDa5nZxPqYUtWNLev6UCRUtiUsR48bXlpG5/pub?gid=121135908&single=true&output=csv'

const BUCKET = 'projects.wyofile.com'
const REGION = 'us-east-2'
const STORIES_PREFIX = 'data/election-guide-2026/stories'
const DISTRIBUTION_ID = 'E1LSUP0GLMODKL'
const INVALIDATION_PATH = '/data/election-guide-2026/stories/*'

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

// Minimal RFC-4180 CSV parser — handles Google Sheets quoted fields (e.g. "123,456")
function parseCSVLine(line) {
  const fields = []
  let i = 0
  while (i <= line.length) {
    if (line[i] === '"') {
      let field = ''
      i++
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') { field += '"'; i += 2 }
        else if (line[i] === '"') { i++; break }
        else { field += line[i++] }
      }
      fields.push(field)
      if (line[i] === ',') i++
    } else {
      const end = line.indexOf(',', i)
      if (end === -1) { fields.push(line.slice(i)); break }
      fields.push(line.slice(i, end))
      i = end + 1
    }
  }
  return fields
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  const headers = parseCSVLine(lines[0]).map(h => h.trim())
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? '').trim()]))
  })
}

// Mirrors useSearchStories (no category filter — that's also true of the live hook)
const buildCandidateSearchUrl = (ballotName, excludedPostIds) => {
  const cleanedName = cleanNameForSearch(ballotName)
  const excludeParam = excludedPostIds?.length ? `&exclude=${excludedPostIds.join(',')}` : ''
  return `${WP_API_BASE}/posts?search=${encodeURIComponent(`"${cleanedName}"`)}&per_page=${CANDIDATE_STORY_COUNT}&categories_exclude=${EXCLUDED_CATEGORY_IDS}&tags_exclude=${EXCLUDED_TAG_IDS}&after=${AFTER_DATE}&_fields=${REQUEST_FIELDS}${excludeParam}`
}

const buildCandidateTagUrl = (tagId, excludedPostIds) => {
  const excludeParam = excludedPostIds?.length ? `&exclude=${excludedPostIds.join(',')}` : ''
  return `${WP_API_BASE}/posts?tags=${tagId}&per_page=${CANDIDATE_STORY_COUNT}&categories_exclude=${EXCLUDED_CATEGORY_IDS}&tags_exclude=${EXCLUDED_TAG_IDS}&after=${AFTER_DATE}&_fields=${REQUEST_FIELDS}${excludeParam}`
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
  const response = await fetch(CANDIDATE_DATA_URL)
  if (!response.ok) throw new Error(`Failed to fetch candidate CSV (${response.status})`)
  return parseCSV(await response.text())
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

const BATCH_SIZE = 30

async function processCandidate(candidate) {
  const { slug, ballotName, tagId, excludedPostIds: rawExcluded } = candidate
  if (!slug || !ballotName) return

  const excludedPostIds = rawExcluded
    ? rawExcluded.split(',').map(id => id.trim()).filter(Boolean)
    : []

  const fetches = [fetchStories(buildCandidateSearchUrl(ballotName, excludedPostIds))]
  if (tagId) fetches.push(fetchStories(buildCandidateTagUrl(tagId, excludedPostIds)))

  const seen = new Map()
  const results = await Promise.all(fetches)
  results.flat().forEach(story => {
    if (!seen.has(story.id)) seen.set(story.id, story)
  })
  const stories = [...seen.values()]

  await putJson(`${STORIES_PREFIX}/${slug}.json`, { count: stories.length, stories })
  console.log(`[OK] ${slug}: ${stories.length} stories`)
}

async function cacheCandidateStories(candidates) {
  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE)
    const results = await Promise.allSettled(batch.map(processCandidate))
    results.forEach((result, j) => {
      if (result.status === 'rejected') {
        console.error(`[FAIL] ${batch[j].slug}:`, result.reason?.message)
      }
    })
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
