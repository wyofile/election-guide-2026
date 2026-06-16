import fs from 'fs';
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import PQueue from 'p-queue';
import 'dotenv/config'; 

// --- CONFIGURATION ---
const WP_SITE_URL = process.env.WP_SITE_URL; 
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APPLICATION_PASSWORD = process.env.WP_APPLICATION_PASSWORD;
const CSV_FILE_PATH = './inputs/candidate-data.csv'; // Adjust path if needed

// Safety check for credentials
if (!WP_USERNAME || !WP_APPLICATION_PASSWORD || !WP_SITE_URL) {
  console.error('Error: Missing required WordPress configuration in .env file.');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APPLICATION_PASSWORD}`).toString('base64')}`;

// Paced at roughly 3 requests per second to avoid triggering rate limits
const queue = new PQueue({ concurrency: 1, interval: 350, intervalCap: 1 }); 

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
  // Return the ID if found, otherwise return null
  return data.length > 0 ? data[0].id : null;
}

/**
 * Main Orchestrator
 */
async function main() {
  console.log('Reading CSV file...');
  const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`Loaded ${records.length} candidates. Querying WordPress for tag IDs...`);

  const processedRecords = [];

  const tasks = records.map((row) => {
    return queue.add(async () => {
      const currentSlug = row.slug ? row.slug.trim() : '';
      const ballotName = row.ballotName ? row.ballotName.trim() : 'Unknown';

      if (!currentSlug) {
        processedRecords.push(row);
        return;
      }

      try {
        console.log(`[LOOKUP] Fetching ID for candidate: "${ballotName}" (slug: ${currentSlug})...`);
        const tagId = await getTagIdBySlug(currentSlug);

        if (tagId) {
          row.tagID = tagId.toString();
          console.log(`[FOUND] Successfully matched "${currentSlug}" to ID: ${tagId}`);
        } else {
          row.tagID = ''; 
          console.warn(`[NOT FOUND] No WordPress tag found for slug: "${currentSlug}"`);
        }
      } catch (error) {
        console.error(`[ERROR] Failed lookup for "${ballotName}":`, error.message);
      }

      processedRecords.push(row);
    });
  });

  // Wait for all lookups to finish
  await Promise.all(tasks);

  console.log('Writing retrieved IDs back to CSV...');
  
  const updatedCsvString = stringify(processedRecords, { header: true });
  fs.writeFileSync(CSV_FILE_PATH, updatedCsvString, 'utf-8');

  console.log('CSV file successfully updated with tag IDs!');
}

main().catch(console.error);