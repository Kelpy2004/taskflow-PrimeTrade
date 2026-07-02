import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, ApiError, clearStoredToken, getStoredToken, setStoredToken } from '@/lib/client/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  /** idle → bootstrapping → ready. Guards wait for 'ready' before redirecting. */
  status: 'idle' | 'bootstrapping' | 'ready';
  submitting: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  submitting: false,
  error: null,
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError || error instanceof Error ? error.message : fallback;
}

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async (_, { rejectWithValue }) => {
  if (!getStoredToken()) return null;
  try {
    const response = await api.me();
    return response.user;
  } catch {
    clearStoredToken();
    return rejectWithValue(null);
  }
});

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.login(payload);
      setStoredToken(response.token);
      return response.user;
    } catch (error) {
      return rejectWithValue(errorMessage(error, 'Unable to sign in right now.'));
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.register(payload);
      setStoredToken(response.token);
      return response.user;
    } catch (error) {
      return rejectWithValue(errorMessage(error, 'Unable to create your account right now.'));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearStoredToken();
      state.user = null;
      state.error = null;
      state.status = 'ready';
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'bootstrapping';
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'ready';
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.user = null;
        state.status = 'ready';
      })
      .addCase(login.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.submitting = false;
        state.user = action.payload;
        state.status = 'ready';
      })
      .addCase(login.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Unable to sign in right now.';
      })
      .addCase(register.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.submitting = false;
        state.user = action.payload;
        state.status = 'ready';
      })
      .addCase(register.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Unable to create your account right now.';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
