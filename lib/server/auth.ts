import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { ApiError } from '@/lib/server/errors';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is missing. Set it in the environment before starting.');
}

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET || 'dev-secret', {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

/** Resolves the authenticated user from the Authorization: Bearer header, or throws 401. */
export async function requireAuth(req: Request): Promise<AuthUser> {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError('Authentication required. Please sign in.', 401);
  }

  let payload: { sub?: string };
  try {
    payload = jwt.verify(token, JWT_SECRET || 'dev-secret') as { sub?: string };
  } catch {
    throw new ApiError('Session expired or invalid. Please sign in again.', 401);
  }

  if (!payload.sub) {
    throw new ApiError('Session expired or invalid. Please sign in again.', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    throw new ApiError('Account no longer exists.', 401);
  }

  return user;
}

export async function requireAdmin(req: Request): Promise<AuthUser> {
  const user = await requireAuth(req);
  if (user.role !== 'admin') {
    throw new ApiError('Admin access required.', 403);
  }
  return user;
}
