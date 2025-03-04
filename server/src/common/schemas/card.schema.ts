import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Card {
  @Prop({ required: true })
  front: string;

  @Prop({ required: true })
  back: string;

  @Prop({ unique: false, required: true })
  deckId: string;

  @Prop({ required: false, default: false })
  starred: boolean;
}

export const CardSchema = SchemaFactory.createForClass(Card);
