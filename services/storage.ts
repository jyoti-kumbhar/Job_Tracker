import AsyncStorage from '@react-native-async-storage/async-storage';
import { JobApplication, ApplicationFormData } from '../types/application';
import { isValidStatus } from '../constants/statuses';

const STORAGE_KEY = '@job_tracker_applications';
const SEARCH_PREFS_KEY = '@job_tracker_search_prefs';

/**
 * Validates whether an unknown item matches the JobApplication shape.
 */
function isValidJobApplication(item: unknown): item is JobApplication {
  if (!item || typeof item !== 'object') return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    obj.id.trim().length > 0 &&
    typeof obj.company === 'string' &&
    obj.company.trim().length > 0 &&
    typeof obj.role === 'string' &&
    obj.role.trim().length > 0 &&
    typeof obj.status === 'string' &&
    isValidStatus(obj.status)
  );
}

/**
 * Retrieves all saved job applications from AsyncStorage.
 * Gracefully handles read errors, invalid JSON, and corrupted records.
 */
export async function getApplications(): Promise<JobApplication[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!jsonValue) return [];

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonValue);
    } catch (parseError) {
      console.error('Storage JSON parse error, data corrupted:', parseError);
      // Clean up corrupted storage key to prevent persistent crashes
      await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      return [];
    }

    if (!Array.isArray(parsed)) {
      console.warn('Storage data corrupted: expected an array but got non-array value.');
      await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      return [];
    }

    const validApps: JobApplication[] = [];
    let hasCorrupted = false;

    for (const item of parsed) {
      if (isValidJobApplication(item)) {
        validApps.push(item);
      } else {
        hasCorrupted = true;
        console.warn('Skipping corrupted job application record:', item);
      }
    }

    // Self-heal storage if corrupted items were filtered out
    if (hasCorrupted) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validApps)).catch(() => {});
    }

    return validApps;
  } catch (e) {
    console.error('Error loading applications from storage:', e);
    return [];
  }
}

/**
 * Retrieves a single job application by ID.
 */
export async function getApplication(id: string): Promise<JobApplication | null> {
  try {
    const apps = await getApplications();
    return apps.find((app) => app.id === id) || null;
  } catch (e) {
    console.error(`Error loading application ${id}:`, e);
    return null;
  }
}

/**
 * Saves a new job application to AsyncStorage.
 */
export async function saveApplication(data: ApplicationFormData): Promise<JobApplication> {
  try {
    const apps = await getApplications();
    const now = new Date().toISOString();
    const newApp: JobApplication = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const updatedApps = [newApp, ...apps];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApps));
    return newApp;
  } catch (e) {
    console.error('Error saving application to storage:', e);
    throw new Error('Failed to save application to device storage. Storage may be full or inaccessible.');
  }
}

/**
 * Updates an existing job application by ID.
 */
export async function updateApplication(
  id: string,
  updates: Partial<ApplicationFormData>
): Promise<JobApplication | null> {
  try {
    const apps = await getApplications();
    const index = apps.findIndex((app) => app.id === id);
    if (index === -1) return null;

    const updatedApp: JobApplication = {
      ...apps[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    apps[index] = updatedApp;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    return updatedApp;
  } catch (e) {
    console.error(`Error updating application ${id}:`, e);
    throw new Error(`Failed to update application. Storage error occurred.`);
  }
}

/**
 * Deletes a single job application by ID.
 */
export async function deleteApplication(id: string): Promise<boolean> {
  try {
    const apps = await getApplications();
    const filtered = apps.filter((app) => app.id !== id);
    if (filtered.length === apps.length) return false;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error(`Error deleting application ${id}:`, e);
    throw new Error(`Failed to delete application from device storage.`);
  }
}

/**
 * Clears all job applications from AsyncStorage.
 */
export async function deleteAllApplications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error deleting all applications:', e);
    throw new Error('Failed to clear applications from device storage.');
  }
}

/**
 * Overwrites all job applications in AsyncStorage with the provided array.
 */
export async function saveAllApplications(apps: JobApplication[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    console.error('Error saving all applications:', e);
    throw new Error('Failed to update applications list in device storage.');
  }
}

/**
 * Saves user search filter preferences to AsyncStorage.
 */
export async function saveSearchPreferences(prefs: Record<string, string>): Promise<void> {
  try {
    await AsyncStorage.setItem(SEARCH_PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Error saving search preferences:', e);
  }
}

export const saveSearchPrefs = saveSearchPreferences;

/**
 * Loads user search filter preferences from AsyncStorage.
 * Gracefully handles corrupted JSON or non-object values.
 */
export async function getSearchPreferences(): Promise<Record<string, string>> {
  try {
    const jsonValue = await AsyncStorage.getItem(SEARCH_PREFS_KEY);
    if (!jsonValue) return {};

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonValue);
    } catch {
      await AsyncStorage.removeItem(SEARCH_PREFS_KEY).catch(() => {});
      return {};
    }

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
    return {};
  } catch (e) {
    console.error('Error loading search preferences:', e);
    return {};
  }
}

export const getSearchPrefs = getSearchPreferences;

