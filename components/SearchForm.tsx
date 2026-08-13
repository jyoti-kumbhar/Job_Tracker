import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import { Colors } from '../constants/colors';
import { SearchParams } from '../data/portals';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: SearchParams;
}

const TYPE_OPTIONS = [
  { label: 'Any', value: 'any' },
  { label: 'Internship', value: 'internship' },
  { label: 'Full-time', value: 'fulltime' },
  { label: 'Part-time', value: 'parttime' },
];

const MODE_OPTIONS = [
  { label: 'Any', value: 'any' },
  { label: 'Remote', value: 'remote' },
  { label: 'On-site', value: 'onsite' },
  { label: 'Hybrid', value: 'hybrid' },
];

const EXP_OPTIONS = [
  { label: 'Any', value: 'any' },
  { label: 'Internship', value: 'internship' },
  { label: 'Entry level', value: 'entry' },
  { label: 'Mid level', value: 'mid' },
  { label: 'Senior', value: 'senior' },
  { label: 'Lead / Manager', value: 'lead' },
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, initialParams }) => {
  const [role, setRole] = useState(initialParams?.role || '');
  const [location, setLocation] = useState(initialParams?.location || '');
  const [jobType, setJobType] = useState(initialParams?.jobType || 'any');
  const [workMode, setWorkMode] = useState(initialParams?.workMode || 'any');
  const [experience, setExperience] = useState(initialParams?.experience || 'any');

  const [activePicker, setActivePicker] = useState<'type' | 'mode' | 'exp' | null>(null);

  useEffect(() => {
    if (initialParams) {
      if (initialParams.role !== undefined) setRole(initialParams.role);
      if (initialParams.location !== undefined) setLocation(initialParams.location);
      if (initialParams.jobType !== undefined) setJobType(initialParams.jobType);
      if (initialParams.workMode !== undefined) setWorkMode(initialParams.workMode);
      if (initialParams.experience !== undefined) setExperience(initialParams.experience);
    }
  }, [initialParams]);

  const handleSearch = () => {
    Keyboard.dismiss();
    if (!role.trim()) {
      Alert.alert('Role Required', 'Please enter a role or keyword to search.');
      return;
    }

    onSearch({
      role: role.trim(),
      location: location.trim(),
      jobType,
      workMode,
      experience,
    });
  };

  const handleClear = () => {
    Keyboard.dismiss();
    setRole('');
    setLocation('');
    setJobType('any');
    setWorkMode('any');
    setExperience('any');
    onSearch({
      role: '',
      location: '',
      jobType: 'any',
      workMode: 'any',
      experience: 'any',
    });
  };

  const getLabel = (options: typeof TYPE_OPTIONS, val: string) => {
    return options.find((o) => o.value === val)?.label || 'Any';
  };

  const hasActiveFilters =
    role.trim() !== '' ||
    location.trim() !== '' ||
    jobType !== 'any' ||
    workMode !== 'any' ||
    experience !== 'any';

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Dispatch form — search all portals at once</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>ROLE / KEYWORDS *</Text>
        <TextInput
          style={styles.input}
          value={role}
          onChangeText={setRole}
          placeholder="e.g. React Native Developer"
          placeholderTextColor={Colors.slate}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Role or keyword input field"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>LOCATION</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Remote, India, New York"
          placeholderTextColor={Colors.slate}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Location input field"
        />
      </View>

      <View style={styles.rowFields}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>TYPE</Text>
          <Pressable
            style={({ pressed }) => [
              styles.selectButton,
              pressed && styles.selectButtonPressed,
            ]}
            onPress={() => {
              Keyboard.dismiss();
              setActivePicker('type');
            }}
            accessibilityRole="button"
            accessibilityLabel={`Job type filter: current value ${getLabel(TYPE_OPTIONS, jobType)}`}
          >
            <Text style={styles.selectText}>{getLabel(TYPE_OPTIONS, jobType)}</Text>
            <Text style={styles.chevron}>▾</Text>
          </Pressable>
        </View>

        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>WORK MODE</Text>
          <Pressable
            style={({ pressed }) => [
              styles.selectButton,
              pressed && styles.selectButtonPressed,
            ]}
            onPress={() => {
              Keyboard.dismiss();
              setActivePicker('mode');
            }}
            accessibilityRole="button"
            accessibilityLabel={`Work mode filter: current value ${getLabel(MODE_OPTIONS, workMode)}`}
          >
            <Text style={styles.selectText}>{getLabel(MODE_OPTIONS, workMode)}</Text>
            <Text style={styles.chevron}>▾</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>EXPERIENCE LEVEL</Text>
        <Pressable
          style={({ pressed }) => [
            styles.selectButton,
            pressed && styles.selectButtonPressed,
          ]}
          onPress={() => {
            Keyboard.dismiss();
            setActivePicker('exp');
          }}
          accessibilityRole="button"
          accessibilityLabel={`Experience level filter: current value ${getLabel(EXP_OPTIONS, experience)}`}
        >
          <Text style={styles.selectText}>{getLabel(EXP_OPTIONS, experience)}</Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.searchBtn,
            pressed && styles.searchBtnPressed,
            hasActiveFilters && styles.searchBtnActive,
          ]}
          onPress={handleSearch}
          accessibilityRole="button"
          accessibilityLabel="Generate Search URLs"
        >
          <Text style={styles.searchBtnText}>Generate Search URLs</Text>
        </Pressable>

        {hasActiveFilters && (
          <Pressable
            style={({ pressed }) => [
              styles.clearBtn,
              pressed && styles.clearBtnPressed,
            ]}
            onPress={handleClear}
            accessibilityRole="button"
            accessibilityLabel="Reset Search Filters"
          >
            <Text style={styles.clearBtnText}>Reset</Text>
          </Pressable>
        )}
      </View>

      {/* Selector Bottom Sheet Modal */}
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActivePicker(null)}
        accessibilityViewIsModal
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setActivePicker(null)}
            accessibilityRole="button"
            accessibilityLabel="Close picker backdrop"
          />
          <View style={styles.pickerModal}>
            <View style={styles.dragHandleRow}>
              <View style={styles.dragHandle} />
            </View>

            <Text style={styles.pickerTitle}>
              Select {activePicker === 'type' ? 'Job Type' : activePicker === 'mode' ? 'Work Mode' : 'Experience Level'}
            </Text>

            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              {(activePicker === 'type'
                ? TYPE_OPTIONS
                : activePicker === 'mode'
                ? MODE_OPTIONS
                : EXP_OPTIONS
              ).map((opt) => {
                const isSelected =
                  (activePicker === 'type' && jobType === opt.value) ||
                  (activePicker === 'mode' && workMode === opt.value) ||
                  (activePicker === 'exp' && experience === opt.value);

                return (
                  <Pressable
                    key={opt.value}
                    style={({ pressed }) => [
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => {
                      if (activePicker === 'type') setJobType(opt.value);
                      if (activePicker === 'mode') setWorkMode(opt.value);
                      if (activePicker === 'exp') setExperience(opt.value);
                      setActivePicker(null);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${opt.label}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected ? styles.optionSelected : null,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
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
    borderRadius: 14,
    padding: 18,
    marginVertical: 14,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  heading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.slate,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.slate,
    letterSpacing: 0.4,
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
  selectButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
    color: Colors.ink,
  },
  chevron: {
    fontSize: 12,
    color: Colors.slate,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  searchBtn: {
    flex: 1,
    backgroundColor: Colors.brand,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchBtnPressed: {
    backgroundColor: Colors.brandDark,
  },
  searchBtnActive: {
    backgroundColor: Colors.brandDark,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  clearBtn: {
    backgroundColor: Colors.tray,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnPressed: {
    backgroundColor: Colors.border,
  },
  clearBtnText: {
    color: Colors.inkSoft,
    fontWeight: '600',
    fontSize: 13,
  },
  selectButtonPressed: {
    backgroundColor: Colors.tray,
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
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
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
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 46,
  },
  optionRowSelected: {
    backgroundColor: Colors.brandSoft,
  },
  optionText: {
    fontSize: 14.5,
    color: Colors.ink,
    fontWeight: '500',
  },
  optionSelected: {
    color: Colors.brandDark,
    fontWeight: '700',
  },
  checkMark: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.brandDark,
  },
});

