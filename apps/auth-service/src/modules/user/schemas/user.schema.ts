import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  name!: string;
  
  @Prop({ required: true })
  surname!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: 'user' })
  role!: string;

  @Prop()
  address?: string;

  @Prop()
  phone?: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
