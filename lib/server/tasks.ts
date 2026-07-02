import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { AuthUser } from '@/lib/server/auth';
import { ApiError } from '@/lib/server/errors';
import { taskInclude } from '@/lib/server/serialize';

export function buildTaskWhere(
  user: AuthUser | null,
  search: string,
  status: string,
): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {};

  // Non-admin users only ever see their own tasks. Pass user = null for admin scope.
  if (user && user.role !== 'admin') {
    where.ownerId = user.id;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) {
    where.status = status;
  }

  return where;
}

/** Loads a task and enforces ownership (admins may access any task). */
export async function findTaskForUser(taskId: string, user: AuthUser) {
  const task = await prisma.task.findUnique({ where: { id: taskId }, include: taskInclude });

  if (!task) {
    throw new ApiError('Task not found.', 404);
  }

  if (user.role !== 'admin' && task.ownerId !== user.id) {
    throw new ApiError('You do not have permission to access this task.', 403);
  }

  return task;
}
