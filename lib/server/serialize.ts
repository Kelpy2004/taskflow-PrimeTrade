import type { ActivityLog, Task, TaskOwner, User } from '@/types';

const ownerSelect = { id: true, name: true, email: true, role: true } as const;
export const taskInclude = { owner: { select: ownerSelect } } as const;
export const logInclude = { actor: { select: ownerSelect } } as const;

type DbOwner = { id: string; name: string; email: string; role: string };
type DbUser = DbOwner & { createdAt: Date };
type DbTask = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  owner: DbOwner;
};
type DbLog = {
  id: string;
  actionType: string;
  taskId: string | null;
  taskTitleSnapshot: string;
  metadata: unknown;
  createdAt: Date;
  actor: DbOwner;
};

function serializeOwner(owner: DbOwner): TaskOwner {
  return { ...owner, role: owner.role as TaskOwner['role'] };
}

export function serializeUser(user: DbUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as User['role'],
    createdAt: user.createdAt.toISOString(),
  };
}

export function serializeTask(task: DbTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as Task['status'],
    owner: serializeOwner(task.owner),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function serializeLog(log: DbLog): ActivityLog {
  return {
    id: log.id,
    actionType: log.actionType as ActivityLog['actionType'],
    actor: serializeOwner(log.actor),
    taskId: log.taskId,
    taskTitleSnapshot: log.taskTitleSnapshot,
    metadata: (log.metadata as Record<string, unknown> | null) ?? null,
    createdAt: log.createdAt.toISOString(),
  };
}

export function paginated<T>(items: T[], page: number, limit: number, totalItems: number) {
  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.max(Math.ceil(totalItems / limit), 1),
  };
}
