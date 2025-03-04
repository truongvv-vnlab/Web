import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardResolver } from './card.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from 'src/common/schemas/card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
  providers: [CardService, CardResolver],
})
export class CardModule {}
