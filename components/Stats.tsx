import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { StatisticsData } from '../types/application';

interface StatsProps {
  stats: StatisticsData;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Row 1: TOTAL & APPLIED */}
        <View style={styles.row}>
          <View style={styles.statCard} accessibilityLabel={`Total applications: ${stats.total}`}>
            <Text style={styles.num}>{stats.total}</Text>
            <Text style={styles.lbl}>TOTAL</Text>
          </View>

          <View style={styles.statCard} accessibilityLabel={`Applied applications: ${stats.applied}`}>
            <Text style={[styles.num, { color: Colors.statusApplied }]}>{stats.applied}</Text>
            <Text style={styles.lbl}>APPLIED</Text>
          </View>
        </View>

        {/* Row 2: INTERVIEWS & OFFERS */}
        <View style={styles.row}>
          <View style={styles.statCard} accessibilityLabel={`Interview applications: ${stats.interview}`}>
            <Text style={[styles.num, { color: Colors.statusInterview }]}>{stats.interview}</Text>
            <Text style={styles.lbl}>INTERVIEWS</Text>
          </View>

          <View style={styles.statCard} accessibilityLabel={`Job offers: ${stats.offer}`}>
            <Text style={[styles.num, { color: Colors.statusOffer }]}>{stats.offer}</Text>
            <Text style={styles.lbl}>OFFERS</Text>
          </View>
        </View>

        {/* Row 3: NEXT DEADLINE (Full Width) */}
        <View
          style={[styles.statCard, styles.fullWidthCard]}
          accessibilityLabel={
            stats.nextDeadline
              ? `Next deadline on ${stats.nextDeadline}`
              : 'No upcoming deadline'
          }
        >
          <View style={styles.deadlineRow}>
            <View style={styles.deadlineInfo}>
              <Text style={styles.lbl}>NEXT DEADLINE</Text>
              <Text
                style={[
                  styles.deadlineValue,
                  stats.nextDeadline ? styles.deadlineActive : styles.deadlineEmpty,
                ]}
                numberOfLines={1}
              >
                {stats.nextDeadline || 'None pending'}
              </Text>
            </View>
            <View
              style={[
                styles.deadlineBadge,
                stats.nextDeadline ? styles.deadlineBadgeActive : styles.deadlineBadgeEmpty,
              ]}
            >
              <Text
                style={[
                  styles.deadlineBadgeText,
                  stats.nextDeadline
                    ? styles.deadlineBadgeTextActive
                    : styles.deadlineBadgeTextEmpty,
                ]}
              >
                {stats.nextDeadline ? '⚠️ Upcoming' : '✓ All clear'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.bg,
  },
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: 'center',
  },
  fullWidthCard: {
    flex: undefined,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  num: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.ink,
    lineHeight: 26,
  },
  lbl: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.slate,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineValue: {
    fontSize: 14.5,
    fontWeight: '700',
    marginTop: 2,
  },
  deadlineActive: {
    color: Colors.statusRejected,
  },
  deadlineEmpty: {
    color: Colors.slate,
    fontWeight: '500',
  },
  deadlineBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  deadlineBadgeActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  deadlineBadgeEmpty: {
    backgroundColor: Colors.tray,
  },
  deadlineBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  deadlineBadgeTextActive: {
    color: Colors.statusRejected,
  },
  deadlineBadgeTextEmpty: {
    color: Colors.slate,
  },
});
