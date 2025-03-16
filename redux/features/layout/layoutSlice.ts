import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
  isSidebarOpen: boolean;
}

const initialState: LayoutState = {
  isSidebarOpen: true, // Default to open
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen } = layoutSlice.actions;
export default layoutSlice.reducer; 