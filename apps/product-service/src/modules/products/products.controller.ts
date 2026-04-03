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
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { UpdateProductDto } from './dto/product.update.dto';
import { ProductQueryDto } from './dto/product.query.dto';
import { ProductIdDto } from './dto/product.id.dto';
import { CreateProductDto } from './dto/product.create.dto';
import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';

@Controller()
@UseGuards(RoleGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: ProductQueryDto): Promise<Product[]> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param() id: ProductIdDto,
  ): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.Moderator, UserRole.Admin)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @Roles(UserRole.Moderator, UserRole.Admin)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: ProductIdDto,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.Moderator, UserRole.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: ProductIdDto,
  ): Promise<void> {
    await this.productsService.remove(id);
  }
}
