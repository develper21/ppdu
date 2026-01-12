import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import * as schema from '../../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class EmergencyContactsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async createEmergencyContact(userId: number, contactData: {
    name: string;
    phone: string;
    relationship?: string;
    isPrimary?: boolean;
  }) {
    const [contact] = await this.drizzle.db
      .insert(schema.emergencyContacts)
      .values({
        userId,
        name: contactData.name,
        phone: contactData.phone,
        relationship: contactData.relationship,
        isPrimary: contactData.isPrimary || false,
      })
      .returning();

    return contact;
  }

  async getEmergencyContacts(userId: number) {
    const contacts = await this.drizzle.db
      .select()
      .from(schema.emergencyContacts)
      .where(eq(schema.emergencyContacts.userId, userId))
      .orderBy(schema.emergencyContacts.isPrimary ? 'desc' : 'asc');

    return contacts;
  }

  async updateEmergencyContact(contactId: number, updateData: {
    name?: string;
    phone?: string;
    relationship?: string;
    isPrimary?: boolean;
  }) {
    const [updatedContact] = await this.drizzle.db
      .update(schema.emergencyContacts)
      .set(updateData)
      .where(eq(schema.emergencyContacts.id, contactId))
      .returning();

    return updatedContact;
  }

  async deleteEmergencyContact(contactId: number) {
    const [deletedContact] = await this.drizzle.db
      .delete(schema.emergencyContacts)
      .where(eq(schema.emergencyContacts.id, contactId))
      .returning();

    return deletedContact;
  }
}
