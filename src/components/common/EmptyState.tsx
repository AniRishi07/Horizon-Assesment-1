import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { FileX, AlertCircle, InboxIcon } from 'lucide-react-native';
import { Colors } from '../../theme/colors';

type IconName = 'inbox' | 'file-x' | 'alert';

interface EmptyStateProps {
  icon?: IconName;
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<IconName, React.FC<{ size: number; color: string }>> = {
  inbox: ({ size, color }) => <InboxIcon size={size} color={color} />,
  'file-x': ({ size, color }) => <FileX size={size} color={color} />,
  alert: ({ size, color }) => <AlertCircle size={size} color={color} />,
};

/**
 * Reusable empty state component shown when lists have no data.
 * Uses Lucide icons for visual consistency.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title = 'No Data',
  subtitle = "Nothing here yet. Check back later.",
}) => {
  const IconComponent = ICON_MAP[icon];

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <IconComponent size={52} color={Colors.textDisabled} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 12,
  },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;
