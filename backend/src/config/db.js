import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env before starting the server.');
  }

  await mongoose.connect(env.mongoUri);
}
