export const COLORS = {
  // Primary soft colors for women-centric design
  primary: '#B19CD9', // Soft lavender
  primaryDark: '#9B84D1',
  primaryLight: '#C8B6E6',
  
  secondary: '#FFB6C1', // Soft pink
  secondaryDark: '#FF91A4',
  secondaryLight: '#FFD1DC',
  
  accent: '#FF7F50', // Coral
  accentDark: '#FF6347',
  accentLight: '#FFA07A',
  
  teal: '#48D1CC', // Teal accents
  tealDark: '#20B2AA',
  tealLight: '#7FFFD4',
  
  // Neutral colors
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  
  text: '#2D3748',
  textSecondary: '#718096',
  textLight: '#A0AEC0',
  
  // Status colors
  success: '#48BB78',
  warning: '#ED8936',
  error: '#F56565',
  info: '#4299E1',
  
  // SOS specific
  sosActive: '#E53E3E',
  sosInactive: '#CBD5E0',
  
  // Gradients
  primaryGradient: ['#B19CD9', '#FFB6C1'],
  secondaryGradient: ['#FF7F50', '#48D1CC'],
};

export const SIZES = {
  // Font sizes
  fontXs: 12,
  fontSm: 14,
  fontBase: 16,
  
  // Spacing
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
  xl2: 48,
  xl3: 64,
  xl4: 32,
  
  // Border radius
  radiusSm: 8,
  radiusBase: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,
  
  // Touch targets (minimum 44x44 for accessibility)
  touchTarget: 44,
  touchTargetLarge: 56,
};

export const FONTS = {
  primary: 'System',
  secondary: 'Avenir',
  mono: 'Menlo',
};

export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export const PERMISSIONS = {
  LOCATION: 'location',
  BACKGROUND_LOCATION: 'backgroundLocation',
  MICROPHONE: 'microphone',
  MOTION: 'motion',
  NOTIFICATIONS: 'notifications',
} as const;

export const SOS_TRIGGERS = {
  MANUAL: 'manual',
  VOICE: 'voice',
  TIMER: 'timer',
  AUTO: 'auto',
} as const;

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const INCIDENT_TYPES = {
  TEXT: 'text',
  VOICE: 'voice',
  LOCATION: 'location',
} as const;

export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:3000/api', // Development URL
  // BASE_URL: 'https://api.ppdu.app/v1', // Production URL
  
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  USER: {
    PROFILE: '/user/profile',
    EMERGENCY_CONTACTS: '/user/emergency-contacts',
    PERMISSIONS: '/user/permissions',
  },
  
  SOS: {
    ACTIVATE: '/sos/activate',
    DEACTIVATE: '/sos/deactivate',
    LOCATION: '/sos/location',
    STATUS: '/sos/status',
  },
  
  INCIDENTS: {
    CREATE: '/incidents',
    LIST: '/incidents',
    DELETE: '/incidents/:id',
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@ppdu_auth_token',
  REFRESH_TOKEN: '@ppdu_refresh_token',
  USER_DATA: '@ppdu_user_data',
  EMERGENCY_CONTACTS: '@ppdu_emergency_contacts',
  PERMISSIONS: '@ppdu_permissions',
  VOICE_TRIGGER: '@ppdu_voice_trigger',
  FAKE_CALL_CONFIG: '@ppdu_fake_call_config',
  INCIDENT_LOGS: '@ppdu_incident_logs',
  ONBOARDING_COMPLETED: '@ppdu_onboarding_completed',
};

export const VOICE_TRIGGER_PHRASE = 'Help me now';

export const MAX_EMERGENCY_CONTACTS = 5;
export const MIN_EMERGENCY_CONTACTS = 1;

export const LOCATION_UPDATE_INTERVAL = 30000; // 30 seconds
export const SOS_LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds during SOS

export const BACKGROUND_TASK_INTERVAL = 60000; // 1 minute

export const RISK_AWARENESS_RULES = {
  TIME_FACTORS: {
    NIGHT_RISK_START: 20, // 8 PM
    NIGHT_RISK_END: 6, // 6 AM
  },
  LOCATION_FACTORS: {
    UNKNOWN_AREA_THRESHOLD: 0.3, // 30% confidence threshold
  },
  MOVEMENT_FACTORS: {
    STATIONARY_TIMEOUT: 300000, // 5 minutes
  },
};
