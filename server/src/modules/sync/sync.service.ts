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
import { DeleteLogService } from '../delete-log/delete-log.service';
import { DeleteLog } from 'src/common/schemas/deleteLog.schema';

@Injectable()
export class SyncService {
  constructor(
    @InjectModel(Version.name) private versionModel: mongoose.Model<Version>,
    private readonly cardService: CardService,
    private readonly deckService: DeckService,
    private readonly deleteLogService: DeleteLogService,
  ) {}

  async createVersion(userId: ObjectId): Promise<Version> {
    const newVersion = new this.versionModel({ userId, version: 1 });
    return newVersion.save();
  }

  async updateVersion(userId: string, newVersion: number): Promise<void> {
    const existingVersion = await this.versionModel.findOne({ userId: userId });
    if (!existingVersion) {
      await this.versionModel.create({ userId, version: newVersion });
    } else if (newVersion > existingVersion.version) {
      existingVersion.version = newVersion;
      await existingVersion.save();
    }
  }

  async pull(userId: string, dbVersion: number): Promise<SyncResp> {
    const decks = await this.deckService.findAllByUserId(userId);
    const decksId: string[] = decks.map((deck) => deck._id);
    const cards = await this.cardService.findAllByDeckId(decksId);
    const response: SyncResp = {
      version: dbVersion,
      decks,
      cards,
      deleteLogs: [],
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
    if (decksToDelete.length)
      await this.deckService.deleteMany(decksToDelete, userId, input.version);
    if (cardsToSave.length) await this.cardService.saveMany(cardsToSave);
    if (cardsToDelete.length)
      await this.cardService.deleteMany(cardsToDelete, userId, input.version);

    this.updateVersion(userId, input.version);
    const response: SyncResp = {
      version: input.version,
      cards: [],
      decks: [],
      deleteLogs: [],
    };
    return response;
  }

  async addNewData(
    userId: string,
    input: SyncInput,
    dbVersion: number,
  ): Promise<SyncResp> {
    const existingDecks = await this.deckService.findAllByUserId(userId);
    const existingDeckIds = new Set(
      existingDecks.map((deck) => deck._id.toString()),
    );
    const newDecks = input.decks!.filter(
      (deck) => !existingDeckIds.has(deck._id),
    );
    const newDecksToSave: Deck[] = newDecks.map((deck) => ({
      ...deck,
      version: dbVersion,
      userId,
    }));

    if (newDecksToSave.length) {
      await this.deckService.saveMany(newDecksToSave);
    }

    const deckIds = existingDecks.map((deck) => deck._id);
    const existingCards = await this.cardService.findAllByDeckId(deckIds);
    const existingCardIds = new Set(
      existingCards.map((card) => card._id.toString()),
    );
    const newCards = input.cards!.filter(
      (card) => !existingCardIds.has(card._id),
    );
    const newCardsToSave: Card[] = newCards.map((card) => ({
      ...card,
      version: dbVersion,
    }));

    if (newCardsToSave.length) {
      await this.cardService.saveMany(newCardsToSave);
    }

    const decksToReturn = await this.deckService.findAllByUserId(userId);
    const decksToReturnIds: string[] = decksToReturn.map((deck) => deck._id);
    const cardsToReturn =
      await this.cardService.findAllByDeckId(decksToReturnIds);
    const deleteLogs: DeleteLog[] =
      await this.deleteLogService.getLogsByVersionByUserId(
        userId,
        input.version,
      );
    return {
      version: dbVersion,
      decks: decksToReturn,
      cards: cardsToReturn,
      deleteLogs,
    };
  }

  async syncData(userId: string, input: SyncInput): Promise<SyncResp> {
    const existingDecks = await this.deckService.findAllByUserId(userId);
    const existingDeckMap = new Map(
      existingDecks.map((deck) => [deck._id, deck]),
    );

    const deckIds = existingDecks.map((deck) => deck._id);
    const existingCards = await this.cardService.findAllByDeckId(deckIds);
    const existingCardMap = new Map(
      existingCards.map((card) => [card._id, card]),
    );

    const decksToSave: Deck[] = [];
    const decksToDelete: string[] = [];
    const cardsToSave: Card[] = [];
    const cardsToDelete: string[] = [];

    for (const deck of input.decks || []) {
      const existingDeck = existingDeckMap.get(deck._id);
      if (existingDeck) {
        if (
          deck.version > existingDeck.version ||
          (deck.version === existingDeck.version &&
            deck.updatedAt > existingDeck.updatedAt)
        ) {
          if (deck.isDelete) {
            decksToDelete.push(deck._id);
          } else {
            decksToSave.push({ ...deck, userId });
          }
        }
      } else {
        decksToSave.push({ ...deck, userId });
      }
    }

    for (const card of input.cards || []) {
      const existingCard = existingCardMap.get(card._id);
      if (existingCard) {
        if (
          card.version > existingCard.version ||
          (card.version === existingCard.version &&
            card.updatedAt > existingCard.updatedAt)
        ) {
          if (card.isDelete) {
            cardsToDelete.push(card._id);
          } else {
            cardsToSave.push(card);
          }
        }
      } else {
        cardsToSave.push(card);
      }
    }

    if (decksToSave.length) await this.deckService.saveMany(decksToSave);
    if (decksToDelete.length)
      await this.deckService.deleteMany(decksToDelete, userId, input.version);
    if (cardsToSave.length) await this.cardService.saveMany(cardsToSave);
    if (cardsToDelete.length)
      await this.cardService.deleteMany(cardsToDelete, userId, input.version);

    const decksToReturn = await this.deckService.getDecksByVersionAndUserId(
      userId,
      input.version,
    );
    const decksToReturnIds: string[] = decksToReturn.map((deck) => deck._id);
    const cardsToReturn = await this.cardService.getCardsByVersionAndDeckIds(
      decksToReturnIds,
      input.version,
    );
    const deleteLogs: DeleteLog[] =
      await this.deleteLogService.getLogsByVersionByUserId(
        userId,
        input.version,
      );
    return {
      version: input.version,
      decks: decksToReturn,
      cards: cardsToReturn,
      deleteLogs,
    };
  }

  async sync(userId: string, input: SyncInput): Promise<SyncResp> {
    const dbVersion = await this.versionModel.findOne({ userId });
    switch (true) {
      case input.version === 0:
        return this.pull(userId, dbVersion!.version);
      case input.version > dbVersion!.version:
        return this.push(userId, input);
      case input.version < dbVersion!.version:
        return this.addNewData(userId, input, dbVersion!.version);
      case input.version === dbVersion!.version:
        return this.syncData(userId, input);
      default:
        return {
          version: dbVersion!.version,
          decks: [],
          cards: [],
          deleteLogs: [],
        };
    }
  }
}
