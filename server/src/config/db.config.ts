import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  uri: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/mydatabase',
}));
