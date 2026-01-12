import Geolocation from 'react-native-geolocation-service';
import {Platform, Alert, PermissionsAndroid} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {LocationData} from '../types';

export const locationService = {
  requestLocationPermission: async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'PPDU needs access to your location for safety features',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  },

  checkLocationPermission: async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted;
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  },

  getCurrentLocation: async (): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      const hasPermission = locationService.checkLocationPermission();
      
      if (!hasPermission) {
        resolve(null);
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };
          resolve(locationData);
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  },

  watchLocation: (callback: (location: LocationData | null) => void): number => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        };
        callback(locationData);
      },
      (error) => {
        console.error('Error watching location:', error);
        callback(null);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 5000, // Update every 5 seconds
        fastestInterval: 2000, // Fastest update every 2 seconds
      },
    );

    return watchId;
  },

  clearLocationWatch: (watchId: number): void => {
    Geolocation.clearWatch(watchId);
  },

  getAddressFromCoordinates: async (
    latitude: number,
    longitude: number,
  ): Promise<string | null> => {
    try {
      // In a real app, you would use a geocoding service like Google Maps Geocoding API
      // For now, return a placeholder
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  },

  calculateDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  },

  isLocationInKnownArea: async (location: LocationData): Promise<boolean> => {
    try {
      // In a real app, you would check against known safe areas
      // For now, return true as a placeholder
      return true;
    } catch (error) {
      console.error('Error checking if location is in known area:', error);
      return false;
    }
  },

  getMapsUrl: (latitude: number, longitude: number): string => {
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  },

  openMapsApp: async (latitude: number, longitude: number): Promise<boolean> => {
    try {
      const url = locationService.getMapsUrl(latitude, longitude);
      const {Linking} = require('react-native');
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error opening maps app:', error);
      return false;
    }
  },
};
