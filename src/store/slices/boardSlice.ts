import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '@prisma/client';

export interface BoardDataType {
  id: string;
  boardId: string;
  name: string;
  data: {
    data: any[];
    columns: string[];
    columnsInfo: any[];
    duration: number;
    updatedAt: number;
  };
}

/** Visualization type for a block: table | barChart | lineChart | etc. */
export type BoardVisualizationType = "table" | "barChart" | "lineChart" | "areaChart" | "scatterPlot" | "pieChart" | "singleValue";

interface BoardState {
  activeBoard: BoardDataType | null;
  boards: Record<string, BoardDataType>; // keyed by boardId
  isLoading: boolean;
  error: string | null;
  /** Board id that is currently loading new sample data (sidepane query change) */
  boardDataLoadingId: string | null;
  /** Sidepane is loading new query data */
  sidepaneQueryLoading: boolean;
  /** Per-board visualization type (boardId -> type) */
  boardVisualization: Record<string, BoardVisualizationType>;
}

const initialState: BoardState = {
  activeBoard: null,
  boards: {},
  isLoading: false,
  error: null,
  boardDataLoadingId: null,
  sidepaneQueryLoading: false,
  boardVisualization: {},
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setActiveBoard: (state, action: PayloadAction<BoardDataType | null>) => {
      state.activeBoard = action.payload;
    },
    setBoardData: (state, action: PayloadAction<BoardDataType>) => {
      const boardData = action.payload;
      state.boards[boardData.boardId] = boardData;
      
      // If this is the active board, update it
      if (state.activeBoard?.boardId === boardData.boardId) {
        state.activeBoard = boardData;
      }
    },
    updateBoardData: (state, action: PayloadAction<Partial<BoardDataType> & { boardId: string }>) => {
      const { boardId, ...updates } = action.payload;
      
      if (state.boards[boardId]) {
        state.boards[boardId] = {
          ...state.boards[boardId],
          ...updates,
        };
      }
      
      // Update active board if it's the one being updated
      if (state.activeBoard?.boardId === boardId) {
        state.activeBoard = {
          ...state.activeBoard,
          ...updates,
        };
      }
    },
    removeBoardData: (state, action: PayloadAction<string>) => {
      const boardId = action.payload;
      delete state.boards[boardId];
      
      // Clear active board if it's the one being removed
      if (state.activeBoard?.boardId === boardId) {
        state.activeBoard = null;
      }
    },
    clearActiveBoard: (state) => {
      state.activeBoard = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setBoardDataLoadingId: (state, action: PayloadAction<string | null>) => {
      state.boardDataLoadingId = action.payload;
    },
    setSidepaneQueryLoading: (state, action: PayloadAction<boolean>) => {
      state.sidepaneQueryLoading = action.payload;
    },
    setBoardVisualization: (state, action: PayloadAction<{ boardId: string; type: BoardVisualizationType }>) => {
      const { boardId, type } = action.payload;
      state.boardVisualization[boardId] = type;
    },
    clearAllBoards: (state) => {
      state.boards = {};
      state.activeBoard = null;
    },
  },
});

export const {
  setActiveBoard,
  setBoardData,
  updateBoardData,
  removeBoardData,
  clearActiveBoard,
  setLoading,
  setError,
  setBoardDataLoadingId,
  setSidepaneQueryLoading,
  setBoardVisualization,
  clearAllBoards,
} = boardSlice.actions;

export default boardSlice.reducer;
