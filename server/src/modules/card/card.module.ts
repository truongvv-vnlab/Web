import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from 'src/common/schemas/card.schema';
import { DeleteLogModule } from '../delete-log/delete-log.module';

@Module({
  imports: [
    DeleteLogModule,
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
