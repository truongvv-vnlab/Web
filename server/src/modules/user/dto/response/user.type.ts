import { ObjectType, Field } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { ObjectIdScalar } from 'src/common/graphql/uuid.scarlar';

@ObjectType()
export class UserResp {
  @Field(() => ObjectIdScalar)
  _id: ObjectId;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  googleId?: string;
}
