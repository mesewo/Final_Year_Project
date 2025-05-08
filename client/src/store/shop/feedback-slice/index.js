import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all feedback
export const getAllFeedback = createAsyncThunk(
  "shopFeedback/getAllFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/feedback");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch feedback");
    }
  }
);

// Async thunk to fetch feedback details
export const getFeedbackDetails = createAsyncThunk(
  "shopFeedback/getFeedbackDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/feedback/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch feedback details");
    }
  }
);

export const shopFeedbackSlice = createSlice({
  name: "shopFeedback",
  initialState: {
    feedbackList: [],
    feedbackDetails: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetFeedbackDetails: (state) => {
      state.feedbackDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbackList = action.payload;
      })
      .addCase(getAllFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getFeedbackDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedbackDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbackDetails = action.payload;
      })
      .addCase(getFeedbackDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetFeedbackDetails } = shopFeedbackSlice.actions;
export default shopFeedbackSlice.reducer;