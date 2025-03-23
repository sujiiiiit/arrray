import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// Define types for our state
interface FeedbackState {
  good: boolean;
  bad: boolean;
  message: string;
}

interface InputImage {
  id: string;
  url: string;
  name: string;
  type: string;
}

export interface InputState {
  text: string;
  searchEnabled: boolean;
  searchQuery: string;
  imagePresent: boolean;
  images: InputImage[];
  isProjectSelected: boolean;
  projectId: string;
  messageTimeStamp: string;
  feedback: FeedbackState;
}

// Define the initial state
const initialState: InputState = {
  text: "",
  searchEnabled: false,
  searchQuery: "",
  imagePresent: false,
  images: [],
  isProjectSelected: false,
  projectId: "",
  messageTimeStamp: new Date().toISOString(),
  feedback: {
    good: false,
    bad: false,
    message: ""
  }
};

// Create the slice
export const inputSlice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<InputImage>) => {
      state.images.push(action.payload);
      state.imagePresent = true;
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter(img => img.id !== action.payload);
      state.imagePresent = state.images.length > 0;
    },
    clearImages: (state) => {
      state.images = [];
      state.imagePresent = false;
    },
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    toggleSearch: (state) => {
      state.searchEnabled = !state.searchEnabled;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    selectProject: (state, action: PayloadAction<string>) => {
      state.projectId = action.payload;
      state.isProjectSelected = action.payload !== "";
    },
    clearProject: (state) => {
      state.projectId = "";
      state.isProjectSelected = false;
    },
    updateTimestamp: (state) => {
      state.messageTimeStamp = new Date().toISOString();
    },
    setFeedbackGood: (state, action: PayloadAction<boolean>) => {
      state.feedback.good = action.payload;
      // Reset the opposite feedback if this is being set to true
      if (action.payload) {
        state.feedback.bad = false;
      }
    },
    setFeedbackBad: (state, action: PayloadAction<boolean>) => {
      state.feedback.bad = action.payload;
      // Reset the opposite feedback if this is being set to true
      if (action.payload) {
        state.feedback.good = false;
      }
    },
    setFeedbackMessage: (state, action: PayloadAction<string>) => {
      state.feedback.message = action.payload;
    },
    resetFeedback: (state) => {
      state.feedback = {
        good: false,
        bad: false,
        message: ""
      };
    },
    resetState: () => initialState
  }
});

// Export actions
export const {
  setText,
  toggleSearch,
  setSearchQuery,
  addImage,
  removeImage,
  clearImages,
  selectProject,
  clearProject,
  updateTimestamp,
  setFeedbackGood,
  setFeedbackBad,
  setFeedbackMessage,
  resetFeedback,
  resetState
} = inputSlice.actions;

// Export selectors
export const selectInput = (state: RootState) => state.input;
export const selectText = (state: RootState) => state.input.text;
export const selectSearchEnabled = (state: RootState) => state.input.searchEnabled;
export const selectSearchQuery = (state: RootState) => state.input.searchQuery;
export const selectImageFiles = (state: RootState) => state.input.images;
export const selectIsProjectSelected = (state: RootState) => state.input.isProjectSelected;
export const selectProjectId = (state: RootState) => state.input.projectId;
export const selectFeedback = (state: RootState) => state.input.feedback;
export const selectMessageTimeStamp = (state: RootState) => state.input.messageTimeStamp;
export const selectImagePresent = (state: RootState) => state.input.imagePresent;

// Export reducer
export default inputSlice.reducer;