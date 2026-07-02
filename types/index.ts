export type UserRole = 'admin' | 'user';

/** DB values stay pending/in-progress/completed; the UI labels them To Do / In Progress / Done. */
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type ActionType = 'task.created' | 'task.updated' | 'task.deleted';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TaskOwner {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  owner: TaskOwner;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  actionType: ActionType;
  actor: TaskOwner;
  taskId: string | null;
  taskTitleSnapshot: string;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminStats {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface TaskDraft {
  title: string;
  description: string;
  status: TaskStatus;
}
