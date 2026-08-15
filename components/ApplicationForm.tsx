import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors } from '../constants/colors';
import { JobApplication, ApplicationFormData } from '../types/application';
import { STATUS_LIST, ApplicationStatus } from '../constants/statuses';
import { validateApplicationForm, sanitizeApplicationData } from '../utils/validation';
import { getTodayString } from '../utils/dates';

interface ApplicationFormProps {
  initialData?: JobApplication | null;
  onSave: (data: ApplicationFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  submitButtonText?: string;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialData,
  onSave,
  onCancel,
  onDelete,
  submitButtonText = 'Save entry',
}) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('applied');
  const [appliedDate, setAppliedDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setRole(initialData.role || '');
      setLink(initialData.link || '');
      setStatus(initialData.status || 'applied');
      setAppliedDate(initialData.appliedDate || '');
      setDeadline(initialData.deadline || '');
      setNotes(initialData.notes || '');
    } else {
      resetForm();
    }
    setErrors({});
  }, [initialData]);

  const resetForm = () => {
    setCompany('');
    setRole('');
    setLink('');
    setStatus('applied');
    setAppliedDate(getTodayString());
    setDeadline('');
    setNotes('');
    setErrors({});
  };

  const handleSave = () => {
    const rawData: ApplicationFormData = {
      company,
      role,
      link,
      status,
      appliedDate,
      deadline,
      notes,
    };

    const validation = validateApplicationForm(rawData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const sanitizedData = sanitizeApplicationData(rawData);
    onSave(sanitizedData);
  };

  const handleSetTodayApplied = () => {
    setAppliedDate(getTodayString());
    if (errors.appliedDate) {
      setErrors((prev) => ({ ...prev, appliedDate: '' }));
    }
  };

  const handleAddDaysToDeadline = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const dateStr = d.toISOString().split('T')[0];
    setDeadline(dateStr);
    if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: '' }));
  };

  const handleClearDeadline = () => {
    setDeadline('');
    if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: '' }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Company Field */}
        <View style={styles.field}>
          <Text style={styles.label}>COMPANY *</Text>
          <TextInput
            style={[styles.input, errors.company ? styles.inputError : null]}
            value={company}
            onChangeText={(text) => {
              setCompany(text);
              if (errors.company) setErrors((prev) => ({ ...prev, company: '' }));
            }}
            placeholder="e.g. Acme Corp"
            placeholderTextColor={Colors.slate}
            accessibilityLabel="Company Name Input"
          />
          {errors.company ? <Text style={styles.errorText}>{errors.company}</Text> : null}
        </View>

        {/* Role Field */}
        <View style={styles.field}>
          <Text style={styles.label}>ROLE *</Text>
          <TextInput
            style={[styles.input, errors.role ? styles.inputError : null]}
            value={role}
            onChangeText={(text) => {
              setRole(text);
              if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
            }}
            placeholder="e.g. Frontend Engineer Intern"
            placeholderTextColor={Colors.slate}
            accessibilityLabel="Role Input"
          />
          {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}
        </View>

        {/* Link Field */}
        <View style={styles.field}>
          <Text style={styles.label}>JOB LINK (URL)</Text>
          <TextInput
            style={[styles.input, errors.link ? styles.inputError : null]}
            value={link}
            onChangeText={(text) => {
              setLink(text);
              if (errors.link) setErrors((prev) => ({ ...prev, link: '' }));
            }}
            placeholder="https://..."
            placeholderTextColor={Colors.slate}
            autoCapitalize="none"
            keyboardType="url"
            accessibilityLabel="Job Link URL Input"
          />
          {errors.link ? <Text style={styles.errorText}>{errors.link}</Text> : null}
        </View>

        {/* Status Field */}
        <View style={styles.field}>
          <Text style={styles.label}>STATUS</Text>
          <View style={styles.statusChips}>
            {STATUS_LIST.map((st) => {
              const isSelected = status === st.id;
              return (
                <Pressable
                  key={st.id}
                  style={({ pressed }) => [
                    styles.statusChip,
                    isSelected && { backgroundColor: st.bgColor, borderColor: st.color },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => setStatus(st.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select status ${st.label}`}
                >
                  <View style={[styles.dot, { backgroundColor: st.color }]} />
                  <Text
                    style={[
                      styles.statusChipText,
                      isSelected && { color: st.color, fontWeight: '700' },
                    ]}
                  >
                    {st.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Applied Date Field */}
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>APPLIED DATE (YYYY-MM-DD)</Text>
          </View>
          <TextInput
            style={[styles.input, errors.appliedDate ? styles.inputError : null]}
            value={appliedDate}
            onChangeText={(text) => {
              setAppliedDate(text);
              if (errors.appliedDate) setErrors((prev) => ({ ...prev, appliedDate: '' }));
            }}
            placeholder="e.g. 2026-08-12"
            placeholderTextColor={Colors.slate}
            accessibilityLabel="Applied Date Input"
          />
          {errors.appliedDate ? <Text style={styles.errorText}>{errors.appliedDate}</Text> : null}

          {/* Quick Applied Date Presets */}
          <View style={styles.presetRow}>
            <Pressable style={styles.presetChip} onPress={handleSetTodayApplied}>
              <Text style={styles.presetChipText}>Set Today</Text>
            </Pressable>
            <Pressable
              style={styles.presetChip}
              onPress={() => {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                setAppliedDate(d.toISOString().split('T')[0]);
                if (errors.appliedDate) setErrors((prev) => ({ ...prev, appliedDate: '' }));
              }}
            >
              <Text style={styles.presetChipText}>Yesterday</Text>
            </Pressable>
          </View>
        </View>

        {/* Deadline Field */}
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>FOLLOW-UP / DEADLINE (YYYY-MM-DD)</Text>
          </View>
          <TextInput
            style={[styles.input, errors.deadline ? styles.inputError : null]}
            value={deadline}
            onChangeText={(text) => {
              setDeadline(text);
              if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: '' }));
            }}
            placeholder="e.g. 2026-08-20"
            placeholderTextColor={Colors.slate}
            accessibilityLabel="Deadline Input"
          />
          {errors.deadline ? <Text style={styles.errorText}>{errors.deadline}</Text> : null}

          {/* Quick Deadline Presets */}
          <View style={styles.presetRow}>
            <Pressable style={styles.presetChip} onPress={() => handleAddDaysToDeadline(3)}>
              <Text style={styles.presetChipText}>+3 Days</Text>
            </Pressable>
            <Pressable style={styles.presetChip} onPress={() => handleAddDaysToDeadline(7)}>
              <Text style={styles.presetChipText}>+1 Week</Text>
            </Pressable>
            <Pressable style={styles.presetChip} onPress={() => handleAddDaysToDeadline(14)}>
              <Text style={styles.presetChipText}>+2 Weeks</Text>
            </Pressable>
            {deadline ? (
              <Pressable style={[styles.presetChip, styles.presetChipClear]} onPress={handleClearDeadline}>
                <Text style={styles.presetChipClearText}>Clear</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Notes Field */}
        <View style={styles.field}>
          <Text style={styles.label}>NOTES</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Referral name, salary info, interview rounds..."
            placeholderTextColor={Colors.slate}
            multiline
            numberOfLines={3}
            accessibilityLabel="Notes Input"
          />
        </View>
      </ScrollView>

      {/* Form Actions */}
      <View style={styles.actions}>
        <View style={styles.mainActions}>
          <Pressable
            style={({ pressed }) => [styles.btnGhost, pressed && styles.btnGhostPressed]}
            onPress={onCancel}
          >
            <Text style={styles.btnGhostText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]}
            onPress={handleSave}
          >
            <Text style={styles.btnPrimaryText}>{submitButtonText}</Text>
          </Pressable>
        </View>

        {onDelete && initialData ? (
          <Pressable
            style={({ pressed }) => [styles.btnDanger, pressed && { opacity: 0.7 }]}
            onPress={onDelete}
          >
            <Text style={styles.btnDangerText}>Delete</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  field: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.slate,
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  todayLink: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brand,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.ink,
  },
  inputError: {
    borderColor: Colors.statusRejected,
  },
  errorText: {
    fontSize: 11,
    color: Colors.statusRejected,
    marginTop: 4,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  presetChip: {
    backgroundColor: Colors.tray,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.brandDark,
  },
  presetChipClear: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  presetChipClearText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.statusRejected,
  },
  statusChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 38,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.slate,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  mainActions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnGhost: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGhostPressed: {
    backgroundColor: Colors.tray,
  },
  btnGhostText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.inkSoft,
  },
  btnPrimary: {
    backgroundColor: Colors.brand,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimaryPressed: {
    backgroundColor: Colors.brandDark,
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  btnDanger: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  btnDangerText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.statusRejected,
    textDecorationLine: 'underline',
  },
});
