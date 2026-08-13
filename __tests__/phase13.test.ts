import { validateApplicationForm, sanitizeApplicationData, isValidUrl, formatUrl, isValidDateString } from '../utils/validation';
import { formatDateDisplay, isDeadlineApproaching, getTodayString } from '../utils/dates';
import { calculateStatistics } from '../utils/statistics';
import { formatExportJson, validateImportData, combineApplications } from '../services/export';
import { formatFilterSummary, getPortalSearchUrls } from '../services/jobSearch';
import { isValidStatus, STATUS_MAP } from '../constants/statuses';
import { JobApplication, ApplicationFormData } from '../types/application';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('Starting Phase 13 Test Suite Execution...\n');

// 1. Validation & Data Sanitization Tests
console.log('1. Testing Validation & Sanitization...');

// Required fields validation
const emptyRes = validateApplicationForm({ company: '', role: '', status: 'saved' });
assert(!emptyRes.isValid, 'Empty company and role should fail validation');
assert(emptyRes.errors.company === 'Company name is required', 'Should report company required');
assert(emptyRes.errors.role === 'Role is required', 'Should report role required');

const validRes = validateApplicationForm({ company: 'Acme Corp', role: 'Frontend Engineer', status: 'applied' });
assert(validRes.isValid, 'Valid application form should pass validation');

// URL formatting & validation
assert(isValidUrl('https://example.com/job'), 'HTTPS URL should be valid');
assert(isValidUrl('http://example.com/job'), 'HTTP URL should be valid');
assert(isValidUrl('example.com/job'), 'URL without scheme should be valid when formatted');
assert(!isValidUrl('invalid-url-string-:::'), 'Malformed URL should be invalid');

assert(formatUrl('google.com') === 'https://google.com', 'formatUrl should prepend https://');
assert(formatUrl('http://google.com') === 'http://google.com', 'formatUrl should preserve existing http://');

// Date String validation
assert(isValidDateString('2026-08-15'), '2026-08-15 should be valid date string');
assert(!isValidDateString('invalid-date'), 'invalid-date should be invalid date string');
assert(!isValidDateString('2026-13-45'), 'Out of range date string should be invalid');

// Sanitization
const sanitized = sanitizeApplicationData({
  company: '  Google  ',
  role: '  Software Engineer  ',
  link: '  linkedin.com/jobs/123  ',
  status: 'interview',
});
assert(sanitized.company === 'Google', 'Company name should be trimmed');
assert(sanitized.role === 'Software Engineer', 'Role should be trimmed');
assert(sanitized.link === 'https://linkedin.com/jobs/123', 'Link should be formatted with https://');

console.log('   ✓ Validation & Sanitization passed!\n');

// 2. Date Utilities Tests
console.log('2. Testing Date Utilities...');

const today = getTodayString();
assert(/^\d{4}-\d{2}-\d{2}$/.test(today), 'getTodayString format should be YYYY-MM-DD');

assert(formatDateDisplay('2026-08-15') === 'Aug 15, 2026', 'formatDateDisplay formatting check');
assert(formatDateDisplay(undefined) === 'Not set', 'formatDateDisplay undefined fallback check');

// Upcoming deadline detection (deadline within 3 days)
const dNear = new Date();
dNear.setDate(dNear.getDate() + 1);
const dNearStr = dNear.toISOString().split('T')[0];

const dFar = new Date();
dFar.setDate(dFar.getDate() + 10);
const dFarStr = dFar.toISOString().split('T')[0];

assert(isDeadlineApproaching(dNearStr) === true, 'Deadline within 3 days should be approaching');
assert(isDeadlineApproaching(dFarStr) === false, 'Deadline 10 days away should not be approaching');
assert(isDeadlineApproaching(undefined) === false, 'Undefined deadline should not be approaching');

console.log('   ✓ Date Utilities passed!\n');

// 3. Dynamic Statistics Calculation Tests
console.log('3. Testing Dashboard Statistics Calculation...');

const testApps: JobApplication[] = [
  { id: '1', company: 'Comp A', role: 'Role A', status: 'saved', createdAt: today, updatedAt: today },
  { id: '2', company: 'Comp B', role: 'Role B', status: 'applied', createdAt: today, updatedAt: today },
  { id: '3', company: 'Comp C', role: 'Role C', status: 'interview', deadline: dNearStr, createdAt: today, updatedAt: today },
  { id: '4', company: 'Comp D', role: 'Role D', status: 'offer', createdAt: today, updatedAt: today },
  { id: '5', company: 'Comp E', role: 'Role E', status: 'rejected', createdAt: today, updatedAt: today },
];

const stats = calculateStatistics(testApps);
assert(stats.total === 5, 'Total stats count check');
assert(stats.applied === 1, 'Applied stats count check');
assert(stats.interview === 1, 'Interview stats count check');
assert(stats.offer === 1, 'Offer stats count check');
assert(stats.nextDeadline === dNearStr, 'Next deadline detection check');

