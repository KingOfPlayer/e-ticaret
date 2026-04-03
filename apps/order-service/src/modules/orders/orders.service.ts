import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { OrderQueryDto } from './dto/order.query.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async create(createOrderDto: any): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAllWithUserId(userId: string, query: OrderQueryDto): Promise<Order[]> {
    const filter: any = { userId };
    if (query.productId) {
      filter.productIds = { $in: [query.productId] };
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.createdAfter || query.createdBefore) {
      filter.createdAt = { ...filter.createdAt };
      if (query.createdAfter) {
        filter.createdAt.$gte = new Date(query.createdAfter);
      }
      if (query.createdBefore) {
        filter.createdAt.$lte = new Date(query.createdBefore);
      }
    }

    const limit = query.limit ?? 20;
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    const sortField = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrder };

    return this.orderModel.find(filter).limit(limit).skip(skip).sort(sort).exec();
  }

  async findOne(id: string, userId: string): Promise<Order | null> {
    return this.orderModel.findOne({ _id: id, userId }).exec();
  }

  async cancelOrder(id: string, userId: string): Promise<void> {
    const order = await this.orderModel.findOne({ _id: id, userId }).exec();
    
    if (!order) {
      throw new BadRequestException('Order not found or does not belong to this user');
    }

    if (order.status === 'cancelled') {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.status === 'shipped' || order.status === 'completed') {
      throw new BadRequestException(`Cannot cancel order with status: ${order.status}`);
    }

    await this.orderModel.findByIdAndUpdate(id, { status: 'cancelled' }).exec();
  }

  async findAll(query?: OrderQueryDto): Promise<Order[]> {
    const filter: any = {};
    
    if (query?.userId) {
      filter.userId = query.userId;
    }

    if (query?.productId) {
      filter.productIds = { $in: [query.productId] };
    }

    if (query?.status) {
      filter.status = query.status;
    }

    if (query?.createdAfter || query?.createdBefore) {
      filter.createdAt = {};
      if (query.createdAfter) {
        filter.createdAt.$gte = new Date(query.createdAfter);
      }
      if (query.createdBefore) {
        filter.createdAt.$lte = new Date(query.createdBefore);
      }
    }

    const limit = query?.limit ?? 20;
    const page = query?.page ?? 1;
    const skip = (page - 1) * limit;

    const sortField = query?.sortBy ?? 'createdAt';
    const sortOrder = query?.sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrder };

    return this.orderModel.find(filter).limit(limit).skip(skip).sort(sort).exec();
  }

  async findOrderById(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).exec();
  }

  async updateOrder(
    id: string,
    updateOrderDto: any,
  ): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
  }
}
