import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { JobPortal, SearchParams } from '../data/portals';
import { openPortalSearch, formatFilterSummary } from '../services/jobSearch';

interface PortalCardProps {
  portal: JobPortal;
  searchParams: SearchParams;
}

export const PortalCard: React.FC<PortalCardProps> = ({ portal, searchParams }) => {
  const handleOpen = () => {
    openPortalSearch(portal, searchParams);
  };

  const querySummary = formatFilterSummary(searchParams);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handleOpen}
      accessibilityRole="button"
      accessibilityLabel={`Search on ${portal.name}`}
      accessibilityHint={`Opens ${portal.name} in external browser for ${querySummary}`}
    >
      <View style={styles.headerRow}>
        <Text style={styles.portalName}>{portal.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PORTAL</Text>
        </View>
      </View>

      <Text style={styles.desc}>{portal.description}</Text>

      <View style={styles.searchSummaryBox}>
        <Text style={styles.searchSummaryLabel}>SEARCH TARGET:</Text>
        <Text style={styles.searchSummaryText} numberOfLines={1}>
          {querySummary}
        </Text>
      </View>

      <View style={styles.goRow}>
        <Text style={styles.goText}>Open search ↗</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPressed: {
    borderColor: Colors.brand,
    backgroundColor: Colors.brandSoft,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  portalName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ink,
  },
  badge: {
    backgroundColor: Colors.tray,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate,
    letterSpacing: 0.4,
  },
  desc: {
    fontSize: 12.5,
    color: Colors.slate,
    lineHeight: 17,
    marginBottom: 10,
  },
  searchSummaryBox: {
    backgroundColor: Colors.tray,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 10,
  },
  searchSummaryLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.slate,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  searchSummaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ink,
  },
  goRow: {
    alignItems: 'flex-start',
  },
  goText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brandDark,
  },
});

