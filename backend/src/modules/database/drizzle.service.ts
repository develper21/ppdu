import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';

@Injectable()
export class DrizzleService {
  constructor(@Inject('DATABASE') private readonly database: any) {}

  get db() {
    return this.database;
  }
}
