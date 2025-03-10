import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema()
export class Deck {
  @Prop({ required: true, type: String, default: () => uuidv4() })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ unique: false, required: true })
  userId: string;

  @Prop({ required: true, default: 1 })
  version: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
