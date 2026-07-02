import fetch from 'node-fetch'
import readline from 'readline'
import { stringify } from 'csv-stringify/sync'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import 'dotenv/config'

const WP_SITE_URL = process.env.WP_SITE_URL
const WP_USERNAME = process.env.WP_USERNAME
const WP_APPLICATION_PASSWORD = process.env.WP_APPLICATION_PASSWORD
const CANDIDATE_DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPmJVB9NgM-rrPq34eowXldtaMyWZa-a0NqjBaBiWvTtDa5nZxPqYUtWNLev6UCRUtiUsR48bXlpG5/pub?gid=121135908&single=true&output=csv'
const OUTPUT_PATH = './inputs/merge-tags-candidates.csv'

if (!WP_USERNAME || !WP_APPLICATION_PASSWORD || !WP_SITE_URL) {
  console.error('Error: Missing required WordPress configuration in .env file.')
  process.exit(1)
}

const authHeader = `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APPLICATION_PASSWORD}`).toString('base64')}`

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(resolve => rl.question(q, resolve))

// --- NAME NORMALIZATION ---
const NAME_NOISE = /\b(jr\.?|sr\.?|ii|iii|iv|esq\.?|md|m\.d\.|phd|ph\.d\.|dds|do|rep\.?|sen\.?|gov\.?|dr\.?)\b\.?/gi
const INITIALS = /\b[a-z]\.\s*/gi

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(NAME_NOISE, '')
    .replace(INITIALS, '')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function nameTokens(name) {
  return normalizeName(name).split(' ').filter(t => t.length > 1)
}

// --- SLUG NORMALIZATION ---
const SLUG_SUFFIXES = [
  /-\d{4}$/,
  /-(wyoming|wy)$/i,
  /-(jr|sr|ii|iii|iv)$/i,
  /-(rep|sen|representative|senator|governor|gov|md|phd|esq)$/i,
  /-(republican|democrat|democratic|libertarian|independent)$/i,
]

function normalizeSlug(slug) {
  let s = slug
  let changed = true
  while (changed) {
    changed = false
    for (const pattern of SLUG_SUFFIXES) {
      const next = s.replace(pattern, '')
      if (next !== s) { s = next; changed = true }
    }
  }
  return s
}

// --- LEVENSHTEIN DISTANCE ---
function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function isSlugSimilar(tagSlug, candidateSlug) {
  const a = normalizeSlug(tagSlug)
  const b = normalizeSlug(candidateSlug)
  if (a === b) return true
  const threshold = Math.max(2, Math.floor(Math.max(a.length, b.length) * 0.25))
  return levenshtein(a, b) <= threshold
}

// A tag name is similar to a candidate if:
// - the candidate's last name appears in the tag name tokens, AND
// - at least one first name or ballot name token also appears
function isNameSimilar(tagName, candidate) {
  const tagToks = new Set(nameTokens(tagName))
  const lastToks = nameTokens(candidate.lastName)
  const firstToks = nameTokens(candidate.firstName)
  const ballotToks = nameTokens(candidate.ballotName)

  const lastNameMatch = lastToks.some(t =>
    [...tagToks].some(tt => t === tt || (t.length > 3 && levenshtein(t, tt) <= 1))
  )
  if (!lastNameMatch) return false

  const firstOrBallotMatch =
    firstToks.some(t => tagToks.has(t)) ||
    ballotToks.some(t => tagToks.has(t))

  return firstOrBallotMatch
}

// --- DATA FETCHING ---
async function fetchCandidates() {
  const response = await fetch(CANDIDATE_DATA_URL)
  if (!response.ok) throw new Error(`Failed to fetch candidate CSV (${response.status})`)
  const text = await response.text()
  return parse(text, { columns: true, skip_empty_lines: true })
    .map(r => ({
      slug: r.slug?.trim(),
      tagID: r.tagID?.trim(),
      ballotName: r.ballotName?.trim() || '',
      firstName: r.firstName?.trim() || '',
      lastName: r.lastName?.trim() || '',
    }))
    .filter(r => r.slug)
}

async function fetchAllTags() {
  const tags = []
  let page = 1
  process.stdout.write('Fetching WP tags')
  while (true) {
    const url = `${WP_SITE_URL}/wp-json/wp/v2/tags?per_page=100&page=${page}&_fields=id,slug,name,count`
    const response = await fetch(url, { headers: { Authorization: authHeader } })
    if (!response.ok) throw new Error(`Failed to fetch tags (${response.status})`)
    const data = await response.json()
    if (!data.length) break
    tags.push(...data)
    process.stdout.write('.')
    if (page >= parseInt(response.headers.get('X-WP-TotalPages') || '1')) break
    page++
  }
  console.log(` ${tags.length} tags loaded.\n`)
  return tags
}

// --- MAIN ---
async function main() {
  const [candidates, allTags] = await Promise.all([fetchCandidates(), fetchAllTags()])

  console.log(`Loaded ${candidates.length} candidates.\n`)

  // Set of all canonical slugs — never suggest merging one candidate's tag into another's
  const canonicalSlugs = new Set(candidates.map(c => c.slug))
  const tagBySlug = new Map(allTags.map(t => [t.slug, t]))

  // Build review queue: one entry per candidate that has potential duplicates
  const reviewQueue = []

  for (const candidate of candidates) {
    const canonicalTag = tagBySlug.get(candidate.slug)
    if (!canonicalTag) {
      console.warn(`[WARN] No WP tag found for candidate slug "${candidate.slug}" — skipping`)
      continue
    }

    const candidates_tags_id = candidate.tagID ? parseInt(candidate.tagID) : null

    const similar = allTags.filter(tag => {
      if (tag.id === canonicalTag.id) return false
      if (canonicalSlugs.has(tag.slug) && tag.slug !== candidate.slug) return false // another candidate's tag
      return isSlugSimilar(tag.slug, candidate.slug) || isNameSimilar(tag.name, candidate)
    })

    if (similar.length > 0) {
      reviewQueue.push({ candidate, canonicalTag, similar })
    }
  }

  console.log(`Found ${reviewQueue.length} candidate(s) with potential duplicate tags.\n`)
  if (!reviewQueue.length) { rl.close(); return }

  console.log('For each: enter numbers to merge (e.g. "1,3"), "a" for all, "n" to skip, "q" to quit.\n')
  console.log('─'.repeat(60))

  const approved = []

  for (let i = 0; i < reviewQueue.length; i++) {
    const { candidate, canonicalTag, similar } = reviewQueue[i]

    console.log(`\n[${i + 1}/${reviewQueue.length}] ${candidate.ballotName}`)
    console.log(`  Legal name: ${candidate.firstName} ${candidate.lastName}`)
    console.log(`  Surviving tag: ${canonicalTag.slug} — "${canonicalTag.name}" (${canonicalTag.count} posts)`)
    console.log(`  Possible duplicates:`)
    similar.forEach((tag, idx) => {
      const reason = isNameSimilar(tag.name, candidate) ? 'name match' : 'slug match'
      console.log(`    ${idx + 1}. ${tag.slug} — "${tag.name}" (${tag.count} posts)  [${reason}]`)
    })

    const answer = (await ask('\n  Merge which? (numbers/a/n/q): ')).trim().toLowerCase()
    if (answer === 'q') break
    if (answer === 'n' || !answer) { console.log('─'.repeat(60)); continue }

    let selected
    if (answer === 'a') {
      selected = similar
    } else {
      const indices = answer.split(',').map(s => parseInt(s.trim()) - 1).filter(n => !isNaN(n) && n >= 0 && n < similar.length)
      selected = indices.map(n => similar[n])
    }

    if (selected.length) {
      approved.push({
        surviving: canonicalTag.slug,
        duplicates: selected.map(t => t.slug).join(','),
      })
      console.log(`  ✓ Will merge: ${selected.map(t => t.slug).join(', ')} → ${canonicalTag.slug}`)
    }

    console.log('─'.repeat(60))
  }

  rl.close()

  if (!approved.length) {
    console.log('\nNothing approved — no file written.')
    return
  }

  const csv = stringify(approved, { header: true, columns: ['surviving', 'duplicates'] })
  fs.writeFileSync(OUTPUT_PATH, csv, 'utf-8')
  console.log(`\nWrote ${approved.length} group(s) to ${OUTPUT_PATH}`)
  console.log('Paste the contents into your merge-tags Google Sheet, then run merge-tags.mjs.')
}

main().catch(err => { console.error(err); rl.close(); process.exit(1) })
