import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto implements Partial<CreateOrderDto> {
  customerName?: string;
  productIds?: string[];
  totalAmount?: number;
  status?: string;
}
