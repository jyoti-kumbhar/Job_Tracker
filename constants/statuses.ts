import { Colors } from './colors';

export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface StatusConfig {
  id: ApplicationStatus;
  label: string;
  color: string;
  bgColor: string;
}

export const STATUS_LIST: StatusConfig[] = [
  { id: 'saved', label: 'Saved', color: Colors.statusSaved, bgColor: Colors.statusSavedBg },
  { id: 'applied', label: 'Applied', color: Colors.statusApplied, bgColor: Colors.statusAppliedBg },
  { id: 'interview', label: 'Interview', color: Colors.statusInterview, bgColor: Colors.statusInterviewBg },
  { id: 'offer', label: 'Offer', color: Colors.statusOffer, bgColor: Colors.statusOfferBg },
  { id: 'rejected', label: 'Rejected', color: Colors.statusRejected, bgColor: Colors.statusRejectedBg },
];

export const STATUS_MAP: Record<ApplicationStatus, StatusConfig> = {
  saved: STATUS_LIST[0],
  applied: STATUS_LIST[1],
  interview: STATUS_LIST[2],
  offer: STATUS_LIST[3],
  rejected: STATUS_LIST[4],
};

export function getStatusConfig(status: ApplicationStatus): StatusConfig {
  return STATUS_MAP[status] || STATUS_MAP.saved;
}

export function getStatusLabel(status: ApplicationStatus): string {
  return getStatusConfig(status).label;
}

export function isValidStatus(status: string): status is ApplicationStatus {
  return STATUS_LIST.some((s) => s.id === status);
}

