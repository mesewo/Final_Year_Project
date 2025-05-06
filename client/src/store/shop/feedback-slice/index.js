import { createSlice } from "@reduxjs/toolkit"; // Add this import
import { getAllFeedback, getFeedbackDetails } from "../../../../../server/controllers/admin/feedback-controller"; // Adjust the import path as necessary
export const shopFeedbackSlice  = createSlice({
  name: "shopFeedbackSlice ",
  initialState: {
    feedbackList: [],
    feedbackDetails: null,
    isLoading: false,
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
      })
      .addCase(getAllFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbackList = action.payload;
      })
      .addCase(getAllFeedback.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getFeedbackDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeedbackDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbackDetails = action.payload;
      })
      .addCase(getFeedbackDetails.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const { resetFeedbackDetails } = shopFeedbackSlice.actions;
export default shopFeedbackSlice.reducer;