import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Card } from 'src/common/schemas/card.schema';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private cardModel: mongoose.Model<Card>,
  ) {}
  async findAllByUserId(userId: string): Promise<Card[]> {
    return this.cardModel.find({ userId }).lean();
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

  async deleteMany(cardIds: string[]): Promise<void> {
    await this.cardModel.deleteMany({ _id: { $in: cardIds } });
  }
}
