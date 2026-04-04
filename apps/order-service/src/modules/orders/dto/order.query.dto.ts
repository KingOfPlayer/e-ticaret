import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  Min,
  IsMongoId,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderQueryDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'processing', 'shipped', 'completed', 'cancelled'])
  status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

  @IsOptional()
  @IsISO8601()
  createdAfter?: string;

  @IsOptional()
  @IsISO8601()
  createdBefore?: string;

  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsIn(['status', 'createdAt', 'updatedAt'])
  sortBy?: 'status' | 'createdAt' | 'updatedAt' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
