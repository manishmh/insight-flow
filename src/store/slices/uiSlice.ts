import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebar: {
    open: boolean;
    width: number;
    hover: boolean;
  };
  sidepane: {
    open: boolean;
  };
  search: {
    open: boolean;
  };
}

const initialState: UIState = {
  sidebar: {
    open: true,
    width: 250,
    hover: false,
  },
  sidepane: {
    open: false,
  },
  search: {
    open: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.open = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebar.open = !state.sidebar.open;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebar.width = action.payload;
    },
    setSidebarHover: (state, action: PayloadAction<boolean>) => {
      state.sidebar.hover = action.payload;
    },
    setSidepaneOpen: (state, action: PayloadAction<boolean>) => {
      state.sidepane.open = action.payload;
    },
    toggleSidepane: (state) => {
      state.sidepane.open = !state.sidepane.open;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.search.open = action.payload;
    },
    toggleSearch: (state) => {
      state.search.open = !state.search.open;
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebar,
  setSidebarWidth,
  setSidebarHover,
  setSidepaneOpen,
  toggleSidepane,
  setSearchOpen,
  toggleSearch,
} = uiSlice.actions;

export default uiSlice.reducer;
