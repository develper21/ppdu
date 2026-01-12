import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import * as schema from '../../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findById(id: number) {
    const [user] = await this.drizzle.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        phone: schema.users.phone,
        email: schema.users.email,
        isVerified: schema.users.isVerified,
      })
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByPhone(phone: string) {
    const [user] = await this.drizzle.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        phone: schema.users.phone,
        email: schema.users.email,
        isVerified: schema.users.isVerified,
      })
      .from(schema.users)
      .where(eq(schema.users.phone, phone))
      .limit(1);

    return user;
  }

  async updateProfile(userId: number, updateData: { name?: string; email?: string }) {
    const [updatedUser] = await this.drizzle.db
      .update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      email: updatedUser.email,
      isVerified: updatedUser.isVerified,
    };
  }
}
