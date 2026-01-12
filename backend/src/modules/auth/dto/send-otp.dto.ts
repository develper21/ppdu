import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SendOTPDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone: string;
}
