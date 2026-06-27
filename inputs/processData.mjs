import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';

// 1. Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Adjust Google Sheets URL to output CSV directly
const CANDIDATE_DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPmJVB9NgM-rrPq34eowXldtaMyWZa-a0NqjBaBiWvTtDa5nZxPqYUtWNLev6UCRUtiUsR48bXlpG5/pub?gid=121135908&single=true&output=csv';

// File Paths
const usSenResponsesPath = path.join(__dirname, './us-sen-responses.csv')
const usHouseResponsesPath = path.join(__dirname, './us-house-responses.csv')
const govResponsesPath = path.join(__dirname, './gov-responses.csv')
const sosResponsesPath = path.join(__dirname, './sos-responses.csv')
const supResponsesPath = path.join(__dirname, './sup-responses.csv')
const treasResponsesPath = path.join(__dirname, './treas-responses.csv')
const audResponsesPath = path.join(__dirname, './aud-responses.csv')
const legResponsesPath = path.join(__dirname, './leg-responses.csv')

// const senHoldoversPath = path.join(__dirname, './senate-holdovers.csv');

const outputFilePath = path.join(__dirname, '../src/data/candidate-data.json')
const usSenQsOutputPath = path.join(__dirname, '../src/data/us-sen-qs.json')
const usHouseQsOutputPath = path.join(__dirname, '../src/data/us-house-qs.json')
const govQsOutputPath = path.join(__dirname, '../src/data/gov-qs.json')
const sosQsOutputPath = path.join(__dirname, '../src/data/sos-qs.json')
const supQsOutputPath = path.join(__dirname, '../src/data/sup-qs.json')
const treasQsOutputPath = path.join(__dirname, '../src/data/treas-qs.json')
const audQsOutputPath = path.join(__dirname, '../src/data/aud-qs.json')
const legQsOutputPath = path.join(__dirname, '../src/data/leg-qs.json')
// const senHoldoversOutputPath = path.join(__dirname, '../src/data/senate-holdovers.json');

const updateTimeFilePath = path.join(__dirname, '../src/data/update-time.json');

// 3. Fetch Candidate Data directly from Google Sheets using top-level await
console.log('Fetching candidate data from Google Sheets...');
const response = await fetch(CANDIDATE_DATA_URL);
if (!response.ok) {
  throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
}
const candidateDataString = await response.text();

// Parse Candidate Data
const candidateData = parse(candidateDataString, {
  columns: true, 
  bom: true, 
  cast: (value, context) => {
    if (value === 'TRUE') {
      return true;
    } else if (value === 'FALSE') {
      return false;
    } else {
      return value;
    }
  }
});

// Read and Parse Local Data
// const senHoldoversString = fs.readFileSync(senHoldoversPath, 'utf-8');
// const senHoldoversData = parse(senHoldoversString, { columns: true, bom: true });

const usSenResponsesString = fs.readFileSync(usSenResponsesPath, 'utf-8');
const usSenResponsesData = parse(usSenResponsesString, {columns: true, bom: true});

const usHouseResponsesString = fs.readFileSync(usHouseResponsesPath, 'utf-8');
const usHouseResponsesData = parse(usHouseResponsesString, {columns: true, bom: true});

const govResponsesString = fs.readFileSync(govResponsesPath, 'utf-8');
const govResponsesData = parse(govResponsesString, {columns: true, bom: true});

const sosResponsesString = fs.readFileSync(sosResponsesPath, 'utf-8');
const sosResponsesData = parse(sosResponsesString, {columns: true, bom: true});

const supResponsesString = fs.readFileSync(supResponsesPath, 'utf-8');
const supResponsesData = parse(supResponsesString, {columns: true, bom: true});

const treasResponsesString = fs.readFileSync(treasResponsesPath, 'utf-8');
const treasResponsesData = parse(treasResponsesString, {columns: true, bom: true});

const audResponsesString = fs.readFileSync(audResponsesPath, 'utf-8');
const audResponsesData = parse(audResponsesString, {columns: true, bom: true});

