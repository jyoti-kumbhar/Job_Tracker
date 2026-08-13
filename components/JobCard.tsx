import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { LiveJobItem } from '../types/job';
import { formatUrl, isValidUrl } from '../utils/validation';

export type { LiveJobItem };

interface JobCardProps {
  job: LiveJobItem;
  onSave: (job: LiveJobItem) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSave }) => {
  const handleOpenLink = async () => {
    if (!job.url) {
      Alert.alert('Invalid Link', 'No web link is available for this job posting.');
      return;
    }

    const formattedUrl = formatUrl(job.url);
    if (!formattedUrl || !isValidUrl(formattedUrl)) {
      Alert.alert('Invalid Link', 'The job posting URL format is invalid.');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(formattedUrl).catch(() => false);
      if (canOpen) {
        await Linking.openURL(formattedUrl);
      } else {
        await Linking.openURL(formattedUrl);
      }
    } catch {
      Alert.alert('Cannot Open Link', 'Unable to open job posting URL in web browser.');
    }
  };


  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={2}>
          {job.title}
        </Text>
        <Text style={styles.sourceTag}>{job.source}</Text>
      </View>

      <Text style={styles.company}>{job.company}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.location}>{job.location || 'Location Not Specified'}</Text>
        {job.publishedAt ? (
          <Text style={styles.dateText}>Posted: {job.publishedAt}</Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.linkBtn,
            pressed && { opacity: 0.7 },
          ]}
          onPress={handleOpenLink}
          accessibilityRole="button"
          accessibilityLabel={`View posting for ${job.title} at ${job.company}`}
        >
          <Text style={styles.linkText}>View Posting ↗</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            job.isSaved && styles.saveBtnSaved,
            pressed && !job.isSaved && styles.saveBtnPressed,
          ]}
          onPress={() => !job.isSaved && onSave(job)}
          disabled={job.isSaved}
          accessibilityRole="button"
          accessibilityLabel={job.isSaved ? 'Saved to tracker' : 'Save to tracker'}
        >
          <Text style={[styles.saveBtnText, job.isSaved && styles.saveBtnTextSaved]}>
            {job.isSaved ? '✓ Saved' : '+ Save to Tracker'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.ink,
    flex: 1,
  },
  sourceTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.brandDark,
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  company: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.inkSoft,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  location: {
    fontSize: 11.5,
    fontWeight: '500',
    color: Colors.slate,
    flex: 1,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.slate,
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    minHeight: 38,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.brandDark,
    textDecorationLine: 'underline',
  },
  saveBtn: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 38,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnPressed: {
    backgroundColor: Colors.tray,
  },
  saveBtnSaved: {
    backgroundColor: Colors.statusOfferBg,
    borderColor: 'transparent',
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  saveBtnTextSaved: {
    color: Colors.statusOffer,
  },
});
