import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { UploadedFile } from '@/hooks/useFileUpload';

interface FileUploadState {
  files: UploadedFile[];
  isUploading: boolean;
}

const initialState: FileUploadState = {
  files: [],
  isUploading: false
};

export const uploadSlice = createSlice({
  name: 'fileUpload',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<UploadedFile>) => {
      state.files.push(action.payload);
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
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    clearAllFiles: (state) => {
      state.files = [];
      state.isUploading = false;
    }
  }
});

export const { addFile, updateFile, removeFile, setIsUploading, clearAllFiles } = uploadSlice.actions;

export const selectFiles = (state: RootState) => state.fileUpload.files;
export const selectIsUploading = (state: RootState) => state.fileUpload.isUploading;

export default uploadSlice.reducer;