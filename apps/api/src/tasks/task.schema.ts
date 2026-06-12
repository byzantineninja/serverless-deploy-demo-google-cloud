import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: ['todo', 'in_progress', 'done'], default: 'todo' })
  status: 'todo' | 'in_progress' | 'done';

  @Prop({ required: true })
  ownerId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
