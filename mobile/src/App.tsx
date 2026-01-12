import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './contexts/AuthContext';
import {SOSProvider} from './contexts/SOSContext';
import {PermissionProvider} from './contexts/PermissionContext';
import AppNavigator from './navigation/AppNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <PermissionProvider>
        <AuthProvider>
          <SOSProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </SOSProvider>
        </AuthProvider>
      </PermissionProvider>
    </SafeAreaProvider>
  );
};

export default App;
