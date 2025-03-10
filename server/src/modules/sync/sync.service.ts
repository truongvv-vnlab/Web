import { CardService } from './../card/card.service';
import { InjectModel } from '@nestjs/mongoose';
import { SyncInput } from './dto/input/sync-input';
import { Injectable } from '@nestjs/common';
import { Version } from 'src/common/schemas/version.schema';
import mongoose, { ObjectId } from 'mongoose';
import { DeckService } from '../deck/deck.service';
import { SyncResp } from './dto/response/sync-response';
import { Card } from 'src/common/schemas/card.schema';
import { Deck } from 'src/common/schemas/deck.schema';

@Injectable()
export class SyncService {
  constructor(
    @InjectModel(Version.name) private versionModel: mongoose.Model<Version>,
    private readonly cardService: CardService,
    private readonly deckService: DeckService,
  ) {}

  async createVersion(userId: ObjectId): Promise<Version> {
    const newVersion = new this.versionModel({ userId, version: 1 });
    return newVersion.save();
  }

  async updateVersion(userId: string, newVersion: number): Promise<void> {
    const existingVersion = await this.versionModel.findOne({ _id: userId });
    if (!existingVersion) {
      await this.versionModel.create({ userId, version: newVersion });
    } else if (newVersion > existingVersion.version) {
      existingVersion.version = newVersion;
      await existingVersion.save();
    }
  }

  async pull(userId: string, dbVersion: number): Promise<SyncResp> {
    const decks = await this.deckService.findAllByUserId(userId);
    const cards = await this.cardService.findAllByUserId(userId);
    const response: SyncResp = {
      version: dbVersion,
      decks,
      cards,
    };
    return response;
  }

  async push(userId: string, input: SyncInput): Promise<SyncResp> {
    const decksToSave: Deck[] = [];
    const decksToDelete: string[] = [];
    const cardsToSave: Card[] = [];
    const cardsToDelete: string[] = [];

    for (const deck of input.decks || []) {
      if (deck.isDelete) {
        decksToDelete.push(deck._id);
      } else {
        decksToSave.push({ ...deck, userId });
      }
    }

    for (const card of input.cards || []) {
      if (card.isDelete) {
        cardsToDelete.push(card._id);
      } else {
        cardsToSave.push(card);
      }
    }

    if (decksToSave.length) await this.deckService.saveMany(decksToSave);
    if (decksToDelete.length) await this.deckService.deleteMany(decksToDelete);
    if (cardsToSave.length) await this.cardService.saveMany(cardsToSave);
    if (cardsToDelete.length) await this.cardService.deleteMany(cardsToDelete);

    this.updateVersion(userId, input.version!);
    const response: SyncResp = {
      version: input.version,
      cards: [],
      decks: [],
    };
    return response;
  }

  async sync(userId: string, input: SyncInput): Promise<SyncResp> {
    const dbVersion = await this.versionModel.findOne({ userId });
    // input.version === 0
    if (input.version === 0) {
      return this.pull(userId, dbVersion!.version);
    } else {
      //input.version > db.version
      return this.push(userId, input);
    }
    //cards.lenght === 0 && decks.length === 0 return;
    //input.version < db.version
    //input.version === db.version
  }
}
