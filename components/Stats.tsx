import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';
import { StatisticsData } from '../types/application';

interface StatsProps {
  stats: StatisticsData;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statCard} accessibilityLabel={`Total applications: ${stats.total}`}>
          <Text style={styles.num}>{stats.total}</Text>
          <Text style={styles.lbl}>TOTAL</Text>
        </View>

        <View style={styles.statCard} accessibilityLabel={`Applied applications: ${stats.applied}`}>
          <Text style={[styles.num, { color: Colors.statusApplied }]}>{stats.applied}</Text>
          <Text style={styles.lbl}>APPLIED</Text>
        </View>

        <View style={styles.statCard} accessibilityLabel={`Interview applications: ${stats.interview}`}>
          <Text style={[styles.num, { color: Colors.statusInterview }]}>{stats.interview}</Text>
          <Text style={styles.lbl}>INTERVIEWS</Text>
        </View>

        <View style={styles.statCard} accessibilityLabel={`Job offers: ${stats.offer}`}>
          <Text style={[styles.num, { color: Colors.statusOffer }]}>{stats.offer}</Text>
          <Text style={styles.lbl}>OFFERS</Text>
        </View>

        <View
          style={styles.statCard}
          accessibilityLabel={
            stats.nextDeadline
              ? `Next deadline on ${stats.nextDeadline}`
              : 'No upcoming deadline'
          }
        >
          <Text
            style={[
              styles.num,
              stats.nextDeadline ? { fontSize: 15, color: Colors.statusRejected } : { color: Colors.slate },
            ]}
            numberOfLines={1}
          >
            {stats.nextDeadline || '—'}
          </Text>
          <Text style={styles.lbl}>NEXT DEADLINE</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    minWidth: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: 'center',
  },
  num: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.ink,
    lineHeight: 24,
  },
  lbl: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.slate,
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
