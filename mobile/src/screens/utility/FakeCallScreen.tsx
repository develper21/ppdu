import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Vibration,
} from 'react-native';
import {COLORS, SIZES} from '@constants/index';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainTabParamList} from '@navigation/AppNavigator';

type FakeCallNavigationProp = NativeStackNavigationProp<MainTabParamList, 'FakeCall'>;

const FakeCallScreen = () => {
  const navigation = useNavigation<FakeCallNavigationProp>();
  const [isCallActive, setIsCallActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [callerName, setCallerName] = useState('Mom');
  const [delay, setDelay] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsCallActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive, countdown]);

  const handleStartCall = () => {
    if (!callerName.trim()) {
      Alert.alert('Error', 'Please enter a caller name');
      return;
    }

    Vibration.vibrate(200);
    setIsCallActive(true);
    setCountdown(delay);
  };

  const handleEndCall = () => {
    Vibration.vibrate(200);
    setIsCallActive(false);
    setCountdown(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCallNow = () => {
    Alert.alert(
      'Call Now',
      `Call ${callerName} immediately?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            // In real app, would make actual phone call
            Linking.openURL(`tel:+1234567890`);
          },
        },
      ],
    );
  };

  if (isCallActive) {
    return (
      <View style={styles.container}>
        <View style={styles.callScreen}>
          <View style={styles.callHeader}>
            <Text style={styles.callerName}>{callerName}</Text>
            <Text style={styles.callStatus}>Incoming Call...</Text>
          </View>

          <View style={styles.callTimer}>
            <Text style={styles.timerText}>{formatTime(countdown)}</Text>
          </View>

          <View style={styles.callActions}>
            <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
              <Text style={styles.endCallText}>End Call</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.callAnimation}>
            <View style={styles.callWave} />
            <View style={[styles.callWave, styles.callWave2]} />
            <View style={[styles.callWave, styles.callWave3]} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fake Call</Text>
        <Text style={styles.subtitle}>
          Get out of uncomfortable situations safely
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.setupCard}>
          <Text style={styles.cardTitle}>Call Setup</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Caller Name</Text>
            <Text style={styles.input}>{callerName}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delay (seconds)</Text>
            <View style={styles.delayButtons}>
              {[3, 5, 10, 15].map(seconds => (
                <TouchableOpacity
                  key={seconds}
                  style={[
                    styles.delayButton,
                    delay === seconds && styles.delayButtonActive,
                  ]}
                  onPress={() => setDelay(seconds)}>
                  <Text style={[
                    styles.delayButtonText,
                    delay === seconds && styles.delayButtonTextActive,
                  ]}>
                    {seconds}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.startCallButton} onPress={handleStartCall}>
            <Text style={styles.startCallText}>Start Fake Call</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.quickTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.quickButton} onPress={handleCallNow}>
            <Text style={styles.quickButtonText}>📞 Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickButton} 
            onPress={() => navigation.goBack()}>
            <Text style={styles.quickButtonText}>🔙 Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Usage Tips</Text>
          <Text style={styles.tipText}>
            • Use this to exit uncomfortable situations
          </Text>
          <Text style={styles.tipText}>
            • The call will ring and show on your screen
          </Text>
          <Text style={styles.tipText}>
            • You can answer to make it look realistic
          </Text>
          <Text style={styles.tipText}>
            • Perfect for dates, meetings, or unsafe situations
          </Text>
        </View>
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
  content: {
    padding: SIZES.lg,
  },
  setupCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  inputGroup: {
    marginBottom: SIZES.base,
  },
  label: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    marginBottom: SIZES.sm,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.background,
    padding: SIZES.base,
    borderRadius: SIZES.radiusBase,
    borderWidth: 1,
    borderColor: COLORS.textLight,
    fontSize: SIZES.base,
    color: COLORS.text,
  },
  delayButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  delayButton: {
    backgroundColor: COLORS.surfaceVariant,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.radiusBase,
    minWidth: 50,
    alignItems: 'center',
  },
  delayButtonActive: {
    backgroundColor: COLORS.primary,
  },
  delayButtonText: {
    fontSize: SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  delayButtonTextActive: {
    color: COLORS.surface,
  },
  startCallButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  startCallText: {
    color: COLORS.surface,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: SIZES.xl2,
  },
  quickTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  quickButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusBase,
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  quickButtonText: {
    fontSize: SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
  },
  tipsTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  tipText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SIZES.xs,
  },
  callScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  callHeader: {
    alignItems: 'center',
    marginBottom: SIZES.xl2,
  },
  callerName: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: SIZES.sm,
  },
  callStatus: {
    fontSize: SIZES.lg,
    color: '#fff',
    opacity: 0.8,
  },
  callTimer: {
    marginBottom: SIZES.xl2,
  },
  timerText: {
    fontSize: SIZES.xl3,
    fontWeight: 'bold',
    color: '#fff',
  },
  callActions: {
    width: '100%',
    alignItems: 'center',
  },
  endCallButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SIZES.xl2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusLg,
  },
  endCallText: {
    color: '#fff',
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  callAnimation: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.sm,
  },
  callWave: {
    width: 8,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 4,
    opacity: 0.6,
  },
  callWave2: {
    opacity: 0.4,
    transform: [{scaleY: 0.7}],
  },
  callWave3: {
    opacity: 0.2,
    transform: [{scaleY: 0.4}],
  },
});

export default FakeCallScreen;
