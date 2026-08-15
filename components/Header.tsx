import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Colors } from '../constants/colors';

interface HeaderProps {
  onNewEntry: () => void;
  onOpenStartingScreen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewEntry, onOpenStartingScreen }) => {
  return (
    <View style={styles.header}>
      <Pressable
        style={({ pressed }) => [
          styles.brandTouchable,
          pressed && styles.brandTouchablePressed,
        ]}
        onPress={onOpenStartingScreen}
        accessibilityRole="button"
        accessibilityLabel="Job Tracker home and welcome guide"
        accessibilityHint="Opens app overview and starting guide"
      >
        <View style={styles.logoBadge}>
          <Image
            source={require('../assets/images/app-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.titleContainer}>
          <View style={styles.brandRow}>
            <Text style={styles.title}>Application Log</Text>
          </View>
          <Text style={styles.subtitle}>// search once, apply everywhere</Text>
        </View>
      </Pressable>

      <View style={styles.actionsRow}>
        {onOpenStartingScreen && (
          <Pressable
            style={({ pressed }) => [
              styles.btnInfo,
              pressed && styles.btnInfoPressed,
            ]}
            onPress={onOpenStartingScreen}
            accessibilityRole="button"
            accessibilityLabel="App guide and starting screen"
          >
            <Text style={styles.btnInfoText}>ⓘ</Text>
          </Pressable>
        )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  brandTouchablePressed: {
    opacity: 0.75,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 19,
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnInfo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.tray,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInfoPressed: {
    backgroundColor: Colors.borderStrong,
  },
  btnInfoText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.inkSoft,
  },
  btnPrimary: {
    backgroundColor: Colors.brand,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
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
    fontSize: 13.5,
  },
});
