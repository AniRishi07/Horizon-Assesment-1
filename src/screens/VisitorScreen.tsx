import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text, TextInput, Button, Card, Chip } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { fetchVisitors, createVisitor } from '../api/apiService';
import { Visitor } from '../types';
import EmptyState from '../components/common/EmptyState';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { Colors } from '../theme/colors';

/**
 * VisitorScreen — Resident pre-approval portal.
 * - Enter visitor name and expected date
 * - System generates a random 4-digit entry code
 * - Active pre-approvals shown in a horizontal scroll list
 */
const VisitorScreen: React.FC = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [visitorName, setVisitorName] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [nameError, setNameError] = useState('');
  const [dateError, setDateError] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await fetchVisitors(user.id);
      setVisitors(data);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const validate = (): boolean => {
    let valid = true;
    if (!visitorName.trim()) {
      setNameError('Visitor name is required');
      valid = false;
    } else setNameError('');
    if (!expectedDate.trim()) {
      setDateError('Expected date is required');
      valid = false;
    } else setDateError('');
    return valid;
  };

  const handleAddVisitor = async () => {
    if (!user || !validate()) return;
    try {
      setSubmitting(true);
      const created = await createVisitor(user.id, visitorName.trim(), expectedDate.trim());
      setVisitors(prev => [created, ...prev]);
      setVisitorName('');
      setExpectedDate('');
      Alert.alert(
        '✅ Visitor Pre-Approved',
        `Entry Code for ${created.name}: ${created.code}\n\nShare this code with your visitor.`
      );
    } catch (e) {
      Alert.alert('Error', 'Could not add visitor. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay visible message="Loading visitor data..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LoadingOverlay visible={submitting} message="Adding visitor..." />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>👤 Pre-approve a Visitor</Text>
          <Text style={styles.sectionSubtitle}>
            Add your visitor's details. An entry code will be generated automatically.
          </Text>

          <TextInput
            label="Visitor Name"
            value={visitorName}
            onChangeText={t => { setVisitorName(t); setNameError(''); }}
            mode="outlined"
            style={styles.input}
            activeOutlineColor={Colors.primary}
            error={!!nameError}
          />
          {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

          <TextInput
            label="Expected Date (e.g. 15 Sep 2026)"
            value={expectedDate}
            onChangeText={d => { setExpectedDate(d); setDateError(''); }}
            mode="outlined"
            style={styles.input}
            activeOutlineColor={Colors.primary}
            error={!!dateError}
          />
          {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

          <Button
            mode="contained"
            onPress={handleAddVisitor}
            loading={submitting}
            disabled={submitting}
            buttonColor={Colors.primary}
            style={styles.addBtn}
            contentStyle={styles.addBtnContent}
          >
            Generate Entry Code
          </Button>
        </View>

        {/* Active Pre-approvals */}
        <Text style={styles.listTitle}>🎟 Active Pre-approvals</Text>

        {visitors.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No Visitors"
            subtitle="You haven't pre-approved any visitors yet."
          />
        ) : (
          <FlatList
            data={visitors}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <Card style={styles.visitorCard} elevation={2}>
                <Card.Content style={styles.visitorCardContent}>
                  <View style={styles.codeCircle}>
                    <Text style={styles.codeText}>{item.code}</Text>
                  </View>
                  <Text style={styles.visitorName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.visitorDate} numberOfLines={1}>
                    {item.expectedDate}
                  </Text>
                  <Chip
                    style={[
                      styles.statusChip,
                      { backgroundColor: item.status === 'EXPECTED' ? '#DBEAFE' : '#D1FAE5' },
                    ]}
                    textStyle={[
                      styles.statusChipText,
                      { color: item.status === 'EXPECTED' ? Colors.info : Colors.success },
                    ]}
                  >
                    {item.status === 'EXPECTED' ? '⏳ Expected' : '✅ Arrived'}
                  </Chip>
                </Card.Content>
              </Card>
            )}
          />
        )}

        <View style={{ height: 32 }} />
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
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
  addBtn: { marginTop: 12, borderRadius: 8 },
  addBtnContent: { height: 48 },
  listTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  visitorCard: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  visitorCardContent: {
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  codeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  codeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  visitorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  visitorDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statusChip: {
    height: 24,
    borderRadius: 4,
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
  },
});

export default VisitorScreen;
