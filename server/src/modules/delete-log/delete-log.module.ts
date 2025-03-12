import { Module } from '@nestjs/common';
import { DeleteLogService } from './delete-log.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeleteLog,
  DeleteLogSchema,
} from 'src/common/schemas/deleteLog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeleteLog.name, schema: DeleteLogSchema },
    ]),
  ],
  providers: [DeleteLogService],
  exports: [DeleteLogService],
})
export class DeleteLogModule {}
