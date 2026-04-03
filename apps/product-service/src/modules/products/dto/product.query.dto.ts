import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ProductQueryDto {
  @IsOptional()
  name?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  @IsNumber()
  minPrice?: number;
  @IsOptional()
  @IsNumber()
  maxPrice?: number;
  @IsOptional()
  @IsNumber()
  minStock?: number;
  @IsOptional()
  @IsNumber()
  maxStock?: number;
  @IsOptional()
  category?: string;

  @IsOptional()
  sortBy?: "name" | "price" | "stock";
  @IsOptional()
  sortOrder?: "asc" | "desc";

  @IsOptional()
  Limit?: number;
  @IsOptional()
  offset?: number;
}