import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch feedback
export const fetchFeedbacks = createAsyncThunk(
  "feedback/fetchFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/factman/feedback");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch feedback");
    }
  }
);

// Async thunk to update feedback status (approve/reject)
export const updateFeedbackStatus = createAsyncThunk(
  "feedback/updateFeedbackStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/factman/feedback/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update feedback status");
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        // Update the feedback in the list
        const updated = action.payload;
        state.feedbacks = state.feedbacks.map((fb) =>
          fb._id === updated._id ? updated : fb
        );
      });
  },
});

export default feedbackSlice.reducer;