import { createSlice } from "@reduxjs/toolkit"; // Add this import
export  const commonFeedbackSlice = createSlice({
  name: "commonFeedback",
  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFeedbacks(state, action) {
      state.feedbacks = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});
export default commonFeedbackSlice.reducer;
export const { setFeedbacks, setLoading, setError } = commonFeedbackSlice.actions;