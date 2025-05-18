import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userActivity: [],
  salesTrend: [],
  loading: false,
  error: null,
};

// Async thunk to fetch user activity report
export const generateUserActivityReport = createAsyncThunk(
  "factmanReports/generateUserActivityReport",
  async ({ days }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/factman/reports/user-activity?days=${days}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user activity report");
    }
  }
);

// Async thunk to fetch sales trend report
export const generateSalesTrendReport = createAsyncThunk(
  "factmanReports/generateSalesTrendReport",
  async ({ days }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/factman/reports/sales-trend?days=${days}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch sales trend report");
    }
  }
);

const reportsSlice = createSlice({
  name: "factmanReports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateUserActivityReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateUserActivityReport.fulfilled, (state, action) => {
        state.loading = false;
        state.userActivity = action.payload;
      })
      .addCase(generateUserActivityReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateSalesTrendReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSalesTrendReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTrend = action.payload;
      })
      .addCase(generateSalesTrendReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportsSlice.reducer;