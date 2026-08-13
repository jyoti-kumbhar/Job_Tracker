import { SearchParams } from '../data/portals';
import { LiveJobItem, LiveJobsFetchResult } from '../types/job';

const FETCH_TIMEOUT_MS = 7000; // 7 seconds timeout per API call

type FetchErrorType = 'network' | 'timeout' | 'http';

interface ApiFetchResult {
  success: boolean;
  jobs: LiveJobItem[];
  errorType?: FetchErrorType;
}

/**
 * Helper to execute fetch with a timeout using AbortController.
 */
async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'JobTrackerApp/1.0',
      },
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      const timeoutErr = new Error('TIMEOUT');
      timeoutErr.name = 'TimeoutError';
      throw timeoutErr;
    }
    throw error;
  }
}

/**
 * Fetch live jobs from Remotive API.
 */
async function fetchRemotiveJobs(query: string): Promise<ApiFetchResult> {
  try {
    const searchUrl = query
      ? `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}`
      : `https://remotive.com/api/remote-jobs?limit=15`;

    const res = await fetchWithTimeout(searchUrl);
    if (!res.ok) {
      return { success: false, jobs: [], errorType: 'http' };
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.jobs)) {
      return { success: true, jobs: [] };
    }

    const jobs = data.jobs.slice(0, 15).map((item: any) => ({
      id: `remotive-${item.id}`,
      title: item.title || 'Untitled Role',
      company: item.company_name || 'Unknown Company',
      location: item.candidate_required_location || 'Remote',
      source: 'REMOTIVE',
      url: item.url || 'https://remotive.com',
      publishedAt: item.publication_date ? item.publication_date.split('T')[0] : undefined,
    }));

    return { success: true, jobs };
  } catch (err: any) {
    const isTimeout = err.name === 'TimeoutError' || err.message === 'TIMEOUT';
    return {
      success: false,
      jobs: [],
      errorType: isTimeout ? 'timeout' : 'network',
    };
  }
}

/**
 * Fetch live jobs from Arbeitnow API.
 */
async function fetchArbeitnowJobs(): Promise<ApiFetchResult> {
  try {
    const res = await fetchWithTimeout('https://www.arbeitnow.com/api/job-board-api');
    if (!res.ok) {
      return { success: false, jobs: [], errorType: 'http' };
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.data)) {
      return { success: true, jobs: [] };
    }

    const jobs = data.data.slice(0, 15).map((item: any) => ({
      id: `arbeitnow-${item.slug || Math.random().toString(36).substring(7)}`,
      title: item.title || 'Untitled Role',
      company: item.company_name || 'Unknown Company',
      location: item.location || (item.remote ? 'Remote' : 'Location Not Specified'),
      source: 'ARBEITNOW',
      url: item.url || 'https://www.arbeitnow.com',
      publishedAt: item.created_at ? new Date(item.created_at * 1000).toISOString().split('T')[0] : undefined,
    }));

    return { success: true, jobs };
  } catch (err: any) {
    const isTimeout = err.name === 'TimeoutError' || err.message === 'TIMEOUT';
    return {
      success: false,
      jobs: [],
      errorType: isTimeout ? 'timeout' : 'network',
    };
  }
}

/**
 * Fetch live jobs from Jobicy API.
 */
