import { Module } from '@nestjs/common';
import { DeckService } from './deck.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from 'src/common/schemas/deck.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  providers: [DeckService],
  exports: [DeckService],
})
export class DeckModule {}
