import 'dotenv/config';
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

const primaryContributionsPath = path.join(__dirname, './primary-contributions_8-17-26.csv')
const primaryExpendituresPath = path.join(__dirname, './primary-expenditures_8-17-26.csv')

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
const campaignFinanceMetaPath = path.join(__dirname, '../src/data/campaign-finance-meta.json');

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

const primaryContributionsString = fs.readFileSync(primaryContributionsPath, 'utf-8');
const primaryContributionsData = parse(primaryContributionsString, {columns: true, bom: true});

const primaryExpendituresString = fs.readFileSync(primaryExpendituresPath, 'utf-8');
const primaryExpendituresData = parse(primaryExpendituresString, {columns: true, bom: true});

// The state's raw exports have inconsistent leading/trailing/doubled
// whitespace in the name columns (e.g. "OCEAN ANDREW " or "ANDREW,  OCEAN"),
// which would otherwise cause the same person/committee to be treated as
// two different keys. Clean it here so any future CSV replacement gets the
// same treatment automatically, not just this one dated export.
const cleanWhitespace = (str) => (str || '').trim().replace(/\s+/g, ' ');
const cleanColumns = (rows, columns) => {
  for (const row of rows) {
    for (const column of columns) {
      if (column in row) {
        row[column] = cleanWhitespace(row[column]);
      }
    }
  }
};
cleanColumns(primaryContributionsData, ['Contributor Name', 'Recipient Name']);
cleanColumns(primaryExpendituresData, ['Filer Name', 'Payee']);

// Campaign finance: match candidates to contribution/expenditure rows by
// committeeName, which mirrors either the candidate's committee name or (if
// they have none) their own name as formatted in the WY campaign finance
// system's "Recipient Name" / "Filer Name" columns.
const FEDERAL_OFFICES = new Set(['us-sen', 'us-house']); // file with the FEC, not on this report

// The contributions/expenditures CSVs are named for the date they were
// exported from the state's system, e.g. "primary-contributions_8-17-26.csv"
// — pull that date out so the site can show readers how current the numbers are.
const asOfDateMatch = path.basename(primaryContributionsPath).match(/_(\d{1,2})-(\d{1,2})-(\d{2})\.csv$/);
if (!asOfDateMatch) {
  throw new Error(`Could not parse an as-of date from contributions filename: ${primaryContributionsPath}`);
}
const [, asOfMonth, asOfDay, asOfYear] = asOfDateMatch;
const campaignFinanceAsOfDate = `20${asOfYear}-${asOfMonth.padStart(2, '0')}-${asOfDay.padStart(2, '0')}`;

const normalizeName = (str) => (str || '').trim().toUpperCase().replace(/\s+/g, ' ');
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// WY amendment filings pair an "AMEND - ADD" (or original "FILED") row with
// an "AMEND - DELETE" row correcting/superseding it; the delete's amount
// must be subtracted to get an accurate net total.
const signedAmount = (row) => {
  const amount = parseFloat(row['Amount']) || 0;
  return row['Filing Status'] === 'AMEND - DELETE' ? -amount : amount;
};

const groupRowsByName = (rows, nameField) => {
  const map = new Map();
  for (const row of rows) {
    const key = normalizeName(row[nameField]);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(row);
  }
  return map;
};

const contributionsByRecipient = groupRowsByName(primaryContributionsData, 'Recipient Name');
const expendituresByFiler = groupRowsByName(primaryExpendituresData, 'Filer Name');

// Shared by both the WY and FEC paths: cut off at `limit`, but don't
// arbitrarily exclude anyone tied with whoever landed in the last spot —
// a tie past the cutoff is as much a "top contributor" as the one that
// happened to sort in first.
const rankTopContributors = (contributorTotals, limit = 25) => {
  const sorted = [...contributorTotals.values()]
    .filter(({ amount }) => amount > 0)
    .sort((a, b) => b.amount - a.amount);

  let cutoff = limit;
  if (sorted.length > limit) {
    const cutoffAmount = sorted[limit - 1].amount;
    while (cutoff < sorted.length && sorted[cutoff].amount === cutoffAmount) {
      cutoff += 1;
    }
  }

  return sorted.slice(0, cutoff).map(({ name, amount }) => ({ name, amount: round2(amount) }));
};

const getWyCampaignFinance = (candidate) => {
  const key = normalizeName(candidate.committeeName);
  const contributionRows = contributionsByRecipient.get(key) || [];
  const expenditureRows = expendituresByFiler.get(key) || [];

  if (contributionRows.length === 0 && expenditureRows.length === 0) {
    console.warn(`No campaign finance rows found for "${candidate.committeeName}" (${candidate.slug}) — check that committeeName matches the contributions/expenditures CSVs.`);
  }

  const totalContributions = round2(contributionRows.reduce((sum, row) => sum + signedAmount(row), 0));
  const totalExpenditures = round2(expenditureRows.reduce((sum, row) => sum + signedAmount(row), 0));

  // Named contributors are grouped/summed by name like usual. Un-itemized
  // rows are each already an aggregate of sub-$100 donors, so they're summed
  // into one "Unitemized" total. Anonymous rows are individual contributions
  // that just lack a name, so each is kept as its own entry. Either way,
  // the two types never get merged with each other.
  const contributorTotals = new Map();
  let anonymousCount = 0;
  for (const row of contributionRows) {
    let key;
    let name;
    if (row['Contribution Type'] === 'ANONYMOUS') {
      anonymousCount += 1;
      key = `anonymous-${anonymousCount}`;
      name = 'Anonymous';
    } else if (row['Contribution Type'] === 'UN-ITEMIZED') {
      // WY law (W.S. 22-25-106(a)(iv)) doesn't require itemizing contributors
      // giving under $100 in aggregate — this is the sum of all of those.
      key = 'unitemized';
      name = 'Unitemized contributions under $100';
    } else {
      // Group by name + city/state/zip, not just name — two different
      // people can share a name and city (e.g. "Kaufmann" and "Kaufman"
      // showed this can even go the other way), and the zip is the most
      // precise identifier this data gives us to tell them apart.
      const contributorName = normalizeName(row['Contributor Name']);
      const cityStateZip = normalizeName(row['City State Zip ']);
      key = `${contributorName}|${cityStateZip}`;
      name = contributorName;
    }
    const existing = contributorTotals.get(key) || { name, amount: 0 };
    existing.amount += signedAmount(row);
    contributorTotals.set(key, existing);
  }

  const topContributors = rankTopContributors(contributorTotals);

  return { totalContributions, totalExpenditures, topContributors };
};