async function fetchJobicyJobs(query: string): Promise<ApiFetchResult> {
  try {
    const searchUrl = query
      ? `https://jobicy.com/api/v2/remote-jobs?count=15&industry=${encodeURIComponent(query)}`
      : `https://jobicy.com/api/v2/remote-jobs?count=15`;

    const res = await fetchWithTimeout(searchUrl);
    if (!res.ok) {
      return { success: false, jobs: [], errorType: 'http' };
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.jobs)) {
      return { success: true, jobs: [] };
    }

    const jobs = data.jobs.slice(0, 15).map((item: any) => ({
      id: `jobicy-${item.id || Math.random().toString(36).substring(7)}`,
      title: item.jobTitle || 'Untitled Role',
      company: item.companyName || 'Unknown Company',
      location: item.jobGeo || 'Remote',
      source: 'JOBICY',
      url: item.url || 'https://jobicy.com',
      publishedAt: item.pubDate ? item.pubDate.split(' ')[0] : undefined,
    }));

    return { success: true, jobs };
  } catch (err: any) {
    const isTimeout = err.name === 'TimeoutError' || err.message === 'TIMEOUT';
    return {
      success: false,
      jobs: [],
      errorType: isTimeout ? 'timeout' : 'network',
    };
  }
}

/**
 * Main API service method to search live job postings across public APIs.
 */
export async function searchLiveJobs(params: SearchParams): Promise<LiveJobsFetchResult> {
  const query = (params.role || '').trim();
  const locationFilter = (params.location || '').trim().toLowerCase();
  const jobTypeFilter = params.jobType || 'any';
  const workModeFilter = params.workMode || 'any';

  if (!query && !locationFilter && jobTypeFilter === 'any' && workModeFilter === 'any') {
    return {
      jobs: [],
      error: undefined,
    };
  }

  try {
    // Query multiple public APIs concurrently
    const results = await Promise.allSettled([
      fetchRemotiveJobs(query),
      fetchArbeitnowJobs(),
      fetchJobicyJobs(query),
    ]);

    const apiResponses: ApiFetchResult[] = results.map((res) =>
      res.status === 'fulfilled'
        ? res.value
        : { success: false, jobs: [], errorType: 'network' }
    );

    let allJobs: LiveJobItem[] = [];
    let successCount = 0;

    const errorTypes: FetchErrorType[] = [];

    for (const res of apiResponses) {
      if (res.success) {
        successCount++;
        allJobs.push(...res.jobs);
      } else if (res.errorType) {
        errorTypes.push(res.errorType);
      }
    }

    // If ALL APIs failed (0 succeeded)
    if (successCount === 0 && errorTypes.length > 0) {
      const hasTimeout = errorTypes.includes('timeout');
      const hasNetwork = errorTypes.includes('network');

      if (hasNetwork && !hasTimeout) {
        return {
          jobs: [],
          error: 'No internet connection detected. Please check your network connection and try again.',
        };
      }
      if (hasTimeout) {
        return {
          jobs: [],
          error: 'Connection timed out while fetching live jobs. Please check your network and try again.',
        };
      }
      return {
        jobs: [],
        error: 'Live job services are currently unavailable. Please try searching directly on external portals below.',
      };
    }

    // Filter jobs client-side by query, location, workMode if provided
    let filteredJobs = allJobs;

    if (query) {
      const q = query.toLowerCase();
      const matchedQuery = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
      );
      if (matchedQuery.length > 0) {
        filteredJobs = matchedQuery;
      }
    }

    if (locationFilter) {
      const locationMatched = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(locationFilter)
      );
      if (locationMatched.length > 0) {
        filteredJobs = locationMatched;
      }
    }

    if (workModeFilter === 'remote') {
      const remoteMatched = filteredJobs.filter(
        (job) =>
          job.location.toLowerCase().includes('remote') ||
          job.source === 'REMOTIVE' ||
          job.source === 'JOBICY'
      );
      if (remoteMatched.length > 0) {
        filteredJobs = remoteMatched;
      }
    }

    // Deduplicate by title + company
    const seen = new Set<string>();
    const uniqueJobs: LiveJobItem[] = [];

    for (const job of filteredJobs) {
      const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(job);
      }
    }

    return {
      jobs: uniqueJobs.slice(0, 20),
      sourceCount: uniqueJobs.length,
    };
  } catch (error) {
    console.error('Error fetching live jobs:', error);
    return {
      jobs: [],
      error: 'An unexpected network error occurred while reaching live job services. Please try again.',
    };
  }
}

