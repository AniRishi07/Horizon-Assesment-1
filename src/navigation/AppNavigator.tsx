import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import LoadingOverlay from '../components/common/LoadingOverlay';

/**
 * AppNavigator — Root navigator and AuthGate.
 *
 * Acts as the high-order component that switches between the Auth flow
 * and the Main app based on AuthContext state. When isLoading=true,
 * shows a full-screen splash while AsyncStorage session is rehydrated.
 */
const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay visible message="Horizon Society..." />;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
