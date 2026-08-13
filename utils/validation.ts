import { ApplicationFormData } from '../types/application';

export function isValidUrl(url?: string): boolean {
  if (!url || !url.trim()) return true; // Link is optional
  try {
    const trimmed = url.trim();
    const formatted = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
    const parsed = new URL(formatted);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function formatUrl(url?: string): string | undefined {
  if (!url || !url.trim()) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export function sanitizeApplicationData(data: ApplicationFormData): ApplicationFormData {
  return {
    ...data,
    company: data.company.trim(),
    role: data.role.trim(),
    link: data.link ? formatUrl(data.link) : undefined,
    appliedDate: data.appliedDate?.trim() || undefined,
    deadline: data.deadline?.trim() || undefined,
    notes: data.notes?.trim() || undefined,
  };
}

export function isValidDateString(dateStr?: string): boolean {
  if (!dateStr || !dateStr.trim()) return true;
  const trimmed = dateStr.trim();
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(trimmed)) return false;
  const date = new Date(trimmed);
  return !isNaN(date.getTime());
}

export function validateApplicationForm(data: ApplicationFormData): ValidationResult {
  const errors: { [key: string]: string } = {};

  if (!data.company || !data.company.trim()) {
    errors.company = 'Company name is required';
  }

  if (!data.role || !data.role.trim()) {
    errors.role = 'Role is required';
  }

  if (data.link && data.link.trim() && !isValidUrl(data.link)) {
    errors.link = 'Please enter a valid web URL (e.g. https://company.com/job)';
  }

  if (data.appliedDate && data.appliedDate.trim() && !isValidDateString(data.appliedDate)) {
    errors.appliedDate = 'Please enter a valid date in YYYY-MM-DD format (e.g. 2026-08-12)';
  }

  if (data.deadline && data.deadline.trim() && !isValidDateString(data.deadline)) {
    errors.deadline = 'Please enter a valid date in YYYY-MM-DD format (e.g. 2026-08-20)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

