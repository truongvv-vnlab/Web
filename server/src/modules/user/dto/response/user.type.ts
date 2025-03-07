import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserResp {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;

  @Field()
  name: string;
}
