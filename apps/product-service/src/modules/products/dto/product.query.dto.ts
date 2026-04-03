import { IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class ProductQueryDto {
  @IsOptional()
  name?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minStock?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxStock?: number;
  @IsOptional()
  category?: string;

  @IsOptional()
  sortBy?: "name" | "price" | "stock";
  @IsOptional()
  sortOrder?: "asc" | "desc";

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  Limit?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}