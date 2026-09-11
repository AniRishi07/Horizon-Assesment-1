import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from './src/theme/colors';

// ----------------------------------------------------------------
// Material Design 3 theme customized with Horizon brand colors
// ----------------------------------------------------------------
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    secondary: Colors.secondary,
    background: Colors.background,
    surface: Colors.surface,
    error: Colors.error,
    onPrimary: Colors.textOnPrimary,
    onSurface: Colors.textPrimary,
    outline: Colors.border,
  },
};

/**
 * App — Root component.
 * Wraps the entire application with:
 *   1. AuthProvider  — session management and role-based access
 *   2. PaperProvider — Material Design 3 theming
 *   3. AppNavigator  — AuthGate + navigation stacks
 */
export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}
