
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Route extends Document {
  @Prop({ required: true, unique: true })
  prefix: string;

  @Prop({ required: true })
  target: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
