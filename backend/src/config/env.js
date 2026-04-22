import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  jwtCookieName: process.env.JWT_COOKIE_NAME || 'token',
  nodeEnv: process.env.NODE_ENV || 'development',
};

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET is missing. Add it to backend/.env before starting the server.');
}
