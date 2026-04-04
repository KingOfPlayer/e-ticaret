import { IsString, IsArray, IsNumber, IsOptional, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsIn(['pending', 'processing', 'shipped', 'completed', 'cancelled'])
  status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
}
