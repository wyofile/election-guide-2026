import fs from 'fs';
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import PQueue from 'p-queue';

// Load environment variables from the .env file
import 'dotenv/config'; 

// --- CONFIGURATION ---
// The script now pulls securely from your environment variables
const WP_SITE_URL = process.env.WP_SITE_URL; 
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APPLICATION_PASSWORD = process.env.WP_APPLICATION_PASSWORD;
const CSV_FILE_PATH = './scripts/candidate-data.csv'; // Adjusted path for your folder structure

// Add a quick safety check
if (!WP_USERNAME || !WP_APPLICATION_PASSWORD || !WP_SITE_URL) {
  console.error('Error: Missing required WordPress configuration in .env file.');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APPLICATION_PASSWORD}`).toString('base64')}`;

// Configure Rate Limiter (WP limits vary, but 2-3 requests per second is generally highly stable)
const queue = new PQueue({ concurrency: 1, interval: 400, intervalCap: 1 }); 

/**
 * Helper to query a tag ID by its slug string
 */
async function getTagIdBySlug(slug) {
  const url = `${WP_SITE_URL}/wp-json/wp/v2/tags?slug=${encodeURIComponent(slug)}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Authorization': authHeader }
  });

  if (!response.ok) {
    throw new Error(`Failed to lookup slug "${slug}": ${response.statusText}`);
  }

  const data = await response.json();
  // WordPress returns an array. If found, grab the ID from the first matching entry.
  return data.length > 0 ? data[0].id : null;
}

/**
 * Helper to update an existing WordPress tag's slug and name
 */
async function updateTag(tagId, targetSlug, ballotName) {
  const url = `${WP_SITE_URL}/wp-json/wp/v2/tags/${tagId}`;
  
  const response = await fetch(url, {
    method: 'POST', // WP uses POST for structural taxonomy updates
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: ballotName,
      slug: targetSlug
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to update tag ID ${tagId}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.id;
}

/**
 * Helper to create a brand new WordPress tag
 */
async function createTag(targetSlug, ballotName) {
  const url = `${WP_SITE_URL}/wp-json/wp/v2/tags`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: ballotName,
      slug: targetSlug
    })
  });

  if (!response.ok) {
    // Edge case: handle if the tag somehow exists under the target slug already
    const errData = await response.json().catch(() => ({}));
    if (errData.code === 'term_exists') {
      return errData.data.term_id;
    }
    throw new Error(`Failed to create tag "${targetSlug}": ${response.statusText}`);
  }

  const data = await response.json();
  return data.id;
}

/**
 * Main Orchestrator
 */
async function main() {
  console.log('Reading CSV file...');
  const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
  
  // Parse CSV into an array of objects
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`Loaded ${records.length} candidates. Starting processing queue...`);

  const processedRecords = [];

  // Map entries over the rate-limiting queue
  const tasks = records.map((row) => {
    return queue.add(async () => {
      const currentSlug = row.slug ? row.slug.trim() : '';
      const oldTagSlug = row.tag2024 ? row.tag2024.trim() : '';
      const ballotName = row.ballotName ? row.ballotName.trim() : '';

      // Skip row processing entirely if necessary context is missing
      if (!currentSlug || !ballotName) {
        console.warn(`Skipping row due to missing slug or ballotName: ${JSON.stringify(row)}`);
        processedRecords.push(row);
        return;
      }

      try {
        let assignedTagId = null;

        if (oldTagSlug !== '') {
          // --- CASE 1: 2024 Election Veteran ---
          console.log(`[LOOKUP] Searching for old 2024 tag slug: "${oldTagSlug}"...`);
          const existingId = await getTagIdBySlug(oldTagSlug);

          if (existingId) {
            console.log(`[UPDATE] Found old tag ID ${existingId}. Updating name to "${ballotName}" and slug to "${currentSlug}"`);
            assignedTagId = await updateTag(existingId, currentSlug, ballotName);
          } else {
            console.warn(`[WARN] Old tag slug "${oldTagSlug}" not found in WP. Creating a new one instead.`);
            assignedTagId = await createTag(currentSlug, ballotName);
          }
        } else {
          // --- CASE 2: New Candidate ---
          console.log(`[CREATE] Creating brand new tag for "${ballotName}" with slug "${currentSlug}"`);
          assignedTagId = await createTag(currentSlug, ballotName);
        }

        // Save the resulting tag ID back to the record's tagID column
        row.tagID = assignedTagId.toString();

      } catch (error) {
        console.error(`[ERROR] Processing failed for candidate "${ballotName}":`, error.message);
      }

      processedRecords.push(row);
    });
  });

  // Wait for all queued rate-limited jobs to finish
  await Promise.all(tasks);

  console.log('All API jobs completed. Re-writing updated data back to CSV...');
  
  // Convert object array back into string format matching original columns
  const updatedCsvString = stringify(processedRecords, { header: true });
  fs.writeFileSync(CSV_FILE_PATH, updatedCsvString, 'utf-8');

  console.log('CSV file successfully synced and saved!');
}

main().catch(console.error);