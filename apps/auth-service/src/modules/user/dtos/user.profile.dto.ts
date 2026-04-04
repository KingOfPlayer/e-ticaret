import { IsOptional } from 'class-validator';

export class UserProfileDto {
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
}
