import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Deck {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: false, required: true })
  userId: string;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
