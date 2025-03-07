import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserResp } from './dto/response/user.type';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { ChangePasswordResp } from './dto/response/change-pass.output';
import { ChangePasswordInput } from './dto/input/change-pass.input';
import { UpdateUserResp } from './dto/response/update-user.output';
import { UpdateUserInput } from './dto/input/update-user.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResp, { nullable: true })
  @UseGuards(AuthGuard)
  async whoami(@Context('req') req: any): Promise<UserResp | null> {
    const userId = req.user.userId;
    const user = await this.userService.findById(userId);
    if (user) {
      const { password, ...userData } = user;
      return userData;
    }
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

  @Mutation(() => UpdateUserResp)
  @UseGuards(AuthGuard)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @Context('req') req: any,
  ) {
    const userId = req.user.userId;
    return this.userService.updateUser(userId, input);
  }
}
