import { useState, useEffect, useCallback } from 'react';
import { JobApplication, ApplicationFormData } from '../types/application';
import { SearchParams } from '../data/portals';
import {
  getApplications,
  saveApplication,
  updateApplication,
  deleteApplication,
  deleteAllApplications,
  getSearchPreferences,
  saveSearchPreferences,
} from '../services/storage';

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchPrefs, setSearchPrefsState] = useState<SearchParams>({
    role: '',
    location: '',
    jobType: 'any',
    workMode: 'any',
    experience: 'any',
  });

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apps = await getApplications();
      setApplications(apps);
      const prefs = await getSearchPreferences();
      if (prefs && Object.keys(prefs).length > 0) {
        setSearchPrefsState((prev) => ({ ...prev, ...prefs }));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load storage data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const addApplication = async (data: ApplicationFormData) => {
    try {
      const created = await saveApplication(data);
      setApplications((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError('Failed to save application');
      throw err;
    }
  };

  const editApplication = async (id: string, updates: Partial<ApplicationFormData>) => {
    try {
      const updated = await updateApplication(id, updates);
      if (updated) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? updated : app))
        );
      }
      return updated;
    } catch (err) {
      setError('Failed to update application');
      throw err;
    }
  };

  const removeApplication = async (id: string) => {
    try {
      const success = await deleteApplication(id);
      if (success) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete application');
      throw err;
    }
  };

  const removeAllApplications = async () => {
    try {
      await deleteAllApplications();
      setApplications([]);
    } catch (err) {
      setError('Failed to clear applications');
      throw err;
    }
  };

  const updateSearchPrefs = async (params: SearchParams) => {
    setSearchPrefsState(params);
    try {
      await saveSearchPreferences(params as Record<string, string>);
    } catch (err) {
      console.error('Failed to persist search preferences:', err);
    }
  };

  const setApplicationsList = (newApps: JobApplication[]) => {
    setApplications(newApps);
  };

  return {
    applications,
    loading,
    error,
    searchPrefs,
    reload: loadAll,
    addApplication,
    editApplication,
    removeApplication,
    removeAllApplications,
    updateSearchPrefs,
    setApplicationsList,
  };
}
