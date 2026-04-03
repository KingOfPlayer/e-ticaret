import { IsNumber, IsOptional } from 'class-validator';

export class UserQueryDto {
  @IsOptional()
  _id?: string;
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
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}
