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
const fedResponsesPath = path.join(__dirname, './federal-responses.csv');
const legResponsesPath = path.join(__dirname, './wyo-leg-responses.csv');
// const senHoldoversPath = path.join(__dirname, './senate-holdovers.csv');
const outputFilePath = path.join(__dirname, '../src/data/candidate-data.json');
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

const fedResponsesString = fs.readFileSync(fedResponsesPath, 'utf-8');
const fedResponsesData = parse(fedResponsesString, { columns: true, bom: true });

let legResponsesString = fs.readFileSync(legResponsesPath, 'utf-8');
legResponsesString = legResponsesString.replaceAll("’", "'"); 
const legResponsesData = parse(legResponsesString, { columns: true, bom: true });

// Process Data
const canDataWithResponses = candidateData.map((candidate) => {
  let candidateResponses = null;
  
  // if (candidate.office.slice(0, 2) === 'us' && candidate.hasResponses) {
  //   candidateResponses = fedResponsesData.find((response) => response.slug === candidate.slug);
  // } else if (candidate.hasResponses) {
  //   candidateResponses = legResponsesData.find((response) => response.slug === candidate.slug);
  // }
  
  // if (candidateResponses) {
  //   delete candidateResponses.slug;
  //   candidateResponses = Object.values(candidateResponses);
  // }

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

// Write Outputs
console.log('Writing output files...');
fs.writeFileSync(outputFilePath, JSON.stringify(canDataWithResponses, null, 2));
// fs.writeFileSync(senHoldoversOutputPath, JSON.stringify(senHoldoversData, null, 2));
fs.writeFileSync(updateTimeFilePath, JSON.stringify({ updateTime: new Date() }, null, 2));

console.log('Update complete!');