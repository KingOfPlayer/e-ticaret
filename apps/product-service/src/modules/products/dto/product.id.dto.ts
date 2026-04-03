import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ProductIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id?: string;
}
