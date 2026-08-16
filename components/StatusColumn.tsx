import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { StatusConfig, ApplicationStatus } from '../constants/statuses';
import { JobApplication } from '../types/application';
import { ApplicationCard } from './ApplicationCard';

interface StatusColumnProps {
  statusConfig: StatusConfig;
  applications: JobApplication[];
  onEditApplication: (app: JobApplication) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
}

export const StatusColumn: React.FC<StatusColumnProps> = ({
  statusConfig,
  applications,
  onEditApplication,
  onStatusChange,
}) => {
  return (
    <View style={styles.columnContainer}>
      <View style={[styles.columnHeader, { borderBottomColor: statusConfig.color }]}>
        <View style={styles.headerTitleRow}>
          <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
          <Text style={[styles.headerTitle, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={[styles.countBadgeText, { color: statusConfig.color }]}>
            {applications.length}
          </Text>
        </View>
      </View>

      <View style={styles.columnBodyContent}>
        {applications.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No applications in {statusConfig.label.toLowerCase()}</Text>
          </View>
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={onEditApplication}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    backgroundColor: Colors.tray,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  columnHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  countBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    minWidth: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  columnBodyContent: {
    padding: 12,
  },
  emptyBox: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Colors.slate,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
