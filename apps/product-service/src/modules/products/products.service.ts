import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/product.create.dto';
import { ProductQueryDto } from './dto/product.query.dto';
import { ProductDto } from './dto/product.dto';
import { ProductIdDto } from './dto/product.id.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(query: ProductQueryDto): Promise<Product[]> {
    const filter: any = {};
    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }
    if (query.category) {
      filter.category = query.category;
    }
    if (query.minPrice) {
      filter.price = { ...filter.price, $gte: query.minPrice ? query.minPrice : 0 };
    }
    if (query.maxPrice) {
      filter.price = { ...filter.price, $lte: query.maxPrice ? query.maxPrice : Number.MAX_SAFE_INTEGER };
    }

    const limit = query.Limit || 20;
    const skip = query.offset || 0;
    const sort: any = query.sortBy
      ? { [query.sortBy]: query.sortOrder === 'desc' ? -1 : 1 }
      : { createdAt: -1 };

    return await this.productModel.find(filter).limit(limit).skip(skip).sort(sort).exec();
  }

  async findOne(getProductDto: ProductIdDto): Promise<ProductDto> {
    const product = await this.productModel.findById(getProductDto.id).exec();
    return {
      id: product!._id.toString(),
      name: product!.name,
      price: product!.price,
      stock: product!.stock,
      description: product!.description,
      category: product!.category,
    } as ProductDto;
  }

  async update(
    productIdDto: ProductIdDto,
    updateProductDto: any,
  ): Promise<Product | null> {
    return this.productModel
      .findOneAndUpdate({ _id: productIdDto.id }, updateProductDto, { new: true })
      .exec();
  }

  async remove(productIdDto: ProductIdDto): Promise<any> {
    return this.productModel.findOneAndDelete({ _id: productIdDto.id }).exec();
  }
}
