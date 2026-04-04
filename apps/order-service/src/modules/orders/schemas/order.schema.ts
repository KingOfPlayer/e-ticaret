import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  address!: string;

  @Prop({ required: true })
  customerName!: string;

  @Prop({ type: [String], default: [] })
  productIds!: string[];

  @Prop({ default: 'pending' })
  status!: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  @Prop({ default: Date.now })
  createdAt!: Date;
  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
