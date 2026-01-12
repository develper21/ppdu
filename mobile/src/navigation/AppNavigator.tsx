import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '@contexts/AuthContext';
import {usePermissions} from '@contexts/PermissionContext';

// Auth Screens
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import OTPVerificationScreen from '@screens/auth/OTPVerificationScreen';

// Onboarding Screens
import OnboardingScreen from '@screens/onboarding/OnboardingScreen';
import PermissionsScreen from '@screens/onboarding/PermissionsScreen';
import EmergencyContactsScreen from '@screens/onboarding/EmergencyContactsScreen';

// Main App Screens
import HomeScreen from '@screens/main/HomeScreen';
import SOSScreen from '@screens/main/SOSScreen';
import ContactsScreen from '@screens/main/ContactsScreen';
import IncidentsScreen from '@screens/main/IncidentsScreen';
import SettingsScreen from '@screens/main/SettingsScreen';

// Utility Screens
import FakeCallScreen from '@screens/utility/FakeCallScreen';
import EmergencyTimerScreen from '@screens/utility/EmergencyTimerScreen';
import RiskAwarenessScreen from '@screens/main/RiskAwarenessScreen';

// Modals
import SOSActiveModal from '@components/modals/SOSActiveModal';

import {COLORS, SIZES} from '@constants/index';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
  SOSActive: undefined;
  FakeCall: undefined;
  EmergencyTimer: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: {phone: string; isLogin?: boolean};
};

export type MainTabParamList = {
  Home: undefined;
  SOS: undefined;
  Contacts: undefined;
  Incidents: undefined;
  Settings: undefined;
};

export type OnboardingStackParamList = {
  Onboarding: undefined;
  Permissions: undefined;
  EmergencyContacts: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: COLORS.background},
      }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </AuthStack.Navigator>
  );
};

const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: COLORS.background},
      }}>
      <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
      <OnboardingStack.Screen name="Permissions" component={PermissionsScreen} />
      <OnboardingStack.Screen 
        name="EmergencyContacts" 
        component={EmergencyContactsScreen} 
      />
    </OnboardingStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'SOS':
              iconName = 'emergency';
              break;
            case 'Contacts':
              iconName = 'contacts';
              break;
            case 'Incidents':
              iconName = 'history';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.surfaceVariant,
          height: SIZES.xl + SIZES.sm,
          paddingBottom: SIZES.xs,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontFamily: 'System',
          fontWeight: '600',
        },
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Safety',
          headerRight: () => <RiskAwarenessScreen />,
        }}
      />
      <Tab.Screen 
        name="SOS" 
        component={SOSScreen}
        options={{
          title: 'Emergency',
          tabBarLabel: 'SOS',
        }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen}
        options={{
          title: 'Emergency Contacts',
        }}
      />
      <Tab.Screen 
        name="Incidents" 
        component={IncidentsScreen}
        options={{
          title: 'Incident Log',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();
  const {hasCompletedOnboarding} = usePermissions();

  if (isLoading) {
    // You could return a loading screen here
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: COLORS.background},
      }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : !hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen 
            name="SOSActive" 
            component={SOSActiveModal}
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="FakeCall" 
            component={FakeCallScreen}
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="EmergencyTimer" 
            component={EmergencyTimerScreen}
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
