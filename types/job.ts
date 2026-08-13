export interface LiveJobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  source: string;
  url: string;
  publishedAt?: string;
  isSaved?: boolean;
}

export interface LiveJobsFetchResult {
  jobs: LiveJobItem[];
  error?: string;
  sourceCount?: number;
}
