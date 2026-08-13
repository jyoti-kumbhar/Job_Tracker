export interface JobPortal {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  buildSearchUrl: (query: SearchParams) => string;
}

export interface SearchParams {
  role?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  experience?: string;
}

export const JOB_PORTALS: JobPortal[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional network job board',
    baseUrl: 'https://www.linkedin.com/jobs/search/',
    buildSearchUrl: ({ role = '', location = '', jobType = 'any', workMode = 'any', experience = 'any' }) => {
      const q = encodeURIComponent(role.trim());
      const loc = encodeURIComponent(location.trim());
      const params: string[] = [`keywords=${q}`];
      if (location.trim()) params.push(`location=${loc}`);

      if (jobType === 'internship') params.push('f_JT=I');
      else if (jobType === 'fulltime') params.push('f_JT=F');
      else if (jobType === 'parttime') params.push('f_JT=P');

      if (workMode === 'remote') params.push('f_WT=2');
      else if (workMode === 'onsite') params.push('f_WT=1');
      else if (workMode === 'hybrid') params.push('f_WT=3');

      const expMap: Record<string, string> = {
        internship: '1',
        entry: '2',
        mid: '4',
        senior: '4',
        lead: '5',
      };
      if (expMap[experience]) params.push(`f_E=${expMap[experience]}`);

      return `https://www.linkedin.com/jobs/search/?${params.join('&')}`;
    },
  },
  {
    id: 'indeed',
    name: 'Indeed',
    description: 'Large general job aggregator',
    baseUrl: 'https://www.indeed.com/jobs',
    buildSearchUrl: ({ role = '', location = '', jobType = 'any', workMode = 'any', experience = 'any' }) => {
      const q = encodeURIComponent(role.trim());
      const loc = encodeURIComponent(location.trim());
      const params: string[] = [`q=${q}`];
      if (location.trim()) params.push(`l=${loc}`);

      if (jobType === 'internship') params.push('jt=internship');
      else if (jobType === 'fulltime') params.push('jt=fulltime');
      else if (jobType === 'parttime') params.push('jt=parttime');

      if (workMode === 'remote') params.push('remotejob=032b3046-06a3-4876-8dfd-474eb5e7ed11');

      const expMap: Record<string, string> = {
        entry: 'entry_level',
        mid: 'mid_level',
        senior: 'senior_level',
        lead: 'senior_level',
      };
      if (expMap[experience]) params.push(`explvl=${expMap[experience]}`);

      return `https://www.indeed.com/jobs?${params.join('&')}`;
    },
  },
  {
    id: 'naukri',
    name: 'Naukri',
    description: "India's largest job portal",
    baseUrl: 'https://www.naukri.com/',
    buildSearchUrl: ({ role = '', location = '', workMode = 'any' }) => {
      const cleanRole = (role.trim() || 'jobs').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const cleanLoc = location.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let path = `https://www.naukri.com/${cleanRole || 'jobs'}-jobs`;
      if (cleanLoc) {
        path += `-in-${cleanLoc}`;
      }
      if (workMode === 'remote') {
        path += '?wfhType=2';
      }
      return path;
    },
  },
  {
    id: 'internshala',
    name: 'Internshala',
    description: 'India internships & fresher jobs',
    baseUrl: 'https://internshala.com/jobs/',
    buildSearchUrl: ({ role = '', jobType = 'any' }) => {
      const section = (jobType === 'fulltime' || jobType === 'parttime') ? 'jobs' : 'internships';
      const cleanKeyword = encodeURIComponent(role.trim().replace(/\s+/g, ' '));
      return `https://internshala.com/${section}/keywords-${cleanKeyword}`;
    },
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    description: 'Listings plus company reviews & pay',
    baseUrl: 'https://www.glassdoor.com/Job/index.htm',
    buildSearchUrl: ({ role = '', location = '' }) => {
      const q = encodeURIComponent(role.trim());
      const loc = encodeURIComponent(location.trim());
      const params: string[] = [`sc.keyword=${q}`];
      if (location.trim()) {
        params.push('locT=C');
        params.push(`locKeyword=${loc}`);
      }
      return `https://www.glassdoor.com/Job/jobs.htm?${params.join('&')}`;
    },
  },
  {
    id: 'ziprecruiter',
    name: 'ZipRecruiter',
    description: 'Broad listings, quick apply',
    baseUrl: 'https://www.ziprecruiter.com/jobs',
    buildSearchUrl: ({ role = '', location = '' }) => {
      const q = encodeURIComponent(role.trim());
      const loc = encodeURIComponent(location.trim());
      const params: string[] = [`search=${q}`];
      if (location.trim()) params.push(`location=${loc}`);
      return `https://www.ziprecruiter.com/candidate/search?${params.join('&')}`;
    },
  },
  {
    id: 'monster',
    name: 'Monster',
    description: 'Established global job board',
    baseUrl: 'https://www.monster.com/jobs/search',
    buildSearchUrl: ({ role = '', location = '' }) => {
      const q = encodeURIComponent(role.trim());
      const loc = encodeURIComponent(location.trim());
      const params: string[] = [`q=${q}`];
      if (location.trim()) params.push(`where=${loc}`);
      return `https://www.monster.com/jobs/search?${params.join('&')}`;
    },
  },
  {
    id: 'wellfound',
    name: 'Wellfound',
    description: 'Startup & tech roles (via search)',
    baseUrl: 'https://wellfound.com/jobs',
    buildSearchUrl: ({ role = '', location = '' }) => {
      const wfQuery = encodeURIComponent(`${role.trim()} ${location.trim()} site:wellfound.com`.trim());
      return `https://www.google.com/search?q=${wfQuery}`;
    },
  },
  {
    id: 'googlejobs',
    name: 'Google Jobs',
    description: 'Aggregated postings from many sites',
    baseUrl: 'https://www.google.com/search?q=jobs',
    buildSearchUrl: ({ role = '', location = '' }) => {
      const query = encodeURIComponent(`${role.trim() || 'jobs'} jobs ${location.trim()}`.trim());
      return `https://www.google.com/search?q=${query}`;
    },
  },
];