const legResponsesString = fs.readFileSync(legResponsesPath, 'utf-8');
const legResponsesData = parse(legResponsesString, {columns: true, bom: true});

// Process Data
const canDataWithResponses = candidateData.map((candidate) => {
  let candidateResponses = null;

  if (candidate.office === 'us-sen') {
    candidateResponses = usSenResponsesData.find((response) => response.slug === candidate.slug);
  }

  if (candidate.office === 'us-house') {
    candidateResponses = usHouseResponsesData.find((response) => response.slug === candidate.slug);
  }

  if (candidate.office === 'gov') {
    candidateResponses = govResponsesData.find((response) => response.slug === candidate.slug);
  }

  if (candidate.office === 'sos') {
    candidateResponses = sosResponsesData.find((response) => response.slug === candidate.slug);
  }

  if (candidate.office === 'sup') {
    candidateResponses = supResponsesData.find((response) => response.slug === candidate.slug);
  }

  if (candidate.office === 'treas') {
    candidateResponses = treasResponsesData.find((response) => response.slug === candidate.slug);
  }

  if (candidate.office === 'aud') {
    candidateResponses = audResponsesData.find((response) => response.slug === candidate.slug);
  }

  if (/^[HS]\d{2}$/.test(candidate.office)) {
    candidateResponses = legResponsesData.find((response) => response.slug === candidate.slug);
  }
  
  if (candidateResponses) {
    delete candidateResponses.slug;
    candidateResponses = Object.values(candidateResponses);
  }

  // const getGeneralResults = generalResults.find(r => r.district === candidate.district) || null
  // if (candidate.status === 'active' && getGeneralResults) {
  //   const raceWinner = getGeneralResults.candidates.find(c => c.winner) || null
  //   if (raceWinner) {
  //     if (raceWinner.slug === candidate.slug) {
  //       candidate.status = 'won-general'
  //     } else {
  //       candidate.status = 'lost-general'
  //     }
  //   }
  // }

  return { ...candidate, responses: candidateResponses };
});

// Extract questions from CSV column headers (all columns except 'slug')
const usSenQs = Object.keys(usSenResponsesData[0]).filter(key => key !== 'slug');
const usHouseQs = Object.keys(usHouseResponsesData[0]).filter(key => key !== 'slug');
const govQs = Object.keys(govResponsesData[0]).filter(key => key !== 'slug');
const sosQs = Object.keys(sosResponsesData[0]).filter(key => key !== 'slug');
const supQs = Object.keys(supResponsesData[0]).filter(key => key !== 'slug');
const treasQs = Object.keys(treasResponsesData[0]).filter(key => key !== 'slug');
const audQs = Object.keys(audResponsesData[0]).filter(key => key !== 'slug');
const legQs = Object.keys(legResponsesData[0]).filter(key => key !== 'slug');

// Write Outputs
console.log('Writing output files...');
fs.writeFileSync(outputFilePath, JSON.stringify(canDataWithResponses, null, 2));
fs.writeFileSync(usSenQsOutputPath, JSON.stringify(usSenQs, null, 2));
fs.writeFileSync(usHouseQsOutputPath, JSON.stringify(usHouseQs, null, 2));
fs.writeFileSync(govQsOutputPath, JSON.stringify(govQs, null, 2));
fs.writeFileSync(sosQsOutputPath, JSON.stringify(sosQs, null, 2));
fs.writeFileSync(supQsOutputPath, JSON.stringify(supQs, null, 2));
fs.writeFileSync(treasQsOutputPath, JSON.stringify(treasQs, null, 2));
fs.writeFileSync(audQsOutputPath, JSON.stringify(audQs, null, 2));
fs.writeFileSync(legQsOutputPath, JSON.stringify(legQs, null, 2));

// fs.writeFileSync(senHoldoversOutputPath, JSON.stringify(senHoldoversData, null, 2));
fs.writeFileSync(updateTimeFilePath, JSON.stringify({ updateTime: new Date() }, null, 2));

console.log('Update complete!');