import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DeleteLog } from 'src/common/schemas/deleteLog.schema';

@Injectable()
export class DeleteLogService {
  constructor(
    @InjectModel(DeleteLog.name)
    private deleteLogModel: mongoose.Model<DeleteLog>,
  ) {}

  async createLog(
    userId: string,
    version: number,
    type: number,
    targetId: string,
  ): Promise<DeleteLog> {
    const log = new this.deleteLogModel({ userId, version, type, targetId });
    return await log.save();
  }

  async getLogsByVersionByUserId(
    userId: string,
    version: number,
  ): Promise<DeleteLog[]> {
    return await this.deleteLogModel
      .find({ version: { $gte: version }, userId })
      .lean();
  }
}
