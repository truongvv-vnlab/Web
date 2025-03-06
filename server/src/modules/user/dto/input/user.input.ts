import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  _id?: string;
}
