import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors } from '../constants/colors';
import { JobApplication } from '../types/application';
import { STATUS_LIST, STATUS_MAP, ApplicationStatus } from '../constants/statuses';
import { formatDateDisplay, isDeadlineApproaching } from '../utils/dates';
import { formatUrl, isValidUrl } from '../utils/validation';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (app: JobApplication) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onStatusChange,
}) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const statusConfig = STATUS_MAP[application.status] || STATUS_MAP.saved;

  const handleOpenLink = async () => {
    if (!application.link) return;
    const formattedUrl = formatUrl(application.link);

    if (!formattedUrl || !isValidUrl(formattedUrl)) {
      Alert.alert('Invalid Link', 'The job application link format is invalid.');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(formattedUrl).catch(() => false);
      if (supported) {
        await Linking.openURL(formattedUrl);
      } else {
        await Linking.openURL(formattedUrl);
      }
    } catch (err) {
      console.error('Failed to open application link:', err);
      Alert.alert(
        'Cannot Open Link',
        'Unable to open job link in web browser. Please verify a web browser is installed.'
      );
    }
  };


  const isUrgent = isDeadlineApproaching(application.deadline);

  return (
    <View style={[styles.card, { borderLeftColor: statusConfig.color }]}>
      {/* Seal Badge */}
      <View style={[styles.seal, { backgroundColor: statusConfig.color }]}>
        <Text style={styles.sealText}>
          {statusConfig.label.charAt(0)}
        </Text>
      </View>

      <Text style={styles.company} numberOfLines={1}>
        {application.company}
      </Text>
      <Text style={styles.role} numberOfLines={1}>
        {application.role}
      </Text>

      <View style={styles.meta}>
        {application.appliedDate ? (
          <Text style={styles.metaText}>
            Applied: {formatDateDisplay(application.appliedDate)}
          </Text>
        ) : null}

        {application.deadline ? (
          <Text style={[styles.metaText, isUrgent && styles.deadlineUrgent]}>
            Deadline: {formatDateDisplay(application.deadline)} {isUrgent ? '⚠️' : ''}
          </Text>
        ) : null}

        {application.notes ? (
          <Text style={styles.notesText} numberOfLines={2}>
            {application.notes}
          </Text>
        ) : null}
      </View>

      <View style={styles.cardActions}>
        <Pressable
          style={({ pressed }) => [
            styles.statusPickerButton,
            pressed && styles.statusPickerButtonPressed,
          ]}
          onPress={() => setPickerVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={`Current status: ${statusConfig.label}. Tap to change status.`}
        >
          <Text style={[styles.statusPickerText, { color: statusConfig.color }]}>
            {statusConfig.label} ▾
          </Text>
        </Pressable>

        {application.link ? (
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={handleOpenLink}
            accessibilityRole="button"
            accessibilityLabel={`Open URL link for ${application.company}`}
          >
            <Text style={styles.actionBtnText}>Link ↗</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && styles.actionBtnPressed,
          ]}
          onPress={() => onEdit(application)}
          accessibilityRole="button"
          accessibilityLabel={`Edit application for ${application.company}`}
        >
          <Text style={styles.actionBtnText}>Edit</Text>
        </Pressable>
      </View>

      {/* Quick Status Selector Bottom Sheet Modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
        accessibilityViewIsModal
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setPickerVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Close status selector backdrop"
          />
          <View style={styles.pickerModal}>
            <View style={styles.dragHandleRow}>
              <View style={styles.dragHandle} />
            </View>

            <View style={styles.sheetHeader}>
              <Text style={styles.pickerTitle}>Move Application Status</Text>
              <Text style={styles.pickerSubtitle}>
                {application.company} — {application.role}
              </Text>
            </View>

            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {STATUS_LIST.map((st) => {
                const isSelected = application.status === st.id;
                return (
                  <Pressable
                    key={st.id}
                    style={({ pressed }) => [
                      styles.statusOption,
                      isSelected && { backgroundColor: st.bgColor },
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => {
                      onStatusChange(application.id, st.id);
                      setPickerVisible(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Set status to ${st.label}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View style={[styles.colorDot, { backgroundColor: st.color }]} />
                    <Text
                      style={[
                        styles.statusOptionText,
                        isSelected && { fontWeight: '700', color: st.color },
                      ]}
                    >
                      {st.label}
                    </Text>
                    {isSelected && (
                      <Text style={[styles.checkMark, { color: st.color }]}>✓</Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    position: 'relative',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  seal: {
    position: 'absolute',
    top: -8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sealText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  company: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 2,
    paddingRight: 24,
  },
  role: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Colors.inkSoft,
    marginBottom: 8,
  },
  meta: {
    gap: 3,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.slate,
  },
  deadlineUrgent: {
    color: Colors.statusRejected,
    fontWeight: '700',
  },
  notesText: {
    fontSize: 11,
    color: Colors.slate,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  statusPickerButton: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    minHeight: 34,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
  },
  statusPickerButtonPressed: {
    backgroundColor: Colors.tray,
  },
  statusPickerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
    minHeight: 34,
    justifyContent: 'center',
  },
  actionBtnPressed: {
    backgroundColor: Colors.tray,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  pickerModal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
    width: '100%',
    elevation: 10,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  dragHandleRow: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 4,
  },
  dragHandle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: Colors.borderStrong,
  },
  sheetHeader: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ink,
  },
  pickerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.slate,
    marginTop: 2,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 6,
    minHeight: 44,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusOptionText: {
    fontSize: 14,
    color: Colors.ink,
    fontWeight: '500',
    flex: 1,
  },
  checkMark: {
    fontSize: 15,
    fontWeight: '800',
  },
});
