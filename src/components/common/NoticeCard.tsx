import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { Notice, NoticeCategory, NoticePriority } from '../../types';
import { Colors } from '../../theme/colors';

interface NoticeCardProps {
  notice: Notice;
}

// ---- Category badge config ----
const CATEGORY_CONFIG: Record<
  NoticeCategory,
  { label: string; color: string; textColor: string }
> = {
  MAINTENANCE: { label: 'Maintenance', color: '#FEE2E2', textColor: Colors.maintenance },
  EVENT: { label: 'Event', color: '#EDE9FE', textColor: Colors.event },
  GENERAL: { label: 'General', color: '#DBEAFE', textColor: Colors.general },
};

// ---- Priority badge config ----
const PRIORITY_CONFIG: Record<
  NoticePriority,
  { label: string; color: string; textColor: string }
> = {
  HIGH: { label: '🔴 High', color: '#FEE2E2', textColor: Colors.high },
  LOW: { label: '🟢 Low', color: '#D1FAE5', textColor: Colors.low },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Notice card with color-coded category and priority badges.
 */
const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  const catCfg = CATEGORY_CONFIG[notice.category];
  const priCfg = PRIORITY_CONFIG[notice.priority];

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content>
        {/* Header row: badges + date */}
        <View style={styles.headerRow}>
          <Chip
            style={[styles.chip, { backgroundColor: catCfg.color }]}
            textStyle={[styles.chipText, { color: catCfg.textColor }]}
          >
            {catCfg.label}
          </Chip>
          <Chip
            style={[styles.chip, { backgroundColor: priCfg.color }]}
            textStyle={[styles.chipText, { color: priCfg.textColor }]}
          >
            {priCfg.label}
          </Chip>
          <Text style={styles.date}>{formatDate(notice.date)}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {notice.title}
        </Text>

        {/* Content preview */}
        <Text style={styles.content} numberOfLines={3}>
          {notice.content}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    height: 26,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  date: {
    marginLeft: 'auto',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  content: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
});

export default NoticeCard;
