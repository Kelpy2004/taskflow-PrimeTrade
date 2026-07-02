import { z } from 'zod';
import { ApiError } from '@/lib/server/errors';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(60),
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const taskStatusSchema = z.enum(['pending', 'in-progress', 'completed']);

export const createTaskSchema = z.object({
  title: z.string().trim().min(4, 'Title must be at least 4 characters.').max(120),
  description: z.string().trim().max(1000).optional().default(''),
  status: taskStatusSchema.optional().default('pending'),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(4, 'Title must be at least 4 characters.').max(120).optional(),
    description: z.string().trim().max(1000).optional(),
    status: taskStatusSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, { message: 'Nothing to update.' });

export const listQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(''),
  status: z.union([taskStatusSchema, z.literal('')]).optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(8),
});

export const usersQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(''),
  role: z.union([z.enum(['user', 'admin']), z.literal('')]).optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(8),
});

export const logsQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(''),
  actionType: z
    .union([z.enum(['task.created', 'task.updated', 'task.deleted']), z.literal('')])
    .optional()
    .default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(8),
});

export async function parseBody<T extends z.ZodTypeAny>(req: Request, schema: T): Promise<z.output<T>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ApiError('Request body must be valid JSON.', 400);
  }
  return schema.parse(raw);
}

export function parseQuery<T extends z.ZodTypeAny>(req: Request, schema: T): z.output<T> {
  const url = new URL(req.url);
  return schema.parse(Object.fromEntries(url.searchParams.entries()));
}
