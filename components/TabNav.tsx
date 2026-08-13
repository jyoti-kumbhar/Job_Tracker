import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';

export type TabType = 'search' | 'board';

interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount?: number;
}

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange, savedCount = 0 }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.tabBtn,
          activeTab === 'search' && styles.tabBtnActive,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => onTabChange('search')}
        accessibilityRole="tab"
        accessibilityLabel="Search tab"
        accessibilityState={{ selected: activeTab === 'search' }}
      >
        <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>
          Search
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.tabBtn,
          activeTab === 'board' && styles.tabBtnActive,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => onTabChange('board')}
        accessibilityRole="tab"
        accessibilityLabel={`Board tab with ${savedCount} saved applications`}
        accessibilityState={{ selected: activeTab === 'board' }}
      >
        <Text style={[styles.tabText, activeTab === 'board' && styles.tabTextActive]}>
          Board {savedCount > 0 ? `(${savedCount})` : ''}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  tabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 44,
    justifyContent: 'center',
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: Colors.brand,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.slate,
  },
  tabTextActive: {
    color: Colors.brandDark,
    fontWeight: '700',
  },
});
