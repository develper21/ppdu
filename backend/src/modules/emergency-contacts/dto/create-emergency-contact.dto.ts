import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateEmergencyContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
