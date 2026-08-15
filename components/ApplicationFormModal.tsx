import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { JobApplication, ApplicationFormData } from '../types/application';
import { ApplicationForm } from './ApplicationForm';

interface ApplicationFormModalProps {
  visible: boolean;
  editingApplication?: JobApplication | null;
  onClose: () => void;
  onSave: (data: ApplicationFormData, id?: string) => void;
  onDelete?: (id: string) => void;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  visible,
  editingApplication,
  onClose,
  onSave,
  onDelete,
}) => {
  const insets = useSafeAreaInsets();

  const handleSave = (data: ApplicationFormData) => {
    onSave(data, editingApplication?.id);
    onClose();
  };

  const handleDelete = () => {
    if (!editingApplication) return;
    Alert.alert(
      'Delete Application',
      `Are you sure you want to delete "${editingApplication.company} - ${editingApplication.role}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDelete) onDelete(editingApplication.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlayContainer}
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close form modal backdrop"
        />

        <View
          style={[
            styles.bottomSheet,
            {
              paddingBottom: Math.max(insets.bottom, 16) + 4,
            },
          ]}
        >
          <View style={styles.dragHandleRow}>
            <View style={styles.dragHandle} />
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>
              {editingApplication ? 'Edit entry' : 'New entry'}
            </Text>
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close entry form"
              hitSlop={10}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ApplicationForm
            initialData={editingApplication}
            onSave={handleSave}
            onCancel={onClose}
            onDelete={editingApplication ? handleDelete : undefined}
            submitButtonText={editingApplication ? 'Update entry' : 'Save entry'}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    height: '88%',
    maxHeight: '94%',
    paddingHorizontal: 22,
    paddingTop: 10,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.slate,
  },
});
