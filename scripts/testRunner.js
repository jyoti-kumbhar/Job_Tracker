// Standalone Node.js unit test runner for Job Tracker logic
const fs = require('fs');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
}

console.log('\n--- JOB TRACKER FUNCTIONAL LOGIC SUITE ---');

// 1. Validation Logic
console.log('\n[1] Form & URL Validation');
function isValidUrl(url) {
  if (!url || !url.trim()) return true;
  try {
    const trimmed = url.trim();
    const formatted = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
    const parsed = new URL(formatted);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function formatUrl(url) {
  if (!url || !url.trim()) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

assert(isValidUrl('https://linkedin.com/jobs'), 'Valid HTTPS URL');
assert(isValidUrl('google.com'), 'URL without scheme is valid when formatted');
assert(!isValidUrl('invalid-url-:::'), 'Malformed URL rejected');
assert(formatUrl('indeed.com') === 'https://indeed.com', 'formatUrl prepends https://');

// 2. Date & Upcoming Deadline Logic
console.log('\n[2] Date Utilities & Approaching Deadlines');
function isDeadlineApproaching(deadlineStr) {
  if (!deadlineStr) return false;
  const deadline = new Date(deadlineStr);
  if (isNaN(deadline.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = (deadline.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return diffDays >= 0 && diffDays <= 3;
}

const nearDate = new Date();
nearDate.setDate(nearDate.getDate() + 2);
const nearDateStr = nearDate.toISOString().split('T')[0];

const farDate = new Date();
farDate.setDate(farDate.getDate() + 10);
const farDateStr = farDate.toISOString().split('T')[0];

assert(isDeadlineApproaching(nearDateStr) === true, 'Deadline within 2 days detected as approaching');
assert(isDeadlineApproaching(farDateStr) === false, 'Deadline 10 days away is not approaching');

// 3. Statistics Calculation Logic
console.log('\n[3] Dynamic Statistics Calculation');
function calculateStatistics(apps) {
  let applied = 0, interview = 0, offer = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = [];

  for (const app of apps) {
    if (app.status === 'applied') applied++;
    if (app.status === 'interview') interview++;
    if (app.status === 'offer') offer++;
    if (app.deadline) {
      const d = new Date(app.deadline);
      if (!isNaN(d.getTime()) && d >= today) upcoming.push(app.deadline);
    }
  }

  if (upcoming.length > 0) {
    upcoming.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }

  return {
    total: apps.length,
    applied,
    interview,
    offer,
    nextDeadline: upcoming[0],
  };
}

const mockApps = [
  { company: 'Acme', role: 'Dev', status: 'applied', deadline: nearDateStr },
  { company: 'Beta', role: 'Dev', status: 'interview' },
  { company: 'Gamma', role: 'Dev', status: 'offer' },
  { company: 'Delta', role: 'Dev', status: 'saved' },
];

const stats = calculateStatistics(mockApps);
assert(stats.total === 4, 'Total applications counted correctly');
assert(stats.applied === 1, 'Applied applications counted correctly');
assert(stats.interview === 1, 'Interview applications counted correctly');
assert(stats.offer === 1, 'Offer applications counted correctly');
assert(stats.nextDeadline === nearDateStr, 'Earliest upcoming deadline identified');

// 4. Import & Export Validation Logic
console.log('\n[4] Data Import & Export Payload Validation');
function validateImportData(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { validApplications: [], invalidCount: 0, error: 'Invalid JSON format.' };
  }

  let rawList = [];
  if (Array.isArray(parsed)) rawList = parsed;
  else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.applications)) rawList = parsed.applications;
  else return { validApplications: [], invalidCount: 0, error: 'Unrecognized structure.' };

  const valid = [];
  let invalidCount = 0;
  for (const item of rawList) {
    if (!item || typeof item !== 'object') { invalidCount++; continue; }
    const company = typeof item.company === 'string' ? item.company.trim() : '';
    const role = typeof item.role === 'string' ? item.role.trim() : '';
    if (!company || !role) { invalidCount++; continue; }
    valid.push({ company, role, status: item.status || 'saved' });
  }

  return { validApplications: valid, invalidCount };
}

const validExport = JSON.stringify({ version: '1.0.0', applications: [{ company: 'Test', role: 'Role' }] });
const importRes = validateImportData(validExport);
assert(importRes.validApplications.length === 1, 'Import parses valid backup JSON cleanly');

const corruptedImport = validateImportData('{ invalid json ');
assert(corruptedImport.error === 'Invalid JSON format.', 'Import rejects corrupted JSON string cleanly');

console.log('\n===================================================');
console.log('ALL FUNCTIONAL LOGIC UNIT TESTS PASSED!');
console.log('===================================================\n');
