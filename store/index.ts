import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import tasksReducer from '@/store/tasksSlice';
import adminReducer from '@/store/adminSlice';
import uiReducer from '@/store/uiSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      tasks: tasksReducer,
      admin: adminReducer,
      ui: uiReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
