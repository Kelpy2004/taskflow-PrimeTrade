import { z } from 'zod';

const taskBody = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(1000).default(''),
  status: z.enum(['pending', 'in-progress', 'completed']),
});

export const listTasksSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    search: z.string().trim().max(120).optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
  }),
});

export const createTaskSchema = z.object({
  body: taskBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateTaskSchema = z.object({
  body: taskBody,
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});
