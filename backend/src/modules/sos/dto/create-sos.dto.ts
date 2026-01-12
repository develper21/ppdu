import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSOSDto {
  @IsNotEmpty()
  @IsString()
  triggerType: string;

  @IsOptional()
  location?: {
    latitude: number;
    longitude: number;
  };
}
