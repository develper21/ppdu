import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../database/drizzle.service';
import * as schema from '../../schema';
import { eq, and } from 'drizzle-orm';
import { SendOTPDto } from './dto/send-otp.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';

@Injectable()
export class OTPService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly configService: ConfigService,
  ) {}

  async sendOTP(sendOTPDto: SendOTPDto) {
    const { phone } = sendOTPDto;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if there's an existing OTP that's still valid
    const [existingOTP] = await this.drizzle.db
      .select()
      .from(schema.otpSessions)
      .where(
        and(
          eq(schema.otpSessions.phone, phone),
          eq(schema.otpSessions.isUsed, false)
        )
      )
      .orderBy(schema.otpSessions.expiresAt)
      .limit(1);

    if (existingOTP && existingOTP.expiresAt > new Date()) {
      throw new BadRequestException('OTP already sent. Please wait before requesting a new one.');
    }

    // Store OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.drizzle.db.insert(schema.otpSessions).values({
      phone,
      otp,
      expiresAt,
      isUsed: false,
    });

    // In development, return the OTP for testing
    if (this.configService.get('NODE_ENV') === 'development') {
      return {
        message: 'OTP sent successfully',
        otp, // Only in development
      };
    }

    // In production, integrate with SMS service (Twilio)
    // await this.smsService.sendSMS(phone, `Your PPDU OTP is: ${otp}`);

    return {
      message: 'OTP sent successfully',
    };
  }

  async verifyOTP(verifyOTPDto: VerifyOTPDto) {
    const { phone, otp } = verifyOTPDto;

    // Find valid OTP
    const [otpRecord] = await this.drizzle.db
      .select()
      .from(schema.otpSessions)
      .where(
        and(
          eq(schema.otpSessions.phone, phone),
          eq(schema.otpSessions.otp, otp),
          eq(schema.otpSessions.isUsed, false)
        )
      )
      .limit(1);

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark OTP as used
    await this.drizzle.db
      .update(schema.otpSessions)
      .set({ isUsed: true })
      .where(eq(schema.otpSessions.id, otpRecord.id));

    return {
      message: 'OTP verified successfully',
      verified: true,
    };
  }
}
