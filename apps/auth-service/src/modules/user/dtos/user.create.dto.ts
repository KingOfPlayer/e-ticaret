import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
    @IsNotEmpty()
  surname: string;
    @IsNotEmpty()
  email: string;
    @IsNotEmpty()
  password: string;
}