import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../schemas/product.schema';
import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UseGuards(RoleGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRole.Admin)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Headers('x-user-id') userId: string,
  ): Promise<Product> {
    return this.productsService.create({ ...createProductDto, userId });
  }

  @Roles(UserRole.User, UserRole.Admin)
  @Get()
  async findAll(@Headers('x-user-id') userId: string): Promise<Product[]> {
    return this.productsService.findAll(userId);
  }

  @Roles(UserRole.User, UserRole.Admin)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ): Promise<Product | null> {
    return this.productsService.findOne(id, userId);
  }

  @Roles(UserRole.Admin)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    return this.productsService.update(id, userId, updateProductDto);
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ): Promise<void> {
    await this.productsService.remove(id, userId);
  }
}
