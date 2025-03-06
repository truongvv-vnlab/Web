import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserResp } from './dto/response/user.output';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { ChangePasswordResp } from './dto/response/changepass.output';
import { ChangePasswordInput } from './dto/input/changepass.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResp, { nullable: true })
  @UseGuards(AuthGuard)
  async whoami(@Context('req') req: any): Promise<UserResp | null> {
    const userId = req.user.userId;
    const user = await this.userService.findById(userId);
    console.log(user);
    return user;
  }

  @Mutation(() => ChangePasswordResp)
  @UseGuards(AuthGuard)
  async changePassword(
    @Context('req') req: any,
    @Args('input') input: ChangePasswordInput,
  ): Promise<ChangePasswordResp> {
    const userId = req.user.userId;
    return this.userService.changePassword(userId, input);
  }
}
