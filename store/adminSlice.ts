import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api, ApiError } from '@/lib/client/api';
import type { ActivityLog, AdminStats, User } from '@/types';

type UserRow = User & { taskCount: number };

interface AdminState {
  stats: AdminStats | null;
  statsLoading: boolean;
  recentLogs: ActivityLog[];

  users: UserRow[];
  usersPage: number;
  usersTotalPages: number;
  usersTotalItems: number;
  usersLoading: boolean;

  logs: ActivityLog[];
  logsPage: number;
  logsTotalPages: number;
  logsTotalItems: number;
  logsLoading: boolean;

  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  statsLoading: true,
  recentLogs: [],
  users: [],
  usersPage: 1,
  usersTotalPages: 1,
  usersTotalItems: 0,
  usersLoading: true,
  logs: [],
  logsPage: 1,
  logsTotalPages: 1,
  logsTotalItems: 0,
  logsLoading: true,
  error: null,
};

function message(error: unknown, fallback: string) {
  return error instanceof ApiError || error instanceof Error ? error.message : fallback;
}

export const fetchDashboard = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => {
  try {
    const [statsRes, logsRes] = await Promise.all([
      api.getAdminStats(),
      api.getAdminLogs({ page: 1, limit: 4 }),
    ]);
    return { stats: statsRes.stats, recentLogs: logsRes.items };
  } catch (error) {
    return rejectWithValue(message(error, 'Failed to load dashboard.'));
  }
});

export const fetchUsers = createAsyncThunk(
  'admin/users',
  async (params: { search: string; role: string; page: number }, { rejectWithValue }) => {
    try {
      return await api.getAdminUsers({ ...params, limit: 8 });
    } catch (error) {
      return rejectWithValue(message(error, 'Failed to load users.'));
    }
  },
);

export const fetchLogs = createAsyncThunk(
  'admin/logs',
  async (params: { search: string; actionType: string; page: number }, { rejectWithValue }) => {
    try {
      return await api.getAdminLogs({ ...params, limit: 10 });
    } catch (error) {
      return rejectWithValue(message(error, 'Failed to load audit logs.'));
    }
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsersPage(state, action: PayloadAction<number>) {
      state.usersPage = action.payload;
    },
    setLogsPage(state, action: PayloadAction<number>) {
      state.logsPage = action.payload;
    },
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.stats;
        state.recentLogs = action.payload.recentLogs;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = (action.payload as string) || 'Failed to load dashboard.';
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.items;
        state.usersTotalPages = action.payload.totalPages;
        state.usersTotalItems = action.payload.totalItems;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = (action.payload as string) || 'Failed to load users.';
      })
      .addCase(fetchLogs.pending, (state) => {
        state.logsLoading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.logsLoading = false;
        state.logs = action.payload.items;
        state.logsTotalPages = action.payload.totalPages;
        state.logsTotalItems = action.payload.totalItems;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.logsLoading = false;
        state.error = (action.payload as string) || 'Failed to load audit logs.';
      });
  },
});

export const { setUsersPage, setLogsPage, clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
