import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../theme/colors';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

/**
 * Full-screen modal overlay with centered activity indicator.
 * Use for simulated API calls to provide immediate feedback.
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
}) => (
  <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
});

export default LoadingOverlay;
