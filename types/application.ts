import { ApplicationStatus } from '../constants/statuses';

export type { ApplicationStatus };

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  link?: string;
  status: ApplicationStatus;
  appliedDate?: string;
  deadline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormData {
  company: string;
  role: string;
  link?: string;
  status: ApplicationStatus;
  appliedDate?: string;
  deadline?: string;
  notes?: string;
}

export interface StatisticsData {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  nextDeadline?: string;
}

