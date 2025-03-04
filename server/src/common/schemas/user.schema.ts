import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ unique: false, required: false })
  username: string;

  @Prop({ required: false, select: false })
  password: string;

  @Prop({ required: false, select: false })
  googleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
