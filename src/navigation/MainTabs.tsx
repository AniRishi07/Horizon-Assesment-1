import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, AlertCircle, Users, User } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

// Screens
import NoticeBoardScreen from '../screens/NoticeBoardScreen';
import AdminNoticeBoardScreen from '../screens/AdminNoticeBoardScreen';
import ComplaintScreen from '../screens/ComplaintScreen';
import AdminComplaintsScreen from '../screens/AdminComplaintsScreen';
import VisitorScreen from '../screens/VisitorScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type MainTabsParamList = {
  Home: undefined;
  Complaints: undefined;
  Visitors: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TAB_BAR_STYLE = {
  backgroundColor: Colors.surface,
  borderTopColor: Colors.border,
  elevation: 8,
  height: 64,
  paddingBottom: 8,
  paddingTop: 4,
};

/**
 * MainTabs — Bottom tab navigator.
 * Role-based screen switching: Admin sees AdminNoticeBoard and AdminComplaints.
 */
const MainTabs: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary, elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={isAdmin ? AdminNoticeBoardScreen : NoticeBoardScreen}
        options={{
          title: 'Notice Board',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerRight: () =>
            isAdmin ? null : undefined,
        }}
      />

      <Tab.Screen
        name="Complaints"
        component={isAdmin ? AdminComplaintsScreen : ComplaintScreen}
        options={{
          title: isAdmin ? 'All Complaints' : 'My Complaints',
          tabBarLabel: 'Complaints',
          tabBarIcon: ({ color, size }) => (
            <AlertCircle color={color} size={size} />
          ),
        }}
      />

      {!isAdmin && (
        <Tab.Screen
          name="Visitors"
          component={VisitorScreen}
          options={{
            title: 'Visitor Pre-approval',
            tabBarLabel: 'Visitors',
            tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