// --- FEC (federal candidates: us-sen, us-house) ---
// Uses openFEC (api.open.fec.gov). Candidates need an `fecCandidateId` set
// in the Google Sheet (e.g. "S6WY00209") — there's no reliable way to guess
// it from a name alone, so it's a manual lookup via FEC.gov's candidate
// search, same pattern as committeeName for the state data.
const FEC_API_KEY = process.env.FEC_API_KEY || 'DEMO_KEY';
if (!process.env.FEC_API_KEY) {
  console.warn('FEC_API_KEY not set in .env — falling back to the public DEMO_KEY, which is heavily rate-limited and shared by everyone using it.');
}
const FEC_CYCLE = 2026;

const FEC_MAX_RETRIES = 4;

const fetchFec = async (path, params = {}, attempt = 0) => {
  const url = new URL(`https://api.open.fec.gov/v1${path}`);
  url.searchParams.set('api_key', FEC_API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url);

  // This key's actual budget (per its own x-ratelimit-limit header) is much
  // smaller than the "1000/hour" a personal key nominally gets — a single
  // full run of federal candidates can bump right up against it. Back off
  // and retry rather than silently dropping that candidate's data.
  if (res.status === 429 && attempt < FEC_MAX_RETRIES) {
    const retryAfterSeconds = parseInt(res.headers.get('retry-after'), 10);
    const waitMs = Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : 2 ** attempt * 5000;
    console.warn(`FEC API rate-limited on ${path} — waiting ${Math.round(waitMs / 1000)}s and retrying (attempt ${attempt + 1}/${FEC_MAX_RETRIES})...`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return fetchFec(path, params, attempt + 1);
  }

  if (!res.ok) {
    throw new Error(`FEC API request failed (${res.status}): ${path}`);
  }
  return res.json();
};

const getFecCampaignFinance = async (candidate) => {
  const fecId = candidate.fecCandidateId?.trim();
  if (!fecId) {
    console.warn(`No fecCandidateId set for "${candidate.ballotName}" (${candidate.slug}) — add one to the Google Sheet to show federal campaign finance data.`);
    return null;
  }

  try {
    const [totalsData, committeesData] = await Promise.all([
      fetchFec(`/candidate/${fecId}/totals/`, { cycle: FEC_CYCLE }),
      fetchFec(`/candidate/${fecId}/committees/`, { designation: 'P' }),
    ]);

    const totals = totalsData.results?.[0];
    if (!totals) {
      console.warn(`No FEC totals found for "${candidate.ballotName}" (${candidate.slug}, FEC ID ${fecId}) for the ${FEC_CYCLE} cycle.`);
      return null;
    }

    const committeeId = committeesData.results?.[0]?.committee_id;

    const contributorTotals = new Map();
    if (committeeId) {
      const scheduleAData = await fetchFec('/schedules/schedule_a/', {
        committee_id: committeeId,
        two_year_transaction_period: FEC_CYCLE,
        sort: '-contribution_receipt_amount',
        per_page: 100,
      });

      for (const row of scheduleAData.results || []) {
        const name = normalizeName(row.contributor_name);
        const zip = normalizeName(row.contributor_zip);
        const key = `${name}|${zip}`;
        const existing = contributorTotals.get(key) || { name, amount: 0 };
        existing.amount += row.contribution_receipt_amount || 0;
        contributorTotals.set(key, existing);
      }
    }

    // FEC only itemizes individual contributions over $200 in aggregate per
    // cycle — the rest is reported as a single total, same idea as WY's
    // "Unitemized" rows, just a different threshold.
    if (totals.individual_unitemized_contributions) {
      contributorTotals.set('unitemized', { name: 'Unitemized contributions under $200', amount: totals.individual_unitemized_contributions });
    }

    const topContributors = rankTopContributors(contributorTotals);

    return {
      totalContributions: round2(totals.receipts || 0),
      totalExpenditures: round2(totals.disbursements || 0),
      topContributors,
    };
  } catch (err) {
    console.warn(`Failed to fetch FEC data for "${candidate.ballotName}" (${candidate.slug}): ${err.message}`);
    return null;
  }
};

const getCampaignFinance = (candidate) => (
  FEDERAL_OFFICES.has(candidate.office)
    ? getFecCampaignFinance(candidate)
    : getWyCampaignFinance(candidate)
);

// Process Data
// Sequential, not Promise.all — the federal candidates each make 2-3 calls
// to the FEC API, and firing them all at once bursts past FEC's 120
// calls/minute cap even when comfortably under the 1000/hour budget.
const canDataWithResponses = [];
for (const candidate of candidateData) {
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

  const campaignFinance = await getCampaignFinance(candidate);

  canDataWithResponses.push({ ...candidate, responses: candidateResponses, campaignFinance });
}

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
fs.writeFileSync(campaignFinanceMetaPath, JSON.stringify({ asOfDate: campaignFinanceAsOfDate }, null, 2));

console.log('Update complete!');