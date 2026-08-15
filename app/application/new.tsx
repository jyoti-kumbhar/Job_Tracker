import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { ApplicationForm } from '../../components/ApplicationForm';
import { useApplications } from '../../hooks/useApplications';
import { ApplicationFormData } from '../../types/application';

export default function NewApplicationScreen() {
  const router = useRouter();
  const { addApplication } = useApplications();

  const handleSave = async (data: ApplicationFormData) => {
    try {
      await addApplication(data);
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save application');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>New entry</Text>
        </View>
        <ApplicationForm
          onSave={handleSave}
          onCancel={() => router.back()}
          submitButtonText="Save entry"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.ink,
  },
});
