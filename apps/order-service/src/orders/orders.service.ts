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

  async findAll(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Order | null> {
    return this.orderModel.findOne({ _id: id, userId }).exec();
  }

  async update(
    id: string,
    userId: string,
    updateOrderDto: any,
  ): Promise<Order | null> {
    return this.orderModel
      .findOneAndUpdate({ _id: id, userId }, updateOrderDto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<any> {
    return this.orderModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
