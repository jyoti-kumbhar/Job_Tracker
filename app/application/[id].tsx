import React from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { ApplicationForm } from '../../components/ApplicationForm';
import { useApplications } from '../../hooks/useApplications';
import { ApplicationFormData } from '../../types/application';

export default function EditApplicationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { applications, loading, editApplication, removeApplication } = useApplications();

  const application = applications.find((app) => app.id === id) || null;

  const handleSave = async (data: ApplicationFormData) => {
    if (!id) return;
    try {
      await editApplication(id, data);
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update application');
    }
  };

  const handleDelete = () => {
    if (!id || !application) return;
    Alert.alert(
      'Delete Application',
      `Are you sure you want to delete "${application.company} - ${application.role}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeApplication(id);
              router.back();
            } catch {
              Alert.alert('Error', 'Failed to delete application');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Colors.brand} />
        </View>
      </SafeAreaView>
    );
  }

  if (!application) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Application not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit entry</Text>
        </View>
        <ApplicationForm
          initialData={application}
          onSave={handleSave}
          onCancel={() => router.back()}
          onDelete={handleDelete}
          submitButtonText="Update entry"
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
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    fontSize: 14,
    color: Colors.statusRejected,
    textAlign: 'center',
    marginTop: 40,
  },
});
