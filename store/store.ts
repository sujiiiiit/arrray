// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './dialogSlice';
import fileUploadReducer from './uploadSlice';


export const store = configureStore({
  reducer: {
    dialog: dialogReducer,
    fileUpload: fileUploadReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;