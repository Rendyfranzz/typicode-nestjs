import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  password: string;
}
