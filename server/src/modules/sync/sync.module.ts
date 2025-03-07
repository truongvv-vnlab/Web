import { Module, Version } from '@nestjs/common';
import { CardModule } from '../card/card.module';
import { DeckModule } from '../deck/deck.module';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VersionSchema } from 'src/common/schemas/version.schema';
import { SyncResolver } from './sync.resolver';
import { SyncService } from './sync.service';

@Module({
  imports: [
    DeckModule,
    CardModule,
    UserModule,
    MongooseModule.forFeature([{ name: Version.name, schema: VersionSchema }]),
  ],
  providers: [SyncResolver, SyncService],
})
export class SyncModule {}
