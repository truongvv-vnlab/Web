import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema({ timestamps: true })
export class Card {
  @Prop({ required: true, type: String, default: () => uuidv4() })
  _id: string;

  @Prop({ required: true })
  front: string;

  @Prop({ required: true })
  back: string;

  @Prop({ unique: false, required: true })
  deckId: string;

  @Prop({ required: false, default: false })
  starred: boolean;

  @Prop({ required: true, default: 1 })
  version: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
