import fetch from 'node-fetch'
import { parse } from 'csv-parse/sync'
import PQueue from 'p-queue'
import 'dotenv/config'

const WP_SITE_URL = process.env.WP_SITE_URL
const WP_USERNAME = process.env.WP_USERNAME
const WP_APPLICATION_PASSWORD = process.env.WP_APPLICATION_PASSWORD
const MERGE_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSDYcKNMYrhilp-AzZk8cWkO4KGrGtqsrLQlrwPXfJmCeSDqSprcUnbJ9xRmQvY_2XUZ8umNe90xcHv/pub?gid=0&single=true&output=csv'

if (!WP_USERNAME || !WP_APPLICATION_PASSWORD || !WP_SITE_URL) {
  console.error('Error: Missing required WordPress configuration in .env file.')
  process.exit(1)
}

const authHeader = `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APPLICATION_PASSWORD}`).toString('base64')}`
const queue = new PQueue({ concurrency: 3, interval: 1000, intervalCap: 5 })

async function apiFetch(path, options = {}) {
  return queue.add(async () => {
    const url = `${WP_SITE_URL}/wp-json/wp/v2${path}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new Error(`WP API ${options.method || 'GET'} ${path} failed (${response.status}): ${body}`)
    }
    return { data: await response.json(), headers: response.headers }
  })
}

async function getTagBySlug(slug) {
  const { data } = await apiFetch(`/tags?slug=${encodeURIComponent(slug)}`)
  return data.length > 0 ? data[0] : null
}

async function getPostsByTag(tagId) {
  const posts = []
  let page = 1
  while (true) {
    const { data, headers } = await apiFetch(`/posts?tags=${tagId}&per_page=100&page=${page}&_fields=id,tags&status=any`)
    posts.push(...data)
    const totalPages = parseInt(headers.get('X-WP-TotalPages') || '1')
    if (page >= totalPages) break
    page++
  }
  return posts
}

async function updatePostTags(postId, tags) {
  await apiFetch(`/posts/${postId}`, {
    method: 'POST',
    body: JSON.stringify({ tags }),
  })
}

async function deleteTag(tagId) {
  await apiFetch(`/tags/${tagId}?force=true`, { method: 'DELETE' })
}

async function mergeTag(duplicateSlug, survivingId, survivingSlug) {
  const dupTag = await getTagBySlug(duplicateSlug)
  if (!dupTag) {
    console.warn(`  [SKIP] "${duplicateSlug}" not found in WP`)
    return
  }

  const dupId = dupTag.id
  if (dupId === survivingId) {
    console.warn(`  [SKIP] "${duplicateSlug}" resolves to the same tag as "${survivingSlug}" — skipping`)
    return
  }

  console.log(`  [MERGE] "${duplicateSlug}" (${dupId}) → "${survivingSlug}" (${survivingId})`)

  const posts = await getPostsByTag(dupId)
  console.log(`  [POSTS] ${posts.length} post(s) to update`)

  await Promise.all(posts.map(async (post) => {
    const updatedTags = [
      ...post.tags.filter(id => id !== dupId),
      ...(post.tags.includes(survivingId) ? [] : [survivingId]),
    ]
    await updatePostTags(post.id, updatedTags)
    console.log(`    [POST] Updated post ${post.id}`)
  }))

  await deleteTag(dupId)
  console.log(`  [DELETE] Deleted tag "${duplicateSlug}" (${dupId})`)
}

async function main() {
  console.log('Fetching merge CSV from Google Sheets...')
  const csvResponse = await fetch(MERGE_CSV_URL)
  if (!csvResponse.ok) throw new Error(`Failed to fetch CSV (${csvResponse.status})`)
  const csvText = await csvResponse.text()

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  })

  console.log(`Loaded ${records.length} merge group(s) from ${MERGE_CSV_URL}`)

  for (const row of records) {
    const survivingSlug = row.surviving?.trim()
    const duplicateSlugs = (row.duplicates || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    if (!survivingSlug || !duplicateSlugs.length) {
      console.warn(`[SKIP] Row missing surviving or duplicates: ${JSON.stringify(row)}`)
      continue
    }

    console.log(`\n[GROUP] Surviving: "${survivingSlug}" | Duplicates: ${duplicateSlugs.join(', ')}`)

    const survivingTag = await getTagBySlug(survivingSlug)
    if (!survivingTag) {
      console.error(`[ERROR] Surviving tag "${survivingSlug}" not found in WP — skipping group`)
      continue
    }

    for (const dupSlug of duplicateSlugs) {
      await mergeTag(dupSlug, survivingTag.id, survivingSlug)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
