import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  FAB,
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Portal,
} from 'react-native-paper';
import { fetchNotices, createNotice } from '../api/apiService';
import { Notice, NoticeCategory, NoticePriority } from '../types';
import NoticeCard from '../components/common/NoticeCard';
import EmptyState from '../components/common/EmptyState';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { Colors } from '../theme/colors';

/**
 * AdminNoticeBoardScreen — Admin view with FAB to create notices.
 * Includes a bottom-sheet-style modal form with category and priority selection.
 */
const AdminNoticeBoardScreen: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<NoticeCategory>('GENERAL');
  const [formPriority, setFormPriority] = useState<NoticePriority>('LOW');

  const load = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setIsLoading(true);
      const data = await fetchNotices();
      setNotices(data);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormCategory('GENERAL');
    setFormPriority('LOW');
  };

  const handleCreate = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      Alert.alert('Validation Error', 'Title and content are required.');
      return;
    }
    try {
      setSubmitting(true);
      const created = await createNotice({
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        priority: formPriority,
      });
      setNotices(prev => [created, ...prev]);
      setModalVisible(false);
      resetForm();
      Alert.alert('✅ Success', 'Notice published to all residents.');
    } catch (e) {
      Alert.alert('Error', 'Failed to create notice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay visible message="Loading notices..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NoticeCard notice={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="inbox"
            title="No Notices"
            subtitle="Tap the + button to post the first notice."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          notices.length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* Create Notice FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        color="#FFFFFF"
        onPress={() => setModalVisible(true)}
        customSize={56}
      />

      {/* Create Notice Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <LoadingOverlay visible={submitting} message="Publishing notice..." />
          <KeyboardAvoidingView
            style={styles.modalBackdrop}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>📢 New Notice</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <TextInput
                  label="Title"
                  value={formTitle}
                  onChangeText={setFormTitle}
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor={Colors.primary}
                />

                <TextInput
                  label="Content"
                  value={formContent}
                  onChangeText={setFormContent}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={styles.input}
                  activeOutlineColor={Colors.primary}
                />

                <Text style={styles.fieldLabel}>Category</Text>
                <SegmentedButtons
                  value={formCategory}
                  onValueChange={v => setFormCategory(v as NoticeCategory)}
                  buttons={[
                    { value: 'GENERAL', label: 'General' },
                    { value: 'EVENT', label: 'Event' },
                    { value: 'MAINTENANCE', label: 'Maintenance' },
                  ]}
                  style={styles.segmented}
                />

                <Text style={styles.fieldLabel}>Priority</Text>
                <SegmentedButtons
                  value={formPriority}
                  onValueChange={v => setFormPriority(v as NoticePriority)}
                  buttons={[
                    { value: 'LOW', label: '🟢 Low' },
                    { value: 'HIGH', label: '🔴 High' },
                  ]}
                  style={styles.segmented}
                />

                <View style={styles.modalActions}>
                  <Button
                    mode="outlined"
                    onPress={() => { setModalVisible(false); resetForm(); }}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleCreate}
                    loading={submitting}
                    disabled={submitting}
                    buttonColor={Colors.primary}
                    style={styles.submitBtn}
                  >
                    Publish
                  </Button>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { paddingVertical: 12, paddingBottom: 80 },
  emptyContainer: { flex: 1 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.primary,
    borderRadius: 28,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.divider,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  input: { marginBottom: 12, backgroundColor: Colors.surface },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 4,
  },
  segmented: { marginBottom: 16 },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: { flex: 1 },
  submitBtn: { flex: 1 },
});

export default AdminNoticeBoardScreen;
