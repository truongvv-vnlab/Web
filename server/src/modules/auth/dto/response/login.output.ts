import { ObjectId } from 'mongoose';

export type LoginOutput = {
  user: {
    _id: ObjectId;
    username?: string;
    googleId?: string;
    email?: string;
    name: string;
  };
  jwtToken: string;
};
