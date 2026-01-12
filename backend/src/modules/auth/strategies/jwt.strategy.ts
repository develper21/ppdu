import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../../database/drizzle.service';
import * as schema from '../../../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly drizzle: DrizzleService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: { sub: string }) {
    const [user] = await this.drizzle.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        phone: schema.users.phone,
        email: schema.users.email,
        isVerified: schema.users.isVerified,
      })
      .from(schema.users)
      .where(eq(schema.users.id, parseInt(payload.sub)))
      .limit(1);

    if (!user) {
      return null;
    }

    return user;
  }
}
