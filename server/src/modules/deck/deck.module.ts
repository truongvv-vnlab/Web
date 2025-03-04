import { Module } from '@nestjs/common';
import { DeckService } from './deck.service';
import { DeckResolver } from './deck.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from 'src/common/schemas/deck.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  providers: [DeckService, DeckResolver],
})
export class DeckModule {}
