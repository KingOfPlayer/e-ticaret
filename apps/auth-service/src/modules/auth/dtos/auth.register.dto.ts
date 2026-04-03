import { IsEmail, IsString } from "class-validator";

export class RegisterAuthDto {

  @IsString()
  name: string;
  @IsString()
  surname: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
} 