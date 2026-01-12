import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {useAuth} from '@contexts/AuthContext';
import {usePermissions} from '@contexts/PermissionContext';
import {useSOS} from '@contexts/SOSContext';
import {COLORS, SIZES} from '@constants/index';

const HomeScreen = () => {
  const {user} = useAuth();
  const {requestPermission, checkPermission} = usePermissions();
  const {location, isTrackingLocation} = useSOS();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationPermission, setLocationPermission] = useState('not_determined');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    checkLocationPermission();

    return () => clearInterval(timer);
  }, []);

  const checkLocationPermission = async () => {
    const status = await checkPermission('location');
    setLocationPermission(status);
  };

  const handleRequestLocationPermission = async () => {
    const granted = await requestPermission('location');
    if (granted) {
      setLocationPermission('granted');
      Alert.alert('Success', 'Location permission granted');
    } else {
      Alert.alert('Permission Denied', 'Location access is required for safety features');
    }
  };

  const getSafetyMessage = () => {
    const hour = currentTime.getHours();
    const isNightTime = hour >= 20 || hour <= 6;
    
    if (isNightTime) {
      return {
        level: 'high',
        message: "It's late night. Stay extra aware of your surroundings.",
        color: COLORS.warning,
      };
    }
    
    if (locationPermission !== 'granted') {
      return {
        level: 'medium',
        message: "Location access is needed for better safety monitoring.",
        color: COLORS.warning,
      };
    }
    
    return {
      level: 'low',
      message: "You're in a familiar area. Stay safe and aware.",
      color: COLORS.success,
    };
  };

  const safetyInfo = getSafetyMessage();

  const handleEmergencyContacts = () => {
    Alert.alert('Emergency Contacts', 'Manage your emergency contacts');
  };

  const handleVoiceTrigger = () => {
    Alert.alert('Voice Trigger', 'Set up your voice activation phrase');
  };

  const handleIncidentLog = () => {
    Alert.alert('Incident Log', 'View and manage your incident history');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name || 'User'}
        </Text>
        <Text style={styles.time}>
          {currentTime.toLocaleTimeString()}
        </Text>
      </View>

      {/* Safety Status Card */}
      <View style={[styles.card, styles.safetyCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Safety Status</Text>
          <View style={[styles.statusIndicator, {backgroundColor: safetyInfo.color}]} />
        </View>
        <Text style={styles.safetyMessage}>{safetyInfo.message}</Text>
        
        <View style={styles.permissionStatus}>
          <Text style={styles.permissionText}>
            📍 Location: {locationPermission === 'granted' ? '✅ Enabled' : '❌ Disabled'}
          </Text>
          {locationPermission !== 'granted' && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={handleRequestLocationPermission}>
              <Text style={styles.permissionButtonText}>Enable</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleEmergencyContacts}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>👥</Text>
            </View>
            <Text style={styles.actionLabel}>Emergency Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleVoiceTrigger}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>🎤</Text>
            </View>
            <Text style={styles.actionLabel}>Voice Trigger</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleIncidentLog}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>📝</Text>
            </View>
            <Text style={styles.actionLabel}>Incident Log</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Info */}
      {location && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Location</Text>
          <Text style={styles.locationText}>
            📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
          <Text style={styles.locationAccuracy}>
            Accuracy: ±{location.accuracy}m
          </Text>
        </View>
      )}

      {/* Emergency Contacts Summary */}
      {user?.emergencyContacts && user.emergencyContacts.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emergency Contacts</Text>
          {user.emergencyContacts.slice(0, 3).map((contact, index) => (
            <View key={contact.id} style={styles.contactItem}>
              <Text style={styles.contactName}>
                {contact.isPrimary ? '⭐ ' : ''}{contact.name}
              </Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
          ))}
          {user.emergencyContacts.length > 3 && (
            <Text style={styles.moreContacts}>
              +{user.emergencyContacts.length - 3} more contacts
            </Text>
          )}
        </View>
      )}

      {/* Safety Tips */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Safety Tips</Text>
        <Text style={styles.tip}>• Keep your phone charged and accessible</Text>
        <Text style={styles.tip}>• Share your location with trusted contacts</Text>
        <Text style={styles.tip}>• Trust your instincts and stay aware</Text>
        <Text style={styles.tip}>• Have emergency contacts ready</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SIZES.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl2,
  },
  greeting: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.xs,
  },
  time: {
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  safetyCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  safetyMessage: {
    fontSize: SIZES.base,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SIZES.base,
  },
  permissionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  permissionText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  permissionButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  iconText: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    textAlign: 'center',
  },
  locationText: {
    fontSize: SIZES.base,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  locationAccuracy: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceVariant,
  },
  contactName: {
    fontSize: SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  moreContacts: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
  tip: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
    lineHeight: 18,
  },
});

export default HomeScreen;
