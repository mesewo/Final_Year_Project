import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk: Fetch Factman dashboard statistics and recent orders
export const fetchFactmanDashboardStats = createAsyncThunk(
  "factmanDashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/factman/dashboard-stats");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch dashboard stats";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  stats: {
    totalProducts: 0,
    activeUsers: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
  },
  recentOrders: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "factmanDashboard",
  initialState,
  reducers: {
    // Future reducers can be added here if needed
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFactmanDashboardStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFactmanDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          totalProducts: action.payload?.stats?.totalProducts || 0,
          activeUsers: action.payload?.stats?.activeUsers || 0,
          pendingOrders: action.payload?.stats?.pendingOrders || 0,
          monthlyRevenue: action.payload?.stats?.monthlyRevenue || 0,
        };
        state.recentOrders = action.payload?.recentOrders || [];
      })
      .addCase(fetchFactmanDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unexpected error";
      });
  },
});

export default dashboardSlice.reducer;
