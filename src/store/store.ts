import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import dashboardReducer from './slices/dashboardSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    board: boardReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;