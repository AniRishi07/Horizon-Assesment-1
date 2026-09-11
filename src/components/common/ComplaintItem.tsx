import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, ProgressBar } from 'react-native-paper';
import { Complaint, ComplaintStatus } from '../../types';
import { Colors } from '../../theme/colors';

interface ComplaintItemProps {
  complaint: Complaint;
}

const STATUS_CONFIG: Record<
  ComplaintStatus,
  { label: string; color: string; progress: number; chipBg: string }
> = {
  PENDING: {
    label: 'Pending',
    color: Colors.pending,
    progress: 0.35,
    chipBg: '#FEF3C7',
  },
  RESOLVED: {
    label: 'Resolved',
    color: Colors.resolved,
    progress: 1.0,
    chipBg: '#D1FAE5',
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Complaint list item with status chip and progress bar.
 */
const ComplaintItem: React.FC<ComplaintItemProps> = ({ complaint }) => {
  const cfg = STATUS_CONFIG[complaint.status];

  return (
    <Card style={styles.card} elevation={1}>
      <Card.Content>
        {/* Title row with status chip */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {complaint.title}
          </Text>
          <Chip
            style={[styles.chip, { backgroundColor: cfg.chipBg }]}
            textStyle={[styles.chipText, { color: cfg.color }]}
          >
            {cfg.label}
          </Chip>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {complaint.description}
        </Text>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            Progress: {complaint.status === 'RESOLVED' ? '100%' : '35%'}
          </Text>
          <ProgressBar
            progress={cfg.progress}
            color={cfg.color}
            style={styles.progressBar}
          />
        </View>

        {/* Date */}
        <Text style={styles.date}>Raised on {formatDate(complaint.createdAt)}</Text>
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
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
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
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressSection: {
    gap: 4,
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  date: {
    fontSize: 11,
    color: Colors.textDisabled,
    marginTop: 4,
  },
});

export default ComplaintItem;
