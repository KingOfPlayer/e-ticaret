import { IsNumber, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  name?: string;
    @IsOptional()
  surname?: string;
  @IsOptional()
  email?: string;
    @IsOptional()
  address?: string;
    @IsOptional()
  phone?: string;
    @IsOptional()
  password?: string;
}