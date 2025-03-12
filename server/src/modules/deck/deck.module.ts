import { Module } from '@nestjs/common';
import { DeckService } from './deck.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from 'src/common/schemas/deck.schema';
import { DeleteLogModule } from '../delete-log/delete-log.module';
import { CardModule } from '../card/card.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
    DeleteLogModule,
    CardModule,
  ],
  providers: [DeckService],
  exports: [DeckService],
})
export class DeckModule {}
