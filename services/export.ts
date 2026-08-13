import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Share } from 'react-native';
import { JobApplication, ApplicationStatus } from '../types/application';
import { isValidStatus } from '../constants/statuses';
import { saveAllApplications } from './storage';

export interface ExportPayload {
  version: string;
  exportedAt: string;
  applicationCount: number;
  applications: JobApplication[];
}

export interface ValidationResult {
  validApplications: JobApplication[];
  invalidCount: number;
  error?: string;
}

export type ImportMode = 'merge' | 'replace';

/**
 * Generates a unique application ID.
 */
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 7);
}

/**
 * Formats applications array into a structured JSON string with metadata.
 */
export function formatExportJson(applications: JobApplication[]): string {
  const payload: ExportPayload = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    applicationCount: applications.length,
    applications,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Exports job applications to a JSON file and opens the device sharing dialog.
 */
export async function exportApplicationsToFile(applications: JobApplication[]): Promise<boolean> {
  try {
    const jsonString = formatExportJson(applications);
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `job_tracker_backup_${dateStr}.json`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Job Tracker Data',
        UTI: 'public.json',
      });
      return true;
    } else {
      // Fallback to React Native Share
      await Share.share({
        title: 'Job Tracker Backup',
        message: jsonString,
      });
      return true;
    }
  } catch (error) {
    console.error('Error exporting applications:', error);
    throw error;
  }
}

/**
 * Validates imported raw data and converts valid items into JobApplication objects.
 */
export function validateImportData(jsonString: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return {
      validApplications: [],
      invalidCount: 0,
      error: 'Invalid JSON format. Please select a valid backup file.',
    };
  }

  let rawList: unknown[] = [];

  if (Array.isArray(parsed)) {
    rawList = parsed;
  } else if (
    parsed &&
    typeof parsed === 'object' &&
    'applications' in parsed &&
    Array.isArray((parsed as Record<string, unknown>).applications)
  ) {
    rawList = (parsed as Record<string, unknown>).applications as unknown[];
  } else {
    return {
      validApplications: [],
      invalidCount: 0,
      error: 'Unrecognized backup structure. Expected an array of applications or a valid backup file.',
    };
  }

  const validApplications: JobApplication[] = [];
  let invalidCount = 0;
  const now = new Date().toISOString();

  for (const item of rawList) {
    if (!item || typeof item !== 'object') {
      invalidCount++;
      continue;
    }

    const obj = item as Record<string, unknown>;

    // Required fields: company & role
    const company = typeof obj.company === 'string' ? obj.company.trim() : '';
    const role = typeof obj.role === 'string' ? obj.role.trim() : '';

    if (!company || !role) {
      invalidCount++;
      continue;
    }

    // Status validation
    const rawStatus = typeof obj.status === 'string' ? obj.status : '';
    const status: ApplicationStatus = isValidStatus(rawStatus) ? rawStatus : 'saved';

    // Optional fields
    const link = typeof obj.link === 'string' ? obj.link.trim() : undefined;
    const appliedDate = typeof obj.appliedDate === 'string' ? obj.appliedDate.trim() : undefined;
    const deadline = typeof obj.deadline === 'string' ? obj.deadline.trim() : undefined;
    const notes = typeof obj.notes === 'string' ? obj.notes.trim() : undefined;
    const createdAt = typeof obj.createdAt === 'string' ? obj.createdAt : now;
    const updatedAt = typeof obj.updatedAt === 'string' ? obj.updatedAt : now;
    const id = typeof obj.id === 'string' && obj.id.trim() ? obj.id.trim() : generateId();

    const app: JobApplication = {
      id,
      company,
      role,
      status,
      createdAt,
      updatedAt,
      ...(link ? { link } : {}),
      ...(appliedDate ? { appliedDate } : {}),
      ...(deadline ? { deadline } : {}),
      ...(notes ? { notes } : {}),
    };

    validApplications.push(app);
  }

  return {
    validApplications,
    invalidCount,
  };
}

/**
 * Prompts user to pick a JSON file from device storage and parses/validates it.
 */
export async function pickAndValidateImportFile(): Promise<ValidationResult | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const selectedFile = result.assets[0];
    const fileUri = selectedFile.uri;

    const content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return validateImportData(content);
  } catch (error) {
    console.error('Error picking or reading import file:', error);
    return {
      validApplications: [],
      invalidCount: 0,
      error: 'Failed to read the selected file. Please try again.',
    };
  }
}

/**
 * Merges imported applications with existing applications safely based on mode.
 * Prevents duplicate IDs and handles collisions.
 */
export function combineApplications(
  existingApps: JobApplication[],
  importedApps: JobApplication[],
  mode: ImportMode
): JobApplication[] {
  if (mode === 'replace') {
    // Ensure all imported apps have unique IDs among themselves
    const uniqueIds = new Set<string>();
    return importedApps.map((app) => {
      let id = app.id;
      if (uniqueIds.has(id)) {
        id = generateId();
      }
      uniqueIds.add(id);
      return { ...app, id };
    });
  }

  // Merge Mode
  const existingIds = new Set(existingApps.map((app) => app.id));
  const newApps: JobApplication[] = [];

  for (const importedApp of importedApps) {
    let appToInsert = { ...importedApp };
    // If ID collides with an existing application, reassign a fresh unique ID
    if (existingIds.has(appToInsert.id)) {
      appToInsert.id = generateId();
    }
    existingIds.add(appToInsert.id);
    newApps.push(appToInsert);
  }

  return [...newApps, ...existingApps];
}

/**
 * Saves imported applications into storage using the specified mode (merge or replace).
 */
export async function executeImport(
  existingApps: JobApplication[],
  importedApps: JobApplication[],
  mode: ImportMode
): Promise<JobApplication[]> {
  const combined = combineApplications(existingApps, importedApps, mode);
  await saveAllApplications(combined);
  return combined;
}
