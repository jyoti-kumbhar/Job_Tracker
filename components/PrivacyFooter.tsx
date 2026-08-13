import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Colors } from '../constants/colors';

interface PrivacyFooterProps {
  onExport: () => void;
  onImport: () => void;
  onClearAll: () => void;
}

export const PrivacyFooter: React.FC<PrivacyFooterProps> = ({ onExport, onImport, onClearAll }) => {
  const handleClearAllConfirm = () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to permanently delete all saved job applications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete All', style: 'destructive', onPress: onClearAll },
      ]
    );
  };

  return (
    <View style={styles.footer}>
      <Text style={styles.privacyText}>
        Your entries are stored privately to your account — no one else who opens this tool can see them, and nothing here is sent anywhere except when you click a link out to a job portal.
      </Text>

      <View style={styles.actions}>
        <View style={styles.dataButtonsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.btnGhost,
              pressed && styles.btnGhostPressed,
            ]}
            onPress={onExport}
            accessibilityRole="button"
            accessibilityLabel="Export my application data as JSON"
          >
            <Text style={styles.btnGhostText}>Export my data (.json)</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.btnGhost,
              pressed && styles.btnGhostPressed,
            ]}
            onPress={onImport}
            accessibilityRole="button"
            accessibilityLabel="Import application data from JSON file"
          >
            <Text style={styles.btnGhostText}>Import data (.json)</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.btnDanger,
            pressed && { opacity: 0.7 },
          ]}
          onPress={handleClearAllConfirm}
          accessibilityRole="button"
          accessibilityLabel="Delete all my application data"
        >
          <Text style={styles.btnDangerText}>Delete all my data</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 24,
    paddingTop: 18,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 16,
  },
  privacyText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: Colors.slate,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  dataButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  btnGhost: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnGhostPressed: {
    backgroundColor: Colors.tray,
  },
  btnGhostText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.inkSoft,
  },
  btnDanger: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  btnDangerText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.statusRejected,
    textDecorationLine: 'underline',
  },
});
