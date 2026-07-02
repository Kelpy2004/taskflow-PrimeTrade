import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TaskStatus } from '@/types';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  /** Optional undo payload — shown as an Undo button that reverts a status move. */
  undo?: { taskId: string; prevStatus: TaskStatus };
}

interface UiState {
  toasts: Toast[];
  paletteOpen: boolean;
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  toasts: [],
  paletteOpen: false,
  mobileNavOpen: false,
};

let toastCounter = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toastAdded: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload);
        // Max 3 stacked (skill.md).
        if (state.toasts.length > 3) state.toasts.shift();
      },
      prepare(toast: Omit<Toast, 'id'>) {
        toastCounter += 1;
        return { payload: { ...toast, id: `toast-${Date.now()}-${toastCounter}` } };
      },
    },
    toastDismissed(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    paletteToggled(state, action: PayloadAction<boolean | undefined>) {
      state.paletteOpen = action.payload ?? !state.paletteOpen;
    },
    mobileNavToggled(state, action: PayloadAction<boolean | undefined>) {
      state.mobileNavOpen = action.payload ?? !state.mobileNavOpen;
    },
  },
});

export const { toastAdded, toastDismissed, paletteToggled, mobileNavToggled } = uiSlice.actions;
export default uiSlice.reducer;
