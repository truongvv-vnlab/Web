import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Deck } from 'src/common/schemas/deck.schema';

@Injectable()
export class DeckService {
  constructor(
    @InjectModel(Deck.name) private deckModel: mongoose.Model<Deck>,
  ) {}
  async findAllByUserId(userId: string): Promise<Deck[]> {
    return this.deckModel.find({ userId }).lean();
  }
  async findAllByListId(deckIds: string[]): Promise<Deck[]> {
    return this.deckModel.find({ _id: { $in: deckIds } });
  }
  async saveMany(decks: Deck[]): Promise<void> {
    await this.deckModel.bulkWrite(
      decks.map((deck) => ({
        updateOne: {
          filter: { _id: deck._id },
          update: { $set: deck },
          upsert: true,
        },
      })),
    );
  }

  async deleteMany(deckIds: string[]): Promise<void> {
    await this.deckModel.deleteMany({ _id: { $in: deckIds } });
  }
}
