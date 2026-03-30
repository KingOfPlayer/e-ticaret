import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: any): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(userId: string): Promise<Product[]> {
    return this.productModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Product | null> {
    return this.productModel.findOne({ _id: id, userId }).exec();
  }

  async update(id: string, userId: string, updateProductDto: any): Promise<Product | null> {
    return this.productModel
      .findOneAndUpdate({ _id: id, userId }, updateProductDto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<any> {
    return this.productModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
