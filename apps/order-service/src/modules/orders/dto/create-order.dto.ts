import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productIds: string[];

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsIn(['pending', 'processing', 'shipped', 'completed', 'cancelled'])
  status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
}
