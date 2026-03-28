import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dashboard, Board } from '@prisma/client';

type DashboardWithBoards = Dashboard & {
  boards: Board[];
};

interface DashboardState {
  dashboards: Dashboard[];
  currentDashboard: DashboardWithBoards | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  dashboards: [],
  currentDashboard: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboards: (state, action: PayloadAction<Dashboard[]>) => {
      state.dashboards = action.payload;
    },
    addDashboard: (state, action: PayloadAction<Dashboard>) => {
      state.dashboards.push(action.payload);
    },
    removeDashboard: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.dashboards = state.dashboards.filter((d) => d.id !== id);
      if (state.currentDashboard?.id === id) {
        state.currentDashboard = null;
      }
    },
    setCurrentDashboard: (state, action: PayloadAction<DashboardWithBoards>) => {
      state.currentDashboard = action.payload;
      // Update the dashboard in the dashboards array as well
      const index = state.dashboards.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.dashboards[index] = {
          ...state.dashboards[index],
          name: action.payload.name,
          isDefault: action.payload.isDefault,
        };
      } else {
        // If not found, add it
        state.dashboards.push({
          id: action.payload.id,
          name: action.payload.name,
          userId: action.payload.userId,
          isDefault: action.payload.isDefault,
        });
      }
    },
    updateDashboardName: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { id, name } = action.payload;
      
      // Update in dashboards array
      const dashboardIndex = state.dashboards.findIndex(d => d.id === id);
      if (dashboardIndex !== -1) {
        state.dashboards[dashboardIndex].name = name;
      }
      
      // Update current dashboard if it's the one being updated
      if (state.currentDashboard?.id === id) {
        state.currentDashboard.name = name;
      }
    },
    updateDashboardBoards: (state, action: PayloadAction<{ dashboardId: string; boards: Board[] }>) => {
      const { dashboardId, boards } = action.payload;
      
      if (state.currentDashboard?.id === dashboardId) {
        state.currentDashboard.boards = boards;
      }
    },
    addBoardToDashboard: (state, action: PayloadAction<Board>) => {
      const board = action.payload;
      if (state.currentDashboard?.id === board.dashboardId) {
        state.currentDashboard.boards.push(board);
      }
    },
    updateBoardInDashboard: (state, action: PayloadAction<Board>) => {
      const updatedBoard = action.payload;
      if (state.currentDashboard) {
        const boardIndex = state.currentDashboard.boards.findIndex(
          b => b.id === updatedBoard.id
        );
        if (boardIndex !== -1) {
          state.currentDashboard.boards[boardIndex] = updatedBoard;
        }
      }
    },
    removeBoardFromDashboard: (state, action: PayloadAction<string>) => {
      const boardId = action.payload;
      if (state.currentDashboard) {
        state.currentDashboard.boards = state.currentDashboard.boards.filter(
          b => b.id !== boardId
        );
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCurrentDashboard: (state) => {
      state.currentDashboard = null;
    },
  },
});

export const {
  setDashboards,
  addDashboard,
  removeDashboard,
  setCurrentDashboard,
  updateDashboardName,
  updateDashboardBoards,
  addBoardToDashboard,
  updateBoardInDashboard,
  removeBoardFromDashboard,
  setLoading,
  setError,
  clearCurrentDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
