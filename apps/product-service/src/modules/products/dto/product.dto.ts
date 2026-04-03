import { IsNotEmpty, IsNumber } from "class-validator";

export class ProductDto {
  @IsNotEmpty()
  name!: string;
  @IsNotEmpty()
  description!: string;
  @IsNotEmpty()
  @IsNumber()
  price!: number;
  @IsNotEmpty()
  @IsNumber()
  stock!: number;
  @IsNotEmpty()
  category!: string;
}