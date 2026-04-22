import { z } from 'zod';

export const listUsersSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    search: z.string().optional(),
    role: z.enum(['admin', 'user']).optional(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }),
});

export const listLogsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    search: z.string().optional(),
    actionType: z.enum(['task.created', 'task.updated', 'task.deleted']).optional(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }),
});
