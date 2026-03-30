import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true })
  customerName!: string;

  @Prop({ type: [String], required: true })
  productIds!: string[];

  @Prop({ required: true })
  totalAmount!: number;

  @Prop({ default: 'PENDING' })
  status!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
