import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SyncResp } from './dto/response/sync-response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { SyncInput } from './dto/input/sync-input';
import { SyncService } from './sync.service';

@Resolver()
export class SyncResolver {
  constructor(private readonly syncService: SyncService) {}

  @Mutation(() => SyncResp)
  @UseGuards(AuthGuard)
  async sync(
    @Context('req') req: any,
    @Args('input') input: SyncInput,
  ): Promise<SyncResp> {
    const userId = req.user.userId;
    return this.syncService.sync(userId, input);
  }
}
