import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  fetchComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from '../api/apiService';
import { Complaint } from '../types';
import ComplaintItem from '../components/common/ComplaintItem';
import EmptyState from '../components/common/EmptyState';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { Colors } from '../theme/colors';

/**
 * AdminComplaintsScreen — Admin view of ALL complaints across all residents.
 */
const AdminComplaintsScreen: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setIsLoading(true);
      const data = await fetchComplaints();
      setComplaints(data);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleResolve = async (complaint: Complaint) => {
    const proceed = async () => {
      try {
        setUpdating(true);
        const updated = await updateComplaintStatus(complaint.id, 'RESOLVED');
        setComplaints(prev =>
          prev.map(c => (c.id === complaint.id ? updated : c))
        );
      } catch (e) {
        Alert.alert('Error', 'Failed to update complaint.');
      } finally {
        setUpdating(false);
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm) {
        if (window.confirm(`Mark "${complaint.title}" as Resolved?`)) {
          await proceed();
        }
      } else {
        await proceed();
      }
      return;
    }

    Alert.alert(
      'Resolve Complaint',
      `Mark "${complaint.title}" as Resolved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Resolve', onPress: proceed },
      ]
    );
  };

  const handleDelete = async (complaint: Complaint) => {
    const proceed = async () => {
      try {
        setUpdating(true);
        await deleteComplaint(complaint.id);
        setComplaints(prev => prev.filter(c => c.id !== complaint.id));
      } catch (e) {
        Alert.alert('Error', 'Failed to remove complaint.');
      } finally {
        setUpdating(false);
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm) {
        if (window.confirm(`Clear complaint "${complaint.title}"?`)) {
          await proceed();
        }
      } else {
        await proceed();
      }
      return;
    }

    Alert.alert(
      'Clear Complaint',
      `Are you sure you want to clear "${complaint.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: proceed },
      ]
    );
  };

  if (isLoading) {
    return <LoadingOverlay visible message="Loading all complaints..." />;
  }

  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={updating} message="Updating complaint..." />

      {/* Stats banner */}
      <View style={styles.statsBanner}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{complaints.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: Colors.pending }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: Colors.resolved }]}>{resolvedCount}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      <FlatList
        data={complaints}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ComplaintItem
            complaint={item}
            onResolve={handleResolve}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="file-x"
            title="No Complaints"
            subtitle="No residents have raised complaints yet."
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
          complaints.length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.divider,
  },
  listContent: { paddingBottom: 24 },
  emptyContainer: { flex: 1 },
});

export default AdminComplaintsScreen;
