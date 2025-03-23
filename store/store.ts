// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './dialogSlice';
import fileUploadReducer from './uploadSlice';
import inputReducer from './inputSlice';



export const store = configureStore({
  reducer: {
    dialog: dialogReducer,
    fileUpload: fileUploadReducer,
    input: inputReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;