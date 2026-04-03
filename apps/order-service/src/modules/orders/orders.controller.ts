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
  ForbiddenException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';
import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order.query.dto';

@Controller()
@UseGuards(RoleGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findMyOrders(
    @Headers('x-user-id') userId: string,
    @Query() query: OrderQueryDto,
  ): Promise<Order[]> {
    return this.ordersService.findAllWithUserId(userId, query);
  }

  @Get(':id')
  async findMyOrder(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ): Promise<Order | null> {
    return this.ordersService.findOne(id, userId);
  }

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('x-user-id') userId: string,
  ): Promise<Order> {
    return this.ordersService.create({ ...createOrderDto, userId });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelOrder(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ): Promise<void> {
    return this.ordersService.cancelOrder(id, userId);
  }

  @Get('admin/all')
  @Roles(UserRole.Moderator, UserRole.Admin)
  async findAllOrders(
    @Query() query: OrderQueryDto,
  ): Promise<Order[]> {
    return this.ordersService.findAll(query);
  }

  @Put('admin/:id')
  @Roles(UserRole.Moderator, UserRole.Admin)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order | null> {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Get('admin/:id')
  @Roles(UserRole.Moderator, UserRole.Admin)
  async findOrderById(
    @Param('id') id: string,
  ): Promise<Order | null> {
    return this.ordersService.findOrderById(id);
  }
}