const emptyStats = calculateStatistics([]);
assert(emptyStats.total === 0, 'Empty apps stats count check');
assert(emptyStats.nextDeadline === undefined, 'Empty apps next deadline check');


console.log('   ✓ Statistics Calculation passed!\n');

// 4. Data Export & Import Validation Tests
console.log('4. Testing Export & Import Service...');

const exportedJson = formatExportJson(testApps);
assert(typeof exportedJson === 'string', 'Exported JSON should be string');
assert(exportedJson.includes('"applicationCount": 5'), 'Export JSON payload count check');

// Valid JSON import parsing
const importResult = validateImportData(exportedJson);
assert(importResult.validApplications.length === 5, 'Import valid records count should be 5');
assert(importResult.invalidCount === 0, 'Invalid count should be 0');

// Corrupted JSON import parsing
const corruptedResult = validateImportData('invalid json string {{{');
assert(corruptedResult.validApplications.length === 0, 'Corrupted JSON should yield 0 apps');
assert(corruptedResult.error !== undefined, 'Corrupted JSON should return error message');

// Partial / Malformed records import parsing
const mixedJson = JSON.stringify([
  { company: 'Good Corp', role: 'Dev', status: 'applied' },
  { company: '', role: 'Missing Company' }, // invalid: missing company
  { company: 'Missing Role', role: '' },    // invalid: missing role
  { company: 'Valid 2', role: 'Dev 2', status: 'unknown_status' }, // status defaults to saved
]);
const mixedResult = validateImportData(mixedJson);
assert(mixedResult.validApplications.length === 2, 'Mixed JSON should parse 2 valid applications');
assert(mixedResult.invalidCount === 2, 'Mixed JSON should report 2 invalid items');
assert(mixedResult.validApplications[1].status === 'saved', 'Unknown status should default to saved');

// Combine Applications (Merge vs Replace)
const merged = combineApplications(testApps, [{ id: '1', company: 'New', role: 'Role', status: 'saved', createdAt: today, updatedAt: today }], 'merge');
assert(merged.length === 6, 'Merge should append imported items');
assert(merged[0].id !== merged[1].id, 'Merge mode must resolve duplicate IDs cleanly');

const replaced = combineApplications(testApps, [{ id: '100', company: 'New Only', role: 'Role Only', status: 'offer', createdAt: today, updatedAt: today }], 'replace');
assert(replaced.length === 1, 'Replace mode should substitute existing list');
assert(replaced[0].company === 'New Only', 'Replaced application check');

console.log('   ✓ Export & Import Service passed!\n');

// 5. Job Search & Portal URL Tests
console.log('5. Testing Job Search & External Portal URLs...');

const portalUrls = getPortalSearchUrls({ role: 'Software Engineer', location: 'Remote', jobType: 'fulltime' });
assert(portalUrls.length === 9, 'Should generate search URLs for all 9 job portals');
for (const item of portalUrls) {
  assert(item.url.startsWith('https://'), `Portal ${item.portal.name} URL should start with https://`);
}

const summary = formatFilterSummary({ role: 'React Developer', location: 'New York', workMode: 'remote' });
assert(summary.includes('"React Developer"'), 'Filter summary role check');
assert(summary.includes('in New York'), 'Filter summary location check');
assert(summary.includes('[Remote]'), 'Filter summary work mode check');

console.log('   ✓ Job Search & Portal URLs passed!\n');

// 6. Status Constants Verification
console.log('6. Testing Status Constants & Mapping...');

assert(isValidStatus('saved'), 'saved is a valid status');
assert(isValidStatus('applied'), 'applied is a valid status');
assert(isValidStatus('interview'), 'interview is a valid status');
assert(isValidStatus('offer'), 'offer is a valid status');
assert(isValidStatus('rejected'), 'rejected is a valid status');
assert(!isValidStatus('in_progress'), 'in_progress is not a valid status');

assert(STATUS_MAP.saved.label === 'Saved', 'STATUS_MAP saved label check');
assert(STATUS_MAP.applied.label === 'Applied', 'STATUS_MAP applied label check');
assert(STATUS_MAP.interview.label === 'Interview', 'STATUS_MAP interview label check');
assert(STATUS_MAP.offer.label === 'Offer', 'STATUS_MAP offer label check');
assert(STATUS_MAP.rejected.label === 'Rejected', 'STATUS_MAP rejected label check');

console.log('   ✓ Status Constants & Mapping passed!\n');

console.log('===================================================');
console.log('ALL PHASE 13 FUNCTIONAL TEST SCENARIOS COMPLETED SUCCESSFULLY!');
console.log('===================================================');
