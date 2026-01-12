import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
