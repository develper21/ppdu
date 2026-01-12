import React, {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import {SOSData, SOSState, LocationData, EmergencyContact} from '@types/index';
import {sosService} from '@services/sosService';
import {locationService} from '@services/locationService';
import {notificationService} from '@services/notificationService';
import {STORAGE_KEYS, SOS_LOCATION_UPDATE_INTERVAL} from '@constants/index';

interface SOSContextType extends SOSState {
  activateSOS: (triggerType: 'manual' | 'voice' | 'timer' | 'auto') => Promise<void>;
  deactivateSOS: () => Promise<void>;
  updateLocation: (location: LocationData) => void;
  addEmergencyContact: (contact: EmergencyContact) => Promise<void>;
  removeEmergencyContact: (contactId: string) => Promise<void>;
  testSOS: () => Promise<void>;
}

const SOSContext = createContext<SOSContextType | undefined>(undefined);

type SOSAction =
  | {type: 'SET_SOS_ACTIVE'; payload: SOSData}
  | {type: 'SET_SOS_INACTIVE'}
  | {type: 'SET_LOCATION'; payload: LocationData}
  | {type: 'SET_LOCATION_TRACKING'; payload: boolean}
  | {type: 'UPDATE_SOS_DATA'; payload: Partial<SOSData>};

const sosReducer = (state: SOSState, action: SOSAction): SOSState => {
  switch (action.type) {
    case 'SET_SOS_ACTIVE':
      return {
        ...state,
        isActive: true,
        currentSOS: action.payload,
        isTrackingLocation: true,
      };
    case 'SET_SOS_INACTIVE':
      return {
        ...state,
        isActive: false,
        currentSOS: null,
        isTrackingLocation: false,
      };
    case 'SET_LOCATION':
      return {...state, location: action.payload};
    case 'SET_LOCATION_TRACKING':
      return {...state, isTrackingLocation: action.payload};
    case 'UPDATE_SOS_DATA':
      return {
        ...state,
        currentSOS: state.currentSOS
          ? {...state.currentSOS, ...action.payload}
          : null,
      };
    default:
      return state;
  }
};

const initialState: SOSState = {
  isActive: false,
  currentSOS: null,
  location: null,
  isTrackingLocation: false,
};

interface SOSProviderProps {
  children: ReactNode;
}

export const SOSProvider: React.FC<SOSProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(sosReducer, initialState);

  useEffect(() => {
    let locationInterval: NodeJS.Timeout;

    if (state.isActive && state.isTrackingLocation) {
      locationInterval = setInterval(async () => {
        try {
          const location = await locationService.getCurrentLocation();
          if (location) {
            dispatch({type: 'SET_LOCATION', payload: location});
            
            if (state.currentSOS) {
              await sosService.updateSOSLocation(state.currentSOS.id, location);
            }
          }
        } catch (error) {
          console.error('Error updating SOS location:', error);
        }
      }, SOS_LOCATION_UPDATE_INTERVAL);
    }

    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [state.isActive, state.isTrackingLocation, state.currentSOS]);

  const activateSOS = async (
    triggerType: 'manual' | 'voice' | 'timer' | 'auto',
  ): Promise<void> => {
    try {
      const location = await locationService.getCurrentLocation();
      
      const sosData: SOSData = {
        id: Date.now().toString(),
        userId: '', // Will be set by auth service
        location: location || undefined,
        timestamp: new Date().toISOString(),
        isActive: true,
        triggerType,
        contactsNotified: [],
      };

      const response = await sosService.activateSOS(sosData);
      
      if (response.success) {
        dispatch({type: 'SET_SOS_ACTIVE', payload: sosData});
        
        // Send notifications to emergency contacts
        await notificationService.sendEmergencyAlert(sosData);
        
        // Make emergency call if configured
        await sosService.makeEmergencyCall();
        
        // Send SMS with location
        if (location) {
          await sosService.sendLocationSMS(location);
        }
      }
    } catch (error) {
      console.error('Error activating SOS:', error);
    }
  };

  const deactivateSOS = async (): Promise<void> => {
    try {
      if (state.currentSOS) {
        await sosService.deactivateSOS(state.currentSOS.id);
      }
      
      dispatch({type: 'SET_SOS_INACTIVE'});
      
      // Send deactivation notification
      await notificationService.sendSOSDeactivationNotice();
    } catch (error) {
      console.error('Error deactivating SOS:', error);
    }
  };

  const updateLocation = (location: LocationData): void => {
    dispatch({type: 'SET_LOCATION', payload: location});
  };

  const addEmergencyContact = async (contact: EmergencyContact): Promise<void> => {
    try {
      await sosService.addEmergencyContact(contact);
    } catch (error) {
      console.error('Error adding emergency contact:', error);
    }
  };

  const removeEmergencyContact = async (contactId: string): Promise<void> => {
    try {
      await sosService.removeEmergencyContact(contactId);
    } catch (error) {
      console.error('Error removing emergency contact:', error);
    }
  };

  const testSOS = async (): Promise<void> => {
    try {
      await notificationService.sendTestAlert();
    } catch (error) {
      console.error('Error testing SOS:', error);
    }
  };

  const value: SOSContextType = {
    ...state,
    activateSOS,
    deactivateSOS,
    updateLocation,
    addEmergencyContact,
    removeEmergencyContact,
    testSOS,
  };

  return <SOSContext.Provider value={value}>{children}</SOSContext.Provider>;
};

export const useSOS = (): SOSContextType => {
  const context = useContext(SOSContext);
  if (context === undefined) {
    throw new Error('useSOS must be used within an SOSProvider');
  }
  return context;
};
