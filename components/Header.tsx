import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';

interface HeaderProps {
  onNewEntry: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewEntry }) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <View style={styles.brandRow}>
          <Text style={styles.flag}>⚑</Text>
          <Text style={styles.title}>Application Log</Text>
        </View>
        <Text style={styles.subtitle}>// search once, apply everywhere</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.btnPrimary,
          pressed && styles.btnPrimaryPressed,
        ]}
        onPress={onNewEntry}
        accessibilityRole="button"
        accessibilityLabel="Create new application entry"
      >
        <Text style={styles.btnPrimaryText}>+ New entry</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    fontSize: 18,
    color: Colors.brand,
    fontWeight: '800',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.ink,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.slate,
    marginTop: 2,
    letterSpacing: 0.1,
  },
  btnPrimary: {
    backgroundColor: Colors.brand,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  btnPrimaryPressed: {
    backgroundColor: Colors.brandDark,
    transform: [{ translateY: 1 }],
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
