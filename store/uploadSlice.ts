import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadedFile } from '@/hooks/useFileUpload';

interface FileUploadState {
  files: UploadedFile[];
}

const initialState: FileUploadState = {
  files: []
};

export const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<UploadedFile>) => {
      state.files.push(action.payload);
      console.log(`Added file: ${action.payload.name}`);
    },
    updateFile: (state, action: PayloadAction<UploadedFile>) => {
      const index = state.files.findIndex(file => file.id === action.payload.id);
      if (index !== -1) {
        state.files[index] = action.payload;
      }
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
    },
    clearFiles: (state) => {
      state.files = [];
    }
  }
});

export const { addFile, updateFile, removeFile, clearFiles } = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
