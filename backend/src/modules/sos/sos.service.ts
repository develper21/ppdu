import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import * as schema from '../../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SOSService {
  constructor(private readonly drizzle: DrizzleService) {}

  async createSOSSession(userId: number, triggerType: string, location?: { latitude: number; longitude: number }) {
    const [sosSession] = await this.drizzle.db
      .insert(schema.sosSessions)
      .values({
        userId,
        triggerType,
        status: 'active',
        startedAt: new Date(),
        location: location ? { latitude: location.latitude, longitude: location.longitude } : null,
      })
      .returning();

    return sosSession;
  }

  async deactivateSOSSession(sessionId: number) {
    const [updatedSession] = await this.drizzle.db
      .update(schema.sosSessions)
      .set({
        status: 'deactivated',
        endedAt: new Date(),
      })
      .where(eq(schema.sosSessions.id, sessionId))
      .returning();

    return updatedSession;
  }

  async updateLocation(sessionId: number, location: { latitude: number; longitude: number; accuracy: number }) {
    await this.drizzle.db.insert(schema.locationUpdates).values({
      sosSessionId: sessionId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      timestamp: new Date(),
    });

    // Update the main SOS session with latest location
    const [updatedSession] = await this.drizzle.db
      .update(schema.sosSessions)
      .set({
        location: { latitude: location.latitude, longitude: location.longitude },
      })
      .where(eq(schema.sosSessions.id, sessionId))
      .returning();

    return updatedSession;
  }

  async getActiveSOSSession(userId: number) {
    const [activeSession] = await this.drizzle.db
      .select()
      .from(schema.sosSessions)
      .where(
        eq(schema.sosSessions.userId, userId)
      )
      .orderBy(schema.sosSessions.startedAt)
      .limit(1);

    return activeSession;
  }
}
