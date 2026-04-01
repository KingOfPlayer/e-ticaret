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
import { OrdersService } from './orders.service';
import { Order } from '../schemas/order.schema';
import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller()
@UseGuards(RoleGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.User, UserRole.Admin)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('x-user-id') userId: string,
  ): Promise<Order> {
    return this.ordersService.create({ ...createOrderDto, userId });
  }

  @Roles(UserRole.User, UserRole.Admin)
  @Get()
  async findAll(@Headers('x-user-id') userId: string): Promise<Order[]> {
    return this.ordersService.findAll(userId);
  }

  @Roles(UserRole.User, UserRole.Admin)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ): Promise<Order | null> {
    return this.ordersService.findOne(id, userId);
  }

  @Roles(UserRole.Admin)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order | null> {
    return this.ordersService.update(id, userId, updateOrderDto);
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ): Promise<void> {
    await this.ordersService.remove(id, userId);
  }
}
