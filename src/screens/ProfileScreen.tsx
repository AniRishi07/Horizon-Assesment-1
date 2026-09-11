import React from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Divider } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

/**
 * ProfileScreen — Displays user information and sign-out.
 * Role badge highlights ADMIN vs RESIDENT status.
 */
const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  return (
    <ScrollView style={styles.container}>
      {/* Avatar / Header */}
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
          style={{ backgroundColor: Colors.primary }}
          color="#FFFFFF"
        />
        <Text style={styles.name}>{user.name}</Text>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: isAdmin ? Colors.secondary : Colors.info },
          ]}
        >
          <Text style={styles.roleText}>
            {isAdmin ? '🛡 ADMIN' : '🏠 RESIDENT'}
          </Text>
        </View>
      </View>

      {/* Details card */}
      <Card style={styles.card} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <InfoRow label="Email" value={user.email} />
          <Divider style={styles.divider} />
          <InfoRow label="Unit Number" value={user.unitNumber} />
          <Divider style={styles.divider} />
          <InfoRow label="User ID" value={user.id} />
          <Divider style={styles.divider} />
          <InfoRow
            label="Access Level"
            value={
              isAdmin
                ? 'Post Notices · View All Complaints'
                : 'View Notices · Raise Complaints · Visitor Pre-approval'
            }
          />
        </Card.Content>
      </Card>

      {/* Sign out */}
      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutBtn}
        contentStyle={styles.signOutContent}
        textColor={Colors.error}
        icon="logout"
      >
        Sign Out
      </Button>

      {/* App version */}
      <Text style={styles.version}>Horizon Society Connect v1.0.0</Text>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  cardContent: { gap: 4 },
  infoRow: {
    paddingVertical: 12,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  divider: { backgroundColor: Colors.border },
  signOutBtn: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderColor: Colors.error,
    borderRadius: 8,
  },
  signOutContent: { height: 48 },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textDisabled,
    marginBottom: 32,
  },
});

export default ProfileScreen;
