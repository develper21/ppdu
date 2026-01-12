import { pgTable, serial, varchar, timestamp, boolean, text, integer, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const sosStatusEnum = pgEnum('sos_status', ['active', 'inactive', 'resolved']);
export const incidentTypeEnum = pgEnum('incident_type', ['text', 'voice', 'location']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).unique(),
  email: varchar('email', { length: 255 }).unique(),
  role: userRoleEnum('role').default('user'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Emergency Contacts table
export const emergencyContacts = pgTable('emergency_contacts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).onDelete('cascade'),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  relationship: varchar('relationship', { length: 100 }),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// SOS Sessions table
export const sosSessions = pgTable('sos_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).onDelete('cascade'),
  status: sosStatusEnum('status').default('active'),
  triggerType: varchar('trigger_type', { length: 50 }).notNull(), // manual, voice, timer, auto
  latitude: varchar('latitude', { length: 50 }),
  longitude: varchar('longitude', { length: 50 }),
  accuracy: varchar('accuracy', { length: 50 }),
  locationTimestamp: timestamp('location_timestamp'),
  contactsNotified: text('contacts_notified').array(), // Array of contact IDs
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// SOS Location Updates table
export const sosLocationUpdates = pgTable('sos_location_updates', {
  id: serial('id').primaryKey(),
  sosId: integer('sos_id').references(() => sosSessions.id).onDelete('cascade'),
  latitude: varchar('latitude', { length: 50 }).notNull(),
  longitude: varchar('longitude', { length: 50 }).notNull(),
  accuracy: varchar('accuracy', { length: 50 }),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Incident Logs table
export const incidentLogs = pgTable('incident_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).onDelete('cascade'),
  type: incidentTypeEnum('type').notNull(),
  content: text('content').notNull(),
  latitude: varchar('latitude', { length: 50 }),
  longitude: varchar('longitude', { length: 50 }),
  accuracy: varchar('accuracy', { length: 50 }),
  locationTimestamp: timestamp('location_timestamp'),
  isDeleted: boolean('is_deleted').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Refresh Tokens table
export const refreshTokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).onDelete('cascade'),
  token: varchar('token', { length: 500 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  isRevoked: boolean('is_revoked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// OTP Sessions table
export const otpSessions = pgTable('otp_sessions', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
  otp: varchar('otp', { length: 10 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // login, register
  attempts: integer('attempts').default(0),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Settings table
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).onDelete('cascade').unique(),
  voiceTriggerEnabled: boolean('voice_trigger_enabled').default(false),
  voiceTriggerPhrase: varchar('voice_trigger_phrase', { length: 255 }).default('Help me now'),
  silentAlertMode: boolean('silent_alert_mode').default(false),
  locationSharingEnabled: boolean('location_sharing_enabled').default(true),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type NewEmergencyContact = typeof emergencyContacts.$inferInsert;

export type SOSSession = typeof sosSessions.$inferSelect;
export type NewSOSSession = typeof sosSessions.$inferInsert;

export type SOSLocationUpdate = typeof sosLocationUpdates.$inferSelect;
export type NewSOSLocationUpdate = typeof sosLocationUpdates.$inferInsert;

export type IncidentLog = typeof incidentLogs.$inferSelect;
export type NewIncidentLog = typeof incidentLogs.$inferInsert;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

export type OTPSession = typeof otpSessions.$inferSelect;
export type NewOTPSession = typeof otpSessions.$inferInsert;

export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
