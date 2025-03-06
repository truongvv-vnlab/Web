import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChangePasswordResp {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
