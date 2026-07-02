import type {
  ActivityLog,
  AdminStats,
  AuthResponse,
  PaginatedResponse,
  Task,
  TaskDraft,
  TaskFilters,
  User,
} from '@/types';

const API_BASE_URL = '/api/v1';
const TOKEN_KEY = 'taskforge_token';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

function buildQuery(params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value));
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
}

async function request<T>(path: string, options: { method?: string; body?: unknown } = {}) {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : null;

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
    return request<PaginatedResponse<Task>>(`/tasks${buildQuery(filters as Record<string, string | number | undefined>)}`);
  },
  createTask(payload: TaskDraft) {
    return request<{ task: Task; message: string }>('/tasks', { method: 'POST', body: payload });
  },
  updateTask(id: string, payload: Partial<TaskDraft>) {
    return request<{ task: Task; message: string }>(`/tasks/${id}`, { method: 'PATCH', body: payload });
  },
  deleteTask(id: string) {
    return request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' });
  },
  getAdminStats() {
    return request<{ stats: AdminStats }>('/admin/stats');
  },
  getAdminUsers(params: { search?: string; role?: string; page?: number; limit?: number } = {}) {
    return request<PaginatedResponse<User & { taskCount: number }>>(`/admin/users${buildQuery(params)}`);
  },
  getAdminTasks(filters: TaskFilters = {}) {
    return request<PaginatedResponse<Task>>(`/admin/tasks${buildQuery(filters as Record<string, string | number | undefined>)}`);
  },
  getAdminLogs(params: { search?: string; actionType?: string; page?: number; limit?: number } = {}) {
    return request<PaginatedResponse<ActivityLog>>(`/admin/logs${buildQuery(params)}`);
  },
};
