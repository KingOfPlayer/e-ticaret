import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: any): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).exec();
  }

  async update(id: string, updateOrderDto: any): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<any> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
