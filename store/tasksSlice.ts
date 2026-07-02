import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api, ApiError } from '@/lib/client/api';
import type { Task, TaskDraft, TaskStatus } from '@/types';

export type TasksView = 'board' | 'list';

interface TasksState {
  items: Task[];
  view: TasksView;
  search: string;
  statusFilter: '' | TaskStatus;
  page: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
  mutating: boolean;
}

const initialState: TasksState = {
  items: [],
  view: 'board',
  search: '',
  statusFilter: '',
  page: 1,
  totalPages: 1,
  totalItems: 0,
  loading: true,
  error: null,
  mutating: false,
};

function message(error: unknown, fallback: string) {
  return error instanceof ApiError || error instanceof Error ? error.message : fallback;
}

/**
 * Board view loads a large page (the whole working set) so drag-and-drop is instant;
 * list view uses real server pagination. Admins hit the all-tasks endpoint.
 */
export const fetchTasks = createAsyncThunk(
  'tasks/fetch',
  async (params: { admin: boolean }, { getState, rejectWithValue }) => {
    const { tasks } = getState() as { tasks: TasksState };
    const board = tasks.view === 'board';
    const filters = {
      search: tasks.search,
      status: tasks.statusFilter,
      page: board ? 1 : tasks.page,
      limit: board ? 100 : 8,
    };
    try {
      return params.admin ? await api.getAdminTasks(filters) : await api.getTasks(filters);
    } catch (error) {
      return rejectWithValue(message(error, 'Failed to load tasks.'));
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (draft: TaskDraft, { rejectWithValue }) => {
    try {
      const response = await api.createTask(draft);
      return response.task;
    } catch (error) {
      return rejectWithValue(message(error, 'Unable to create task.'));
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (params: { id: string; changes: Partial<TaskDraft> }, { rejectWithValue }) => {
    try {
      const response = await api.updateTask(params.id, params.changes);
      return response.task;
    } catch (error) {
      return rejectWithValue(message(error, 'Unable to save task.'));
    }
  },
);

/** Optimistic status move: reducer applies instantly; rejection rolls back in the component. */
export const moveTask = createAsyncThunk(
  'tasks/move',
  async (params: { id: string; status: TaskStatus; prevStatus: TaskStatus }, { rejectWithValue }) => {
    try {
      const response = await api.updateTask(params.id, { status: params.status });
      return response.task;
    } catch (error) {
      return rejectWithValue(message(error, 'Unable to move task.'));
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(message(error, 'Unable to delete task.'));
    }
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setView(state, action: PayloadAction<TasksView>) {
      state.view = action.payload;
      state.page = 1;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setStatusFilter(state, action: PayloadAction<'' | TaskStatus>) {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    /** Synchronous optimistic move (also used for rollback with the previous status). */
    taskStatusChanged(state, action: PayloadAction<{ id: string; status: TaskStatus }>) {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
    clearTasksError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to load tasks.';
      })
      .addCase(createTask.pending, (state) => {
        state.mutating = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.mutating = false;
        state.items.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createTask.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(updateTask.pending, (state) => {
        state.mutating = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.mutating = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTask.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalItems = Math.max(state.totalItems - 1, 0);
      });
  },
});

export const { setView, setSearch, setStatusFilter, setPage, taskStatusChanged, clearTasksError } =
  tasksSlice.actions;
export default tasksSlice.reducer;
