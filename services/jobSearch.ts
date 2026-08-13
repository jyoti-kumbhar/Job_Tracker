import { Linking, Alert } from 'react-native';
import { JobPortal, SearchParams, JOB_PORTALS } from '../data/portals';
import { formatUrl, isValidUrl } from '../utils/validation';

/**
 * Opens an external portal search link in the default browser.
 * Handles Android intent linking safely with fallback and error notifications.
 */
export async function openPortalSearch(portal: JobPortal, searchParams: SearchParams): Promise<boolean> {
  const rawUrl = portal.buildSearchUrl(searchParams);
  const url = formatUrl(rawUrl);

  if (!url || !isValidUrl(url)) {
    Alert.alert('Invalid Link', `The search URL generated for ${portal.name} is invalid.`);
    return false;
  }

  try {
    const supported = await Linking.canOpenURL(url).catch(() => false);
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      // Fallback attempt to open URL directly
      await Linking.openURL(url);
      return true;
    }
  } catch (error) {
    console.error(`Failed to open URL for ${portal.name}:`, error);
    Alert.alert(
      'Cannot Open Web Browser',
      `Unable to launch search for ${portal.name}. Please ensure a web browser app is installed on your Android device.`
    );
    return false;
  }
}


/**
 * Generates external portal search URLs for all available portals based on search parameters.
 */
export function getPortalSearchUrls(params: SearchParams): Array<{ portal: JobPortal; url: string }> {
  return JOB_PORTALS.map((portal) => ({
    portal,
    url: portal.buildSearchUrl(params),
  }));
}

/**
 * Formats active search parameters into a readable summary string.
 */
export function formatFilterSummary(params: SearchParams): string {
  const parts: string[] = [];

  if (params.role) parts.push(`"${params.role}"`);
  if (params.location) parts.push(`in ${params.location}`);
  if (params.jobType && params.jobType !== 'any') {
    const typeLabel =
      params.jobType === 'internship'
        ? 'Internship'
        : params.jobType === 'fulltime'
        ? 'Full-time'
        : 'Part-time';
    parts.push(`(${typeLabel})`);
  }
  if (params.workMode && params.workMode !== 'any') {
    const modeLabel =
      params.workMode === 'remote'
        ? 'Remote'
        : params.workMode === 'onsite'
        ? 'On-site'
        : 'Hybrid';
    parts.push(`[${modeLabel}]`);
  }
  if (params.experience && params.experience !== 'any') {
    const expLabel =
      params.experience === 'internship'
        ? 'Intern'
        : params.experience === 'entry'
        ? 'Entry level'
        : params.experience === 'mid'
        ? 'Mid level'
        : params.experience === 'senior'
        ? 'Senior'
        : 'Lead / Manager';
    parts.push(`[${expLabel}]`);
  }

  return parts.length > 0 ? parts.join(' ') : 'All Jobs';
}
