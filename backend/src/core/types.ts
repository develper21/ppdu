export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export enum UserActivity {
  STATIONARY = "STATIONARY",
  WALKING = "WALKING",
  RUNNING = "RUNNING",
  IN_VEHICLE = "IN_VEHICLE",
  UNKNOWN = "UNKNOWN",
}

export enum SafetyStatus {
  SAFE = "SAFE",
  CAUTION = "CAUTION",
  HIGH_RISK = "HIGH_RISK",
  EMERGENCY = "EMERGENCY",
}

export interface UserContext {
  userId: string;
  location: GeoLocation;
  activity: UserActivity;
  batteryLevel?: number;
  lastActive: number;
  // Optional flags from client
  audioAnomalyDetected?: boolean;
  routeDeviationDetected?: boolean;
}

export interface RiskEvaluation {
  score: number; // 0-100
  factors: string[]; // e.g., ["Late Night", "High Crime Area", "Abrupt stopping"]
  timestamp: number;
  level: SafetyStatus;
}

export interface AgentDecision {
  actionId: string;
  actionType:
    | "NONE"
    | "PING_USER"
    | "SHARE_LOCATION"
    | "ALERT_CONTACTS"
    | "CONTACT_AUTHORITIES";
  reason: string;
  priority: number;
  requiresConsent: boolean;
  payload?: any;
}
