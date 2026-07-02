import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

interface LogParams {
  actionType: 'task.created' | 'task.updated' | 'task.deleted';
  actorId: string;
  taskId?: string | null;
  taskTitleSnapshot: string;
  metadata?: Record<string, unknown>;
}

/** Fire-and-log audit entry. Never blocks the main action on failure. */
export async function logActivity(params: LogParams) {
  try {
    await prisma.activityLog.create({
      data: {
        actionType: params.actionType,
        actorId: params.actorId,
        taskId: params.taskId ?? null,
        taskTitleSnapshot: params.taskTitleSnapshot,
        metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error('Failed to write activity log:', error);
  }
}
