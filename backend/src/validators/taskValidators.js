import { z } from 'zod';

const taskBody = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(1000).default(''),
  status: z.enum(['pending', 'in-progress', 'completed']),
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
