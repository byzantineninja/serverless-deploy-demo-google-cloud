import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MeritDocument = HydratedDocument<Merit>;

@Schema({ timestamps: true })
export class Merit {
  @Prop({ required: true, unique: true })
  uid!: string;

  @Prop({ required: true })
  displayName!: string;

  @Prop({ required: true, default: 0 })
  count!: number;
}

export const MeritSchema = SchemaFactory.createForClass(Merit);
