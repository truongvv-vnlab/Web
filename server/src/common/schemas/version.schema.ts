import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Version {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, default: 1 })
  version: number;
}

export const VersionSchema = SchemaFactory.createForClass(Version);
