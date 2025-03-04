// store/dialogSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state) => {
      state.isOpen = true;
    },
    closeDialog: (state) => {
      state.isOpen = false;
    },
    toggleDialog: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openDialog, closeDialog, toggleDialog } = dialogSlice.actions;
export default dialogSlice.reducer;