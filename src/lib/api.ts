import type {
  ActivityLog,
  AdminStats,
  AuthResponse,
  PaginatedResponse,
  Task,
  TaskFilters,
  User,
} from '@/src/types/api';
import { getStoredToken } from '@/src/lib/storage';

const PRODUCTION_API_FALLBACK = 'https://taskforge-q6t2.onrender.com/api/v1';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? PRODUCTION_API_FALLBACK : 'http://localhost:4000/api/v1');

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function buildQuery<T extends object>(params?: T) {
  const query = new URLSearchParams();

  Object.entries((params || {}) as Record<string, string | number | undefined>).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const token = options.token ?? getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(payload?.message || 'Something went wrong.', response.status);
  }

  return payload as T;
}

export const api = {
  login(payload: { email: string; password: string }) {
    return request<AuthResponse>('/auth/login', { method: 'POST', body: payload });
  },
  register(payload: { name: string; email: string; password: string }) {
    return request<AuthResponse>('/auth/register', { method: 'POST', body: payload });
  },
  me() {
    return request<{ user: User }>('/auth/me');
  },
  getTasks(filters: TaskFilters = {}) {
    return request<PaginatedResponse<Task>>(`/tasks${buildQuery(filters)}`);
  },
  getTask(id: string) {
    return request<{ task: Task }>(`/tasks/${id}`);
  },
  createTask(payload: { title: string; description: string; status: string }) {
    return request<{ task: Task; message: string }>('/tasks', { method: 'POST', body: payload });
  },
  updateTask(id: string, payload: { title: string; description: string; status: string }) {
    return request<{ task: Task; message: string }>(`/tasks/${id}`, { method: 'PATCH', body: payload });
  },
  deleteTask(id: string) {
    return request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' });
  },
  getAdminStats() {
    return request<{ stats: AdminStats }>('/admin/stats');
  },
  getAdminUsers(params: { search?: string; role?: string; page?: number; limit?: number } = {}) {
    return request<PaginatedResponse<User>>(`/admin/users${buildQuery(params)}`);
  },
  getAdminTasks(filters: TaskFilters = {}) {
    return request<PaginatedResponse<Task>>(`/admin/tasks${buildQuery(filters)}`);
  },
  getAdminLogs(params: { search?: string; actionType?: string; page?: number; limit?: number } = {}) {
    return request<PaginatedResponse<ActivityLog>>(`/admin/logs${buildQuery(params)}`);
  },
};

export { ApiError, API_BASE_URL };
