import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Header } from '../components/Header';
import { Stats } from '../components/Stats';
import { TabNav, TabType } from '../components/TabNav';
import { SearchForm } from '../components/SearchForm';
import { PortalCard } from '../components/PortalCard';
import { BoardView } from '../components/BoardView';
import { ApplicationFormModal } from '../components/ApplicationFormModal';
import { PrivacyFooter } from '../components/PrivacyFooter';
import { StartingScreen } from '../components/StartingScreen';

import { JobApplication, ApplicationFormData } from '../types/application';
import { SearchParams, JOB_PORTALS } from '../data/portals';
import { useApplications } from '../hooks/useApplications';
import { calculateStatistics } from '../utils/statistics';
import { ApplicationStatus } from '../constants/statuses';
import {
  exportApplicationsToFile,
  pickAndValidateImportFile,
  executeImport,
} from '../services/export';
import {
  hasSeenStartingScreen,
  setSeenStartingScreen,
} from '../services/storage';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [showStartingScreen, setShowStartingScreen] = useState<boolean>(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
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

  // Check if starting screen should be presented on first launch
  useEffect(() => {
    async function checkFirstLaunch() {
      const seen = await hasSeenStartingScreen();
      if (!seen) {
        setIsFirstLaunch(true);
        setShowStartingScreen(true);
      }
    }
    checkFirstLaunch();
  }, []);

  const handleDismissStartingScreen = async () => {
    await setSeenStartingScreen(true);
    setShowStartingScreen(false);
    setIsFirstLaunch(false);
  };

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

  // Search Action: Update search preferences for portal search cards
  const handleSearchSubmit = useCallback(
    async (params: SearchParams) => {
      await updateSearchPrefs(params);
    },
    [updateSearchPrefs]
  );

  // Handle Android Hardware Back Button
  useEffect(() => {
    const onBackPress = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true;
      }
      if (showStartingScreen) {
        setShowStartingScreen(false);
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
  }, [modalVisible, showStartingScreen, activeTab]);

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
      <Header
        onNewEntry={openNewEntryModal}
        onOpenStartingScreen={() => setShowStartingScreen(true)}
      />

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

      {/* Starting Screen / Welcome Guide Modal */}
      <StartingScreen
        visible={showStartingScreen}
        onGetStarted={handleDismissStartingScreen}
        onNewEntry={openNewEntryModal}
        onOpenSearch={() => setActiveTab('search')}
        onOpenBoard={() => setActiveTab('board')}
        onImportBackup={handleImport}
        onClose={() => setShowStartingScreen(false)}
        totalApplications={applications.length}
        activeInterviews={stats.interview}
        totalOffers={stats.offer}
        isFirstLaunch={isFirstLaunch}
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.slate,
  },
});
