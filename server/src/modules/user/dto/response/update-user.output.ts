import { Field, ObjectType } from '@nestjs/graphql';
import { UserResp } from './user.type';

@ObjectType()
export class UpdateUserResp {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => UserResp)
  user: UserResp | null;
}
