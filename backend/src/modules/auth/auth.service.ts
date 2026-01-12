import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../database/drizzle.service';
import * as schema from '../../schema';
import { eq, and, or } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { phone, email, password, name } = createUserDto;

    // Check if user already exists
    const existingUser = await this.drizzle.db
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.phone, phone),
          eq(schema.users.email, email)
        )
      )
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('User with this phone or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await this.drizzle.db
      .insert(schema.users)
      .values({
        name,
        phone,
        email,
        password: hashedPassword,
        isVerified: false,
      })
      .returning();

    // Generate tokens
    const tokens = await this.generateTokens(newUser.id);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    // Find user
    const [user] = await this.drizzle.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, phone))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  }

  async generateTokens(userId: string) {
    const payload = { sub: userId };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    // Store refresh token
    await this.drizzle.db.insert(schema.refreshTokens).values({
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      
      // Check if refresh token exists and is valid
      const [tokenRecord] = await this.drizzle.db
        .select()
        .from(schema.refreshTokens)
        .where(
          and(
            eq(schema.refreshTokens.token, refreshToken),
            eq(schema.refreshTokens.userId, payload.sub),
            eq(schema.refreshTokens.isUsed, false)
          )
        )
        .limit(1);

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Mark token as used
      await this.drizzle.db
        .update(schema.refreshTokens)
        .set({ isUsed: true })
        .where(eq(schema.refreshTokens.id, tokenRecord.id));

      // Generate new tokens
      return this.generateTokens(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await this.drizzle.db
      .update(schema.refreshTokens)
      .set({ isUsed: true })
      .where(eq(schema.refreshTokens.token, refreshToken));
  }
}
