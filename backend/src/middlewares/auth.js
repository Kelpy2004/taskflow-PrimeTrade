import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function getCookieValue(req, cookieName) {
  const header = req.headers.cookie;
  if (!header) return null;

  const parts = header.split(';').map((part) => part.trim());
  for (const part of parts) {
    const [key, ...rest] = part.split('=');
    if (key === cookieName) {
      return decodeURIComponent(rest.join('='));
    }
  }

  return null;
}

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith('Bearer ') ? header.slice(7) : null;
  const cookieToken = getCookieValue(req, env.jwtCookieName);
  const token = bearerToken || cookieToken;

  if (!token) {
    throw new AppError('Authentication required.', 401);
  }

  let payload;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError('Invalid or expired token.', 401);
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw new AppError('User no longer exists.', 401);
  }

  req.user = user;
  next();
});

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    return next();
  };
}
