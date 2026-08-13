import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
        <Text style={[styles.headerTitle, { color: statusConfig.color }]}>
          {statusConfig.label}
        </Text>
        <Text style={[styles.countBadge, { color: statusConfig.color }]}>
          ({applications.length})
        </Text>
      </View>

      <ScrollView
        style={styles.columnBody}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.columnBodyContent}
      >
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    backgroundColor: Colors.tray,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    width: 260,
    maxHeight: 600,
    marginRight: 14,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  columnHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  columnBody: {
    flex: 1,
  },
  columnBodyContent: {
    padding: 10,
  },
  emptyBox: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.slate,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
