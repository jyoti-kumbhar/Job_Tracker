import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
  BackHandler,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Header } from '../components/Header';
import { Stats } from '../components/Stats';
import { TabNav, TabType } from '../components/TabNav';
import { SearchForm } from '../components/SearchForm';
import { PortalCard } from '../components/PortalCard';
import { JobCard } from '../components/JobCard';
import { BoardView } from '../components/BoardView';
import { ApplicationFormModal } from '../components/ApplicationFormModal';
import { PrivacyFooter } from '../components/PrivacyFooter';

import { JobApplication, ApplicationFormData } from '../types/application';
import { LiveJobItem } from '../types/job';
import { SearchParams, JOB_PORTALS } from '../data/portals';
import { useApplications } from '../hooks/useApplications';
import { calculateStatistics } from '../utils/statistics';
import { ApplicationStatus } from '../constants/statuses';
import { searchLiveJobs } from '../services/liveJobsApi';
import {
  exportApplicationsToFile,
  pickAndValidateImportFile,
  executeImport,
} from '../services/export';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const {
    applications,
    loading,
    searchPrefs,
    addApplication,
    editApplication,
    removeApplication,
    removeAllApplications,
    updateSearchPrefs,
    setApplicationsList,
  } = useApplications();

  // Form modal state
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  // Live Jobs state
  const [liveJobs, setLiveJobs] = useState<LiveJobItem[]>([]);
  const [searchingJobs, setSearchingJobs] = useState<boolean>(false);
  const [liveJobsError, setLiveJobsError] = useState<string | null>(null);
  const [hasSearchedLive, setHasSearchedLive] = useState<boolean>(false);
  const [lastSearchParams, setLastSearchParams] = useState<SearchParams | null>(null);

  // Statistics calculation
  const stats = calculateStatistics(applications);

  // Save or Update application
  const handleSaveApplication = async (data: ApplicationFormData, id?: string) => {
    try {
      if (id) {
        await editApplication(id, data);
      } else {
        await addApplication(data);
      }
    } catch (err: any) {
      Alert.alert('Storage Error', err?.message || 'Failed to save application.');
    }
  };

  // Delete application
  const handleDeleteApplication = async (id: string) => {
    try {
      await removeApplication(id);
    } catch (err: any) {
      Alert.alert('Storage Error', err?.message || 'Failed to delete application.');
    }
  };

  // Delete all applications
  const handleClearAll = async () => {
    try {
      await removeAllApplications();
      Alert.alert('Data Cleared', 'All job applications have been deleted.');
    } catch (err: any) {
      Alert.alert('Storage Error', err?.message || 'Failed to clear applications.');
    }
  };

  // Export JSON file using Android share sheet
  const handleExport = async () => {
    if (applications.length === 0) {
      Alert.alert('Export Data', 'No job applications to export yet. Add some applications first!');
      return;
    }
    try {
      await exportApplicationsToFile(applications);
    } catch (err: any) {
      Alert.alert('Export Error', err?.message || 'Failed to export application data.');
    }
  };

  // Import JSON file with validation and duplicate safety
  const handleImport = async () => {
    try {
      const result = await pickAndValidateImportFile();
      if (!result) {
        // User canceled file picker
        return;
      }

      if (result.error) {
        Alert.alert('Import Error', result.error);
        return;
      }

      if (result.validApplications.length === 0) {
        Alert.alert(
          'No Valid Records Found',
          result.invalidCount > 0
            ? `The file contained ${result.invalidCount} record(s), but none could be validated as job applications.`
            : 'The selected JSON file does not contain any valid job application records.'
        );
        return;
      }

      const { validApplications, invalidCount } = result;
      const summaryText =
        `Found ${validApplications.length} valid job application(s)` +
        (invalidCount > 0 ? ` (${invalidCount} invalid record(s) skipped).` : '.');

      if (applications.length === 0) {
        const updated = await executeImport(applications, validApplications, 'replace');
        setApplicationsList(updated);
        Alert.alert('Import Successful', `${summaryText}\n\nSuccessfully imported into your job tracker!`);
      } else {
        Alert.alert(
          'Import Options',
          `${summaryText}\n\nExisting applications: ${applications.length}\n\nChoose how to import:`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Merge with Existing',
              onPress: async () => {
                try {
                  const updated = await executeImport(applications, validApplications, 'merge');
                  setApplicationsList(updated);
                  Alert.alert(
                    'Import Successful',
                    `Merged ${validApplications.length} application(s). Total applications now: ${updated.length}`
                  );
                } catch (err: any) {
                  Alert.alert('Import Error', err?.message || 'Failed to merge applications.');
                }
              },
            },
            {
              text: 'Replace All',
              style: 'destructive',
              onPress: async () => {
                try {
                  const updated = await executeImport(applications, validApplications, 'replace');
                  setApplicationsList(updated);
                  Alert.alert(
                    'Import Successful',
                    `Replaced all existing data with ${validApplications.length} imported application(s).`
                  );
                } catch (err: any) {
                  Alert.alert('Import Error', err?.message || 'Failed to replace applications.');
                }
              },
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert('Import Failed', err?.message || 'An error occurred while picking or parsing the file.');
    }
  };

  // Status Change directly from card/board
  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      await editApplication(id, { status: newStatus });
    } catch (err: any) {
      Alert.alert('Storage Error', err?.message || 'Failed to update application status.');
    }
  };


  // Search Action for Live Job APIs and Search Prefs
  const handleSearchSubmit = useCallback(
    async (params: SearchParams) => {
      await updateSearchPrefs(params);
      setLastSearchParams(params);
      setSearchingJobs(true);
      setLiveJobsError(null);
      setHasSearchedLive(true);

      try {
        const result = await searchLiveJobs(params);
        if (result.error) {
          setLiveJobsError(result.error);
          setLiveJobs([]);
        } else {
          // Check which live jobs are already saved in local tracker
          const savedLinks = new Set(
            applications.map((app) => app.link?.trim().toLowerCase()).filter(Boolean)
          );

          const updatedJobs = result.jobs.map((job) => ({
            ...job,
            isSaved: savedLinks.has(job.url.trim().toLowerCase()),
          }));

          setLiveJobs(updatedJobs);
        }
      } catch {
        setLiveJobsError('Network request failed. Please check your internet connection.');
        setLiveJobs([]);
      } finally {
        setSearchingJobs(false);
      }
    },
    [applications, updateSearchPrefs]
  );

  // Retry searching live jobs
  const handleRetrySearch = () => {
    if (lastSearchParams) {
      handleSearchSubmit(lastSearchParams);
    } else {
      handleSearchSubmit(searchPrefs);
    }
  };

  // Save live job listing directly to local application tracker
  const handleSaveLiveJob = async (job: LiveJobItem) => {
    try {
      await handleSaveApplication({
        company: job.company,
        role: job.title,
        link: job.url,
        status: 'saved',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: `Saved from live listings (${job.source})`,
      });

      // Update card UI to saved state
      setLiveJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isSaved: true } : j))
      );
    } catch {
      Alert.alert('Error', 'Failed to save job to tracker');
    }
  };

  // Handle Android Hardware Back Button
  useEffect(() => {
    const onBackPress = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true;
      }
      if (activeTab === 'board') {
        setActiveTab('search');
        return true;
      }
      return false;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSubscription.remove();
  }, [modalVisible, activeTab]);

  const openNewEntryModal = () => {
    setEditingApp(null);
    setModalVisible(true);
  };

  const openEditEntryModal = (app: JobApplication) => {
    setEditingApp(app);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <Header onNewEntry={openNewEntryModal} />

      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard Statistics */}
        <Stats stats={stats} />

        {/* Tab Navigation */}
        <TabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          savedCount={applications.length}
        />

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.brand} />
            <Text style={styles.loadingText}>Loading applications...</Text>
          </View>
        ) : activeTab === 'search' ? (
          /* SEARCH TAB CONTENT */
          <View style={styles.tabContent}>
            <SearchForm onSearch={handleSearchSubmit} initialParams={searchPrefs} />

            {/* Live Jobs Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  Live listings{' '}
                  <Text style={styles.sectionSubtitle}>
                    — real postings from public job APIs
                  </Text>
                </Text>
                {liveJobs.length > 0 && !searchingJobs && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{liveJobs.length} found</Text>
                  </View>
                )}
              </View>

              {searchingJobs ? (
                <View style={styles.spinnerBox}>
                  <ActivityIndicator size="small" color={Colors.brand} />
                  <Text style={styles.spinnerText}>Fetching open positions across public APIs...</Text>
                </View>
              ) : liveJobsError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorTitle}>Connection Issue</Text>
                  <Text style={styles.errorText}>{liveJobsError}</Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.retryBtn,
                      pressed && styles.retryBtnPressed,
                    ]}
                    onPress={handleRetrySearch}
                    accessibilityRole="button"
                    accessibilityLabel="Retry Live Job Search"
                  >
                    <Text style={styles.retryBtnText}>Retry Search</Text>
                  </Pressable>
                </View>
              ) : liveJobs.length > 0 ? (
                liveJobs.map((job) => (
                  <JobCard key={job.id} job={job} onSave={handleSaveLiveJob} />
                ))
              ) : (
                <View style={styles.emptyNote}>
                  <Text style={styles.emptyNoteText}>
                    {hasSearchedLive
                      ? 'No live postings found matching your search. Try adjusting keywords or location, or search directly on external portals below.'
                      : 'Enter a role or keywords above and tap "Generate Search URLs" to fetch live job postings.'}
                  </Text>
                </View>
              )}
            </View>

            {/* Portal Search Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Search directly on major portals{' '}
                <Text style={styles.sectionSubtitle}>
                  — open pre-filled search on portal websites
                </Text>
              </Text>
              {JOB_PORTALS.map((portal) => (
                <PortalCard
                  key={portal.id}
                  portal={portal}
                  searchParams={searchPrefs}
                />
              ))}
            </View>
          </View>
        ) : (
          /* BOARD TAB CONTENT */
          <View style={styles.boardTabContent}>
            <BoardView
              applications={applications}
              onEditApplication={openEditEntryModal}
              onStatusChange={handleStatusChange}
            />
          </View>
        )}

        {/* Privacy & Footer Actions */}
        <PrivacyFooter onExport={handleExport} onImport={handleImport} onClearAll={handleClearAll} />
      </ScrollView>

      {/* Application Form Modal (New / Edit) */}
      <ApplicationFormModal
        visible={modalVisible}
        editingApplication={editingApp}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveApplication}
        onDelete={handleDeleteApplication}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  boardTabContent: {
    paddingTop: 10,
  },
  loadingBox: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: Colors.slate,
    marginTop: 10,
  },
  section: {
    marginTop: 18,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.ink,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.slate,
  },
  badge: {
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  spinnerBox: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
  },
  spinnerText: {
    fontSize: 13,
    color: Colors.slate,
    fontWeight: '500',
  },
  emptyNote: {
    backgroundColor: Colors.tray,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
  },
  emptyNoteText: {
    fontSize: 12.5,
    color: Colors.inkSoft,
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'flex-start',
    gap: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
  },
  errorText: {
    fontSize: 12.5,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  retryBtn: {
    marginTop: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  retryBtnPressed: {
    backgroundColor: '#B91C1C',
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
