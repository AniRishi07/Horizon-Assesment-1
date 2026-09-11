import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { fetchComplaintsByUser, createComplaint } from '../api/apiService';
import { Complaint } from '../types';
import ComplaintItem from '../components/common/ComplaintItem';
import EmptyState from '../components/common/EmptyState';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { Colors } from '../theme/colors';

/**
 * ComplaintScreen — Resident view.
 * - Top: Submit new complaint form
 * - Bottom: My complaints list (filtered by userId)
 */
const ComplaintScreen: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');

  const load = useCallback(
    async (refresh = false) => {
      if (!user) return;
      try {
        if (refresh) setRefreshing(true);
        else setIsLoading(true);
        const data = await fetchComplaintsByUser(user.id);
        setComplaints(data);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    load();
  }, [load]);

  const validate = (): boolean => {
    let valid = true;
    if (!title.trim()) {
      setTitleError('Title is required');
      valid = false;
    } else setTitleError('');
    if (!description.trim()) {
      setDescError('Description is required');
      valid = false;
    } else setDescError('');
    return valid;
  };

  const handleSubmit = async () => {
    if (!user || !validate()) return;
    try {
      setSubmitting(true);
      const created = await createComplaint({
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
      });
      setComplaints(prev => [created, ...prev]);
      setTitle('');
      setDescription('');
      Alert.alert('✅ Complaint Raised', 'Your complaint has been submitted. We\'ll look into it shortly.');
    } catch (e) {
      Alert.alert('Error', 'Could not submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay visible message="Loading complaints..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LoadingOverlay visible={submitting} message="Submitting complaint..." />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Submit Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>🛠 Raise a Complaint</Text>
          <TextInput
            label="Title"
            value={title}
            onChangeText={t => { setTitle(t); setTitleError(''); }}
            mode="outlined"
            style={styles.input}
            activeOutlineColor={Colors.primary}
            error={!!titleError}
          />
          {titleError ? <Text style={styles.error}>{titleError}</Text> : null}

          <TextInput
            label="Description"
            value={description}
            onChangeText={d => { setDescription(d); setDescError(''); }}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            activeOutlineColor={Colors.primary}
            error={!!descError}
          />
          {descError ? <Text style={styles.error}>{descError}</Text> : null}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            buttonColor={Colors.primary}
            style={styles.submitBtn}
            contentStyle={styles.submitBtnContent}
          >
            Submit Complaint
          </Button>
        </View>

        {/* My Complaints */}
        <Text style={styles.myComplaintsTitle}>📋 My Complaints</Text>

        {complaints.length === 0 ? (
          <EmptyState
            icon="file-x"
            title="No Complaints"
            subtitle="You haven't raised any complaints yet."
          />
        ) : (
          complaints.map(item => (
            <ComplaintItem key={item.id} complaint={item} />
          ))
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.background },
  formCard: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.surface,
    marginBottom: 4,
  },
  error: {
    fontSize: 12,
    color: Colors.error,
    marginBottom: 4,
    marginLeft: 4,
  },
  submitBtn: { marginTop: 12, borderRadius: 8 },
  submitBtnContent: { height: 48 },
  myComplaintsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bottomPad: { height: 24 },
});

export default ComplaintScreen;
