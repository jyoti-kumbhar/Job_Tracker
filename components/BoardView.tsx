import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { STATUS_LIST, ApplicationStatus } from '../constants/statuses';
import { JobApplication } from '../types/application';
import { StatusColumn } from './StatusColumn';

interface BoardViewProps {
  applications: JobApplication[];
  onEditApplication: (app: JobApplication) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  applications,
  onEditApplication,
  onStatusChange,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<ApplicationStatus | 'all'>('all');

  const filteredStatuses = selectedFilter === 'all'
    ? STATUS_LIST
    : STATUS_LIST.filter((s) => s.id === selectedFilter);

  return (
    <View style={styles.container}>
      {/* Mobile Quick Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        <Pressable
          style={({ pressed }) => [
            styles.filterChip,
            selectedFilter === 'all' && styles.filterChipActive,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => setSelectedFilter('all')}
          accessibilityRole="button"
          accessibilityLabel={`Filter all columns. Total ${applications.length} applications`}
          accessibilityState={{ selected: selectedFilter === 'all' }}
        >
          <Text style={[styles.filterChipText, selectedFilter === 'all' && styles.filterChipTextActive]}>
            All ({applications.length})
          </Text>
        </Pressable>

        {STATUS_LIST.map((st) => {
          const count = applications.filter((a) => a.status === st.id).length;
          const isSelected = selectedFilter === st.id;
          return (
            <Pressable
              key={st.id}
              style={({ pressed }) => [
                styles.filterChip,
                isSelected && { backgroundColor: st.bgColor, borderColor: st.color },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setSelectedFilter(isSelected ? 'all' : st.id)}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${st.label}, ${count} applications`}
              accessibilityState={{ selected: isSelected }}
            >
              <View style={[styles.dot, { backgroundColor: st.color }]} />
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && { color: st.color, fontWeight: '700' },
                ]}
              >
                {st.label} ({count})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Kanban Board Columns Container */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boardScrollContent}
      >
        {filteredStatuses.map((st) => {
          const colApps = applications.filter((app) => app.status === st.id);
          return (
            <StatusColumn
              key={st.id}
              statusConfig={st}
              applications={colApps}
              onEditApplication={onEditApplication}
              onStatusChange={onStatusChange}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 14,
  },
  filterBar: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    minHeight: 36,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.brandSoft,
    borderColor: Colors.brand,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.slate,
  },
  filterChipTextActive: {
    color: Colors.brandDark,
    fontWeight: '700',
  },
  boardScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
