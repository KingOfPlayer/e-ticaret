import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  async seedProducts() {
    const count = await this.productModel.countDocuments();
    if (count === 0) {
      const sampleProducts = [
        { name: 'Gamer Laptop RTX 4080', price: 54999, description: 'Yüksek performanslı oyun bilgisayarı.', category: 'Elektronik' },
        { name: 'Ultra-Wide Curved Monitor', price: 12500, description: '49 inç kavisli ekran.', category: 'Elektronik' },
        { name: 'Mechanical Keyboard RGB', price: 2450, description: 'Mavi switch mekanik klavye.', category: 'Aksesuar' },
        { name: 'Wireless Gaming Mouse', price: 1800, description: '25k DPI hassasiyet.', category: 'Aksesuar' },
        { name: 'Pro Studio Headphones', price: 4200, description: 'Aktif gürültü engelleyici.', category: 'Ses' },
      ];
      await this.productModel.insertMany(sampleProducts);
    }
  }

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

  async update(
    id: string,
    userId: string,
    updateProductDto: any,
  ): Promise<Product | null> {
    return this.productModel
      .findOneAndUpdate({ _id: id, userId }, updateProductDto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<any> {
    return this.productModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
