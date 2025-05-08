import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch seller dashboard stats
export const fetchSellerDashboardStats = createAsyncThunk(
  "sellerDashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/seller/dashboard-stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch stats");
    }
  }
);

const dashboardSlice = createSlice({
  name: "sellerDashboard",
  initialState: {
    stats: null,
    recentOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentOrders = action.payload.recentOrders;
      })
      .addCase(fetchSellerDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;