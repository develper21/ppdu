import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {COLORS, SIZES} from '@constants/index';
import {usePermissions} from '@contexts/PermissionContext';
import {AuthStackParamList} from '@navigation/AppNavigator';

type PermissionsNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Permissions'>;

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: string;
  required: boolean;
  granted: boolean;
}

const PermissionsScreen = () => {
  const navigation = useNavigation<PermissionsNavigationProp>();
  const {requestPermission, checkPermission} = usePermissions();
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'location',
      title: 'Location Access',
      description: 'We need your location to send your exact position to emergency contacts during SOS alerts and to provide location-based safety features.',
      icon: '📍',
      required: true,
      granted: false,
    },
    {
      id: 'microphone',
      title: 'Microphone Access',
      description: 'Allows voice activation of SOS using the phrase "Help me now". Your voice is processed locally and never stored.',
      icon: '🎤',
      required: false,
      granted: false,
    },
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Send you safety alerts, SOS confirmations, and important updates even when the app is in background.',
      icon: '🔔',
      required: true,
      granted: false,
    },
    {
      id: 'phone',
      title: 'Phone Access',
      description: 'Automatically call your primary emergency contact during SOS activation for immediate voice contact.',
      icon: '📞',
      required: true,
      granted: false,
    },
    {
      id: 'motion',
      title: 'Motion Detection',
      description: 'Detect falls or sudden movements to automatically trigger SOS alerts. Works offline and respects your privacy.',
      icon: '🏃',
      required: false,
      granted: false,
    },
  ]);

  React.useEffect(() => {
    checkPermissionsStatus();
  }, []);

  const checkPermissionsStatus = async () => {
    const updatedPermissions = await Promise.all(
      permissions.map(async permission => ({
        ...permission,
        granted: await checkPermission(permission.id as any),
      })),
    );
    setPermissions(updatedPermissions);
  };

  const handlePermissionToggle = async (permissionId: string) => {
    try {
      const granted = await requestPermission(permissionId as any);
      
      setPermissions(prev =>
        prev.map(permission =>
          permission.id === permissionId
            ? {...permission, granted}
            : permission,
        ),
      );

      if (granted) {
        Alert.alert(
          'Permission Granted',
          `${permissions.find(p => p.id === permissionId)?.title} has been enabled successfully.`,
        );
      } else {
        Alert.alert(
          'Permission Denied',
          'You can enable this permission later in Settings.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request permission. Please try again.');
    }
  };

  const getRequiredCount = () => {
    return permissions.filter(p => p.required && !p.granted).length;
  };

  const getOptionalCount = () => {
    return permissions.filter(p => !p.required && !p.granted).length;
  };

  const handleContinue = () => {
    const requiredPermissions = permissions.filter(p => p.required);
    const allRequiredGranted = requiredPermissions.every(p => p.granted);

    if (!allRequiredGranted) {
      Alert.alert(
        'Required Permissions',
        'Please enable all required permissions to continue. They are essential for your safety.',
      );
      return;
    }

    navigation.navigate('EmergencyContacts');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Permissions</Text>
        <Text style={styles.subtitle}>
          Your privacy and safety are our priorities
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {permissions.map(permission => (
            <View key={permission.id} style={styles.permissionCard}>
              <View style={styles.permissionHeader}>
                <Text style={styles.permissionIcon}>{permission.icon}</Text>
                <View style={styles.permissionInfo}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>
                      {permission.required ? 'Required' : 'Optional'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={permission.granted}
                  onValue={() => handlePermissionToggle(permission.id)}
                  trackColor={{
                    false: COLORS.textLight,
                    true: COLORS.primary,
                  }}
                  style={styles.switch}
                />
              </View>

              <Text style={styles.permissionDescription}>
                {permission.description}
              </Text>
            </View>
          ))}

          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>
                {getRequiredCount()}
              </Text>
              <Text style={styles.summaryLabel}>Required permissions pending</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>
                {getOptionalCount()}
              </Text>
              <Text style={styles.summaryLabel}>Optional permissions available</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            getRequiredCount() > 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={getRequiredCount() > 0}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: SIZES.xl2,
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SIZES.lg,
  },
  permissionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.base,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  permissionIcon: {
    fontSize: 24,
    marginRight: SIZES.base,
  },
  permissionInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  permissionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  requiredBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  requiredText: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  switch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
  permissionDescription: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginTop: SIZES.lg,
    marginBottom: SIZES.xl2,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryCount: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.xs,
  },
  summaryLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: SIZES.lg,
    paddingTop: SIZES.base,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.textLight,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  continueButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
});

export default PermissionsScreen;
