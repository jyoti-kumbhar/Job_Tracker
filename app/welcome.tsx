import React from 'react';
import { useRouter } from 'expo-router';
import { StartingScreen } from '../components/StartingScreen';
import { useApplications } from '../hooks/useApplications';
import { setSeenStartingScreen } from '../services/storage';
import { calculateStatistics } from '../utils/statistics';

export default function WelcomeScreen() {
  const router = useRouter();
  const { applications } = useApplications();
  const stats = calculateStatistics(applications);

  const handleGetStarted = async () => {
    await setSeenStartingScreen(true);
    router.replace('/');
  };

  const handleNewEntry = async () => {
    await setSeenStartingScreen(true);
    router.replace('/application/new');
  };

  const handleOpenSearch = async () => {
    await setSeenStartingScreen(true);
    router.replace('/search');
  };

  const handleOpenBoard = async () => {
    await setSeenStartingScreen(true);
    router.replace('/board');
  };

  return (
    <StartingScreen
      visible={true}
      onGetStarted={handleGetStarted}
      onNewEntry={handleNewEntry}
      onOpenSearch={handleOpenSearch}
      onOpenBoard={handleOpenBoard}
      totalApplications={applications.length}
      activeInterviews={stats.interview}
      totalOffers={stats.offer}
      isFirstLaunch={false}
    />
  );
}

