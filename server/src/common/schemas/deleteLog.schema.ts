import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DeleteLog extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  version: number;

  @Prop({ required: true })
  type: number;

  @Prop({ required: true })
  targetId: string;
}

export const DeleteLogSchema = SchemaFactory.createForClass(DeleteLog);
