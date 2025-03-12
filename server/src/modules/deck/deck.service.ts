import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Deck } from 'src/common/schemas/deck.schema';
import { DeleteLogService } from '../delete-log/delete-log.service';
import { DeleteType } from 'src/common/enum/deleteType';
import { CardService } from '../card/card.service';

@Injectable()
export class DeckService {
  constructor(
    @InjectModel(Deck.name) private deckModel: mongoose.Model<Deck>,
    private readonly deleteLogService: DeleteLogService,
    private readonly cardService: CardService,
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

  async getDecksByVersionAndUserId(
    userId: string,
    version: number,
  ): Promise<Deck[]> {
    return this.deckModel.find({ userId, version: { $gte: version } }).lean();
  }

  async deleteMany(
    deckIds: string[],
    userId: string,
    version: number,
  ): Promise<void> {
    if (!deckIds.length) return;

    const cards = await this.cardService.findAllByDeckId(deckIds);
    const cardIds = cards.map((card) => card._id.toString());

    const deckResult = await this.deckModel.deleteMany({
      _id: { $in: deckIds },
    });

    if (deckResult.deletedCount > 0) {
      if (cardIds.length > 0) {
        await this.cardService.deleteMany(cardIds, userId, version);
      }

      await Promise.all(
        deckIds.map((id) =>
          this.deleteLogService.createLog(userId, version, DeleteType.DECK, id),
        ),
      );
    }
  }
}
