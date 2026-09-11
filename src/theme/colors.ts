// ============================================================
// Horizon Society Connect — Material Design Color Palette
// ============================================================

export const Colors = {
  // Brand
  primary: '#1E40AF',       // Deep Blue
  primaryLight: '#3B64E0',
  primaryDark: '#162D7C',

  secondary: '#F59E0B',     // Amber (alerts / accents)
  secondaryLight: '#FCD34D',
  secondaryDark: '#B45309',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Complaint status
  pending: '#F59E0B',
  resolved: '#10B981',

  // Notice category
  maintenance: '#EF4444',
  event: '#8B5CF6',
  general: '#3B82F6',

  // Notice priority
  high: '#EF4444',
  low: '#10B981',

  // Neutral
  background: '#F1F5F9',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E2E8F0',
  divider: '#CBD5E1',

  // Text
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#94A3B8',
  textOnPrimary: '#FFFFFF',
} as const;

// React Native Paper theme compatible token
export const paperTheme = {
  colors: {
    primary: Colors.primary,
    secondary: Colors.secondary,
    background: Colors.background,
    surface: Colors.surface,
    error: Colors.error,
    onPrimary: Colors.textOnPrimary,
    onSurface: Colors.textPrimary,
  },
};
