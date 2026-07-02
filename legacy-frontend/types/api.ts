export type UserRole = 'admin' | 'user';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

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
  actionType: 'task.created' | 'task.updated' | 'task.deleted';
  actor: TaskOwner;
  task?: string;
  taskTitleSnapshot: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
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
