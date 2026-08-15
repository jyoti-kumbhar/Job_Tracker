import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

export interface StartingScreenProps {
  visible?: boolean;
  onGetStarted: () => void;
  onNewEntry?: () => void;
  onOpenSearch?: () => void;
  onOpenBoard?: () => void;
  onImportBackup?: () => void;
  onClose?: () => void;
  totalApplications?: number;
  activeInterviews?: number;
  totalOffers?: number;
  isFirstLaunch?: boolean;
}

export const StartingScreen: React.FC<StartingScreenProps> = ({
  visible = true,
  onGetStarted,
  onNewEntry,
  onOpenSearch,
  onOpenBoard,
  onImportBackup,
  onClose,
  totalApplications = 0,
  activeInterviews = 0,
  totalOffers = 0,
  isFirstLaunch = false,
}) => {
  const handleQuickAction = (action?: () => void) => {
    onGetStarted();
    if (action) {
      setTimeout(() => {
        action();
      }, 100);
    }
  };

  const content = (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Dismiss Button (when opened as modal/guide) */}
        {onClose && !isFirstLaunch && (
          <View style={styles.topBar}>
            <Text style={styles.topBarLabel}>App Overview & Guide</Text>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close welcome guide"
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
        )}

        {/* Hero Branding Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/images/logo-glow.png')}
              style={styles.glowImage}
              resizeMode="contain"
            />
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/app-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.appName}>Job Tracker</Text>
          <Text style={styles.appTagline}>// search once, apply everywhere</Text>
          <Text style={styles.appDescription}>
            Your private, offline-first career hub for managing applications, tracking interviews, and exploring jobs across all major portals.
          </Text>

          {/* Value Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔒 100% Offline</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⚡ 9+ Portals</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>📋 Kanban Pipeline</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>💾 JSON Backup</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Status / Overview Banner */}
        {totalApplications > 0 ? (
          <View style={styles.statusBox}>
            <View style={styles.statusBoxHeader}>
              <Text style={styles.statusBoxTitle}>Pipeline Summary</Text>
              <Text style={styles.statusBoxBadge}>{totalApplications} Logged</Text>
            </View>
            <View style={styles.statusMetricsRow}>
              <View style={styles.statusMetricItem}>
                <Text style={styles.statusMetricValue}>{totalApplications}</Text>
                <Text style={styles.statusMetricLabel}>Total</Text>
              </View>
              <View style={styles.statusMetricDivider} />
              <View style={styles.statusMetricItem}>
                <Text style={[styles.statusMetricValue, { color: Colors.statusInterview }]}>
                  {activeInterviews}
                </Text>
                <Text style={styles.statusMetricLabel}>Interviews</Text>
              </View>
              <View style={styles.statusMetricDivider} />
              <View style={styles.statusMetricItem}>
                <Text style={[styles.statusMetricValue, { color: Colors.statusOffer }]}>
                  {totalOffers}
                </Text>
                <Text style={styles.statusMetricLabel}>Offers</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.statusBox}>
            <Text style={styles.statusBoxTitle}>Ready to start your job hunt?</Text>
            <Text style={styles.statusBoxSubtitle}>
              Dispatch job searches to 9+ top portals with 1 tap, or log your first application below.
            </Text>
          </View>
        )}

        {/* Quick Action Shortcuts */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <Pressable
              style={({ pressed }) => [
                styles.quickTile,
                pressed && styles.quickTilePressed,
              ]}
              onPress={() => handleQuickAction(onOpenSearch)}
              accessibilityRole="button"
              accessibilityLabel="Open job portal search"
            >
              <View style={[styles.quickIconBox, { backgroundColor: Colors.brandSoft }]}>
                <Text style={styles.quickIcon}>🔍</Text>
              </View>
              <Text style={styles.quickTitle}>Portal Search</Text>
              <Text style={styles.quickSub}>Search 9+ portals</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.quickTile,
                pressed && styles.quickTilePressed,
              ]}
              onPress={() => handleQuickAction(onOpenBoard)}
              accessibilityRole="button"
              accessibilityLabel="Open application board"
            >
              <View style={[styles.quickIconBox, { backgroundColor: Colors.statusInterviewBg }]}>
                <Text style={styles.quickIcon}>📋</Text>
              </View>
              <Text style={styles.quickTitle}>Kanban Board</Text>
              <Text style={styles.quickSub}>View pipeline stages</Text>
            </Pressable>

            {onNewEntry && (
              <Pressable
                style={({ pressed }) => [
                  styles.quickTile,
                  pressed && styles.quickTilePressed,
                ]}
                onPress={() => handleQuickAction(onNewEntry)}
                accessibilityRole="button"
                accessibilityLabel="Add new job application"
              >
                <View style={[styles.quickIconBox, { backgroundColor: Colors.statusOfferBg }]}>
                  <Text style={styles.quickIcon}>➕</Text>
                </View>
                <Text style={styles.quickTitle}>New Entry</Text>
                <Text style={styles.quickSub}>Log an application</Text>
              </Pressable>
            )}

            {onImportBackup && (
              <Pressable
                style={({ pressed }) => [
                  styles.quickTile,
                  pressed && styles.quickTilePressed,
                ]}
                onPress={() => handleQuickAction(onImportBackup)}
                accessibilityRole="button"
                accessibilityLabel="Restore applications from backup"
              >
                <View style={[styles.quickIconBox, { backgroundColor: Colors.tray }]}>
                  <Text style={styles.quickIcon}>📂</Text>
                </View>
                <Text style={styles.quickTitle}>Import Backup</Text>
                <Text style={styles.quickSub}>Restore JSON data</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* 3-Step Guided Walkthrough */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>How It Works</Text>

          {/* Step 1 */}
          <View style={styles.stepCard}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>Multi-Portal Search in 1 Tap</Text>
              <Text style={styles.stepDesc}>
                Set your desired role, location, job type, and experience. Open pre-filled searches on LinkedIn, Indeed, Naukri, Glassdoor, Internshala, and Wellfound instantly.
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepCard}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>Organize with Kanban Stages</Text>
              <Text style={styles.stepDesc}>
                Track jobs across 5 distinct stages: Saved, Applied, Interview, Offer, and Rejected. Set deadline reminders and log interview rounds.
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.stepCard}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepTextContent}>
              <Text style={styles.stepDescTextOnly}>
                <Text style={styles.stepTitle}>Private & Local Forever: </Text>
                No account, no tracking, and no external servers. Everything is stored on your device with one-click JSON backup & restore.
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.actionContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
            onPress={onGetStarted}
            accessibilityRole="button"
            accessibilityLabel="Get Started and enter tracker"
          >
            <Text style={styles.primaryButtonText}>
              {totalApplications > 0 ? 'Open Job Tracker →' : 'Get Started →'}
            </Text>
          </Pressable>

          {onNewEntry && (
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
              onPress={() => {
                onGetStarted();
                if (onNewEntry) {
                  setTimeout(() => {
                    onNewEntry();
                  }, 100);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel="Add new job application"
            >
              <Text style={styles.secondaryButtonText}>+ Add New Application</Text>
            </Pressable>
          )}
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Job Tracker • Offline-First Career Assistant
          </Text>
          <Text style={styles.footerNoteSub}>
            Tip: Tap the ⓘ icon in the top header anytime to reopen this guide.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  if (visible === false) {
    return null;
  }

  if (onClose) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        {content}
      </Modal>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topBarLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ink,
    letterSpacing: -0.1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: Colors.borderStrong,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.inkSoft,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  glowImage: {
    position: 'absolute',
    width: 140,
    height: 140,
    opacity: 0.8,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    padding: 6,
    shadowColor: Colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.ink,
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  appTagline: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.brand,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 13.5,
    fontWeight: '400',
    color: Colors.inkSoft,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.inkSoft,
  },
  statusBox: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: 12,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBoxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.ink,
  },
  statusBoxBadge: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.brand,
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  statusMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusMetricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.ink,
    marginBottom: 2,
  },
  statusMetricLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.slate,
    textTransform: 'uppercase',
  },
  statusMetricDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  statusBoxSubtitle: {
    fontSize: 13,
    color: Colors.slate,
    lineHeight: 18.5,
    marginTop: 4,
  },
  section: {
    marginTop: 10,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickTile: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'flex-start',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  quickTilePressed: {
    backgroundColor: Colors.tray,
    borderColor: Colors.borderStrong,
  },
  quickIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickIcon: {
    fontSize: 17,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 2,
  },
  quickSub: {
    fontSize: 11,
    color: Colors.slate,
    fontWeight: '500',
  },
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.brand,
  },
  stepTextContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: Colors.inkSoft,
    lineHeight: 17,
  },
  stepDescTextOnly: {
    fontSize: 12,
    color: Colors.inkSoft,
    lineHeight: 17,
    flex: 1,
  },
  actionContainer: {
    marginTop: 10,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: Colors.brand,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: Colors.brand,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonPressed: {
    backgroundColor: Colors.brandDark,
    transform: [{ translateY: 1 }],
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryButtonPressed: {
    backgroundColor: Colors.tray,
  },
  secondaryButtonText: {
    color: Colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 12,
    gap: 3,
  },
  footerNoteText: {
    fontSize: 11.5,
    color: Colors.slate,
    fontWeight: '600',
  },
  footerNoteSub: {
    fontSize: 10.5,
    color: Colors.slate,
    textAlign: 'center',
  },
});

