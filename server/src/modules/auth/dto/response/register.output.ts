import { ObjectId } from 'mongoose';

export type RegisterOutPut = {
  user: {
    _id: ObjectId;
    username?: string;
    googleId?: string;
    email?: string;
    name: string;
  };
  jwtToken: string;
};
