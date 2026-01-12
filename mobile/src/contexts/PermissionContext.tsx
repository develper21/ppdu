import React, {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import {Platform, Alert, Linking} from 'react-native';
import {check, request, PERMISSIONS, RESULTS, PermissionStatus as RNPermissionStatus} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserPermissions, PermissionState, PermissionStatus} from '@types/index';
import {STORAGE_KEYS, PERMISSIONS as APP_PERMISSIONS} from '@constants/index';

interface PermissionContextType extends PermissionState {
  requestPermission: (permission: keyof UserPermissions) => Promise<boolean>;
  checkPermission: (permission: keyof UserPermissions) => Promise<PermissionStatus>;
  requestAllPermissions: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  showPermissionRationale: (permission: keyof UserPermissions) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

type PermissionAction =
  | {type: 'SET_PERMISSION'; payload: {key: keyof UserPermissions; status: PermissionStatus}}
  | {type: 'SET_PERMISSIONS'; payload: UserPermissions}
  | {type: 'SET_REQUESTING'; payload: boolean}
  | {type: 'COMPLETE_ONBOARDING'};

const permissionReducer = (state: PermissionState, action: PermissionAction): PermissionState => {
  switch (action.type) {
    case 'SET_PERMISSION':
      return {
        ...state,
        permissions: {
          ...state.permissions,
          [action.payload.key]: action.payload.status,
        },
      };
    case 'SET_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload,
      };
    case 'SET_REQUESTING':
      return {...state, isRequesting: action.payload};
    case 'COMPLETE_ONBOARDING':
      return {...state, hasCompletedOnboarding: true};
    default:
      return state;
  }
};

const initialState: PermissionState = {
  permissions: {
    location: 'not_determined',
    microphone: 'not_determined',
    motion: 'not_determined',
    notifications: 'not_determined',
    backgroundLocation: 'not_determined',
  },
  isRequesting: false,
  hasCompletedOnboarding: false,
};

interface PermissionProviderProps {
  children: ReactNode;
}

const getPlatformPermission = (permission: string): string => {
  if (Platform.OS === 'ios') {
    switch (permission) {
      case APP_PERMISSIONS.LOCATION:
        return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      case APP_PERMISSIONS.BACKGROUND_LOCATION:
        return PERMISSIONS.IOS.LOCATION_ALWAYS;
      case APP_PERMISSIONS.MICROPHONE:
        return PERMISSIONS.IOS.MICROPHONE;
      case APP_PERMISSIONS.MOTION:
        return PERMISSIONS.IOS.MOTION;
      case APP_PERMISSIONS.NOTIFICATIONS:
        return PERMISSIONS.IOS.NOTIFICATIONS;
      default:
        return '';
    }
  } else {
    switch (permission) {
      case APP_PERMISSIONS.LOCATION:
        return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      case APP_PERMISSIONS.BACKGROUND_LOCATION:
        return PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
      case APP_PERMISSIONS.MICROPHONE:
        return PERMISSIONS.ANDROID.RECORD_AUDIO;
      case APP_PERMISSIONS.MOTION:
        return PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION;
      case APP_PERMISSIONS.NOTIFICATIONS:
        return PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
      default:
        return '';
    }
  }
};

const convertRNStatusToAppStatus = (rnStatus: RNPermissionStatus): PermissionStatus => {
  switch (rnStatus) {
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.BLOCKED:
      return 'never_ask_again';
    case RESULTS.UNAVAILABLE:
      return 'never_ask_again';
    default:
      return 'not_determined';
  }
};

const getPermissionRationale = (permission: keyof UserPermissions): {title: string; message: string} => {
  switch (permission) {
    case 'location':
      return {
        title: 'Location Access',
        message: 'PPDU needs location access to share your location with emergency contacts during an SOS situation. Your location is only shared during emergencies.',
      };
    case 'backgroundLocation':
      return {
        title: 'Background Location Access',
        message: 'Background location allows PPDU to monitor your safety even when the app is not actively in use. This is crucial for automatic emergency detection.',
      };
    case 'microphone':
      return {
        title: 'Microphone Access',
        message: 'Microphone access enables the voice trigger feature ("Help me now") to activate SOS hands-free. No audio is stored or transmitted except during emergencies.',
      };
    case 'motion':
      return {
        title: 'Motion & Activity Recognition',
        message: 'Motion detection helps PPDU understand if you\'re walking, running, or in a vehicle to provide better safety awareness.',
      };
    case 'notifications':
      return {
        title: 'Push Notifications',
        message: 'Notifications keep you informed about safety alerts, SOS status updates, and important security information.',
      };
    default:
      return {
        title: 'Permission Required',
        message: 'This permission is needed for PPDU to function properly.',
      };
  }
};

export const PermissionProvider: React.FC<PermissionProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(permissionReducer, initialState);

  useEffect(() => {
    loadStoredPermissions();
    checkOnboardingStatus();
  }, []);

  const loadStoredPermissions = async () => {
    try {
      const storedPermissions = await AsyncStorage.getItem(STORAGE_KEYS.PERMISSIONS);
      if (storedPermissions) {
        const permissions = JSON.parse(storedPermissions);
        dispatch({type: 'SET_PERMISSIONS', payload: permissions});
      }
    } catch (error) {
      console.error('Error loading stored permissions:', error);
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      if (onboardingCompleted === 'true') {
        dispatch({type: 'COMPLETE_ONBOARDING'});
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const requestPermission = async (permission: keyof UserPermissions): Promise<boolean> => {
    try {
      dispatch({type: 'SET_REQUESTING', payload: true});

      const platformPermission = getPlatformPermission(permission);
      if (!platformPermission) {
        return false;
      }

      const currentStatus = await check(platformPermission);
      
      if (currentStatus === RESULTS.GRANTED) {
        dispatch({
          type: 'SET_PERMISSION',
          payload: {key: permission, status: 'granted'},
        });
        await savePermissions();
        return true;
      }

      const result = await request(platformPermission);
      const appStatus = convertRNStatusToAppStatus(result);

      dispatch({
        type: 'SET_PERMISSION',
        payload: {key: permission, status: appStatus},
      });

      await savePermissions();

      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    } finally {
      dispatch({type: 'SET_REQUESTING', payload: false});
    }
  };

  const checkPermission = async (permission: keyof UserPermissions): Promise<PermissionStatus> => {
    try {
      const platformPermission = getPlatformPermission(permission);
      if (!platformPermission) {
        return 'not_determined';
      }

      const result = await check(platformPermission);
      return convertRNStatusToAppStatus(result);
    } catch (error) {
      console.error('Error checking permission:', error);
      return 'not_determined';
    }
  };

  const requestAllPermissions = async (): Promise<void> => {
    const permissions: (keyof UserPermissions)[] = [
      'location',
      'microphone',
      'motion',
      'notifications',
      'backgroundLocation',
    ];

    for (const permission of permissions) {
      await requestPermission(permission);
    }
  };

  const completeOnboarding = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      dispatch({type: 'COMPLETE_ONBOARDING'});
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const showPermissionRationale = (permission: keyof UserPermissions): void => {
    const rationale = getPermissionRationale(permission);
    
    Alert.alert(
      rationale.title,
      rationale.message,
      [
        {
          text: 'Not Now',
          style: 'cancel',
        },
        {
          text: 'Grant Permission',
          onPress: () => requestPermission(permission),
        },
      ],
      {cancelable: false},
    );
  };

  const savePermissions = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(state.permissions));
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  };

  const value: PermissionContextType = {
    ...state,
    requestPermission,
    checkPermission,
    requestAllPermissions,
    completeOnboarding,
    showPermissionRationale,
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
