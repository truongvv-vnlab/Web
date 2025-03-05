import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document<ObjectId> {
  @Prop({ unique: true, trim: true, lowercase: true })
  email?: string;

  @Prop({ unique: true, sparse: true, trim: true })
  username?: string;

  @Prop()
  name: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ unique: true, sparse: true })
  googleId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
