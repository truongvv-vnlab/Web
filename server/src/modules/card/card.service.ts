import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Card } from 'src/common/schemas/card.schema';
import { DeleteLogService } from '../delete-log/delete-log.service';
import { DeleteType } from 'src/common/enum/deleteType';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private cardModel: mongoose.Model<Card>,
    private readonly deleteLogService: DeleteLogService,
  ) {}

  async findAllByDeckId(deckIds: string[]): Promise<Card[]> {
    return this.cardModel.find({ deckId: { $in: deckIds } }).lean();
  }

  async findAllByListId(cardIds: string[]): Promise<Card[]> {
    return this.cardModel.find({ _id: { $in: cardIds } });
  }

  async saveMany(cards: Card[]): Promise<void> {
    await this.cardModel.bulkWrite(
      cards.map((card) => ({
        updateOne: {
          filter: { _id: card._id },
          update: { $set: card },
          upsert: true,
        },
      })),
    );
  }

  async getCardsByVersionAndDeckIds(
    deckIds: string[],
    version: number,
  ): Promise<Card[]> {
    return this.cardModel
      .find({ deckId: { $in: deckIds }, version: { $gte: version } })
      .lean();
  }

  async deleteMany(
    cardIds: string[],
    userId: string,
    version: number,
  ): Promise<void> {
    if (!cardIds.length) return;

    const result = await this.cardModel.deleteMany({ _id: { $in: cardIds } });

    if (result.deletedCount > 0) {
      await Promise.all(
        cardIds.map((id) =>
          this.deleteLogService.createLog(userId, version, DeleteType.CARD, id),
        ),
      );
    }
  }
}
