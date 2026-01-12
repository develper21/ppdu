import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import * as schema from '../../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class IncidentsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async createIncident(userId: number, incidentData: {
    type: string;
    description?: string;
    location?: { latitude: number; longitude: number };
  }) {
    const [incident] = await this.drizzle.db
      .insert(schema.incidentLogs)
      .values({
        userId,
        type: incidentData.type,
        description: incidentData.description,
        location: incidentData.location,
        createdAt: new Date(),
      })
      .returning();

    return incident;
  }

  async getIncidents(userId: number) {
    const incidents = await this.drizzle.db
      .select()
      .from(schema.incidentLogs)
      .where(eq(schema.incidentLogs.userId, userId))
      .orderBy(schema.incidentLogs.createdAt);

    return incidents;
  }

  async deleteIncident(userId: number, incidentId: number) {
    const [deletedIncident] = await this.drizzle.db
      .delete(schema.incidentLogs)
      .where(
        eq(schema.incidentLogs.id, incidentId)
      )
      .returning();

    return deletedIncident;
  }
}
