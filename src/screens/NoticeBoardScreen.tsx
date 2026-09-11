import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { fetchNotices } from '../api/apiService';
import { Notice } from '../types';
import NoticeCard from '../components/common/NoticeCard';
import EmptyState from '../components/common/EmptyState';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { Colors } from '../theme/colors';

/**
 * NoticeBoardScreen — Resident-facing view of all community notices.
 * Pull-to-refresh supported.
 */
const NoticeBoardScreen: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setIsLoading(true);
      const data = await fetchNotices();
      setNotices(data);
    } catch (e) {
      console.error('[NoticeBoardScreen] fetch error:', e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return <LoadingOverlay visible message="Fetching notices..." />;
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
            subtitle="There are no community notices at this time."
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
  },
});

export default NoticeBoardScreen;
