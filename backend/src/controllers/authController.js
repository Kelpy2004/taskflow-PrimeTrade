import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';
import { serializeUser } from '../utils/serialize.js';
import { env } from '../config/env.js';
import { sanitizeEmail, sanitizeText } from '../utils/sanitize.js';

function setAuthCookie(res, token) {
  res.cookie(env.jwtCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    // Keep cookie aligned with JWT lifetime roughly (default 7 days)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function normalizeLoginEmail(email) {
  if (email === 'admin@glacier.local') {
    return 'admin@taskforge.local';
  }

  if (email === 'user@glacier.local') {
    return 'user@taskforge.local';
  }

  return email;
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body;
  const cleanEmail = sanitizeEmail(email);
  const cleanName = sanitizeText(name);

  const existingUser = await User.findOne({ email: cleanEmail });

  if (existingUser) {
    throw new AppError('An account with that email already exists.', 409);
  }

  const user = await User.create({
    name: cleanName,
    email: cleanEmail,
    password,
    role: 'user',
  });

  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);

  res.status(201).json({
    token,
    user: serializeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const cleanEmail = normalizeLoginEmail(sanitizeEmail(email));
  const user = await User.findOne({ email: cleanEmail }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);

  res.json({
    token,
    user: serializeUser(user),
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    user: serializeUser(req.user),
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.jwtCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
  });
  res.json({ message: 'Logged out.' });
});
