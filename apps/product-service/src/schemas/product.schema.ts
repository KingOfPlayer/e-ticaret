import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ default: 0 })
  stock!: number;

  @Prop()
  category!: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
