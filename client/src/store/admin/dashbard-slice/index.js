import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk: Fetch admin dashboard statistics and recent orders
export const fetchAdminDashboardStats = createAsyncThunk(
  "adminDashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/admin/dashboard-stats");
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
  name: "adminDashboard",
  initialState,
  reducers: {
    // Future reducers can be added here if needed
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminDashboardStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          totalProducts: action.payload?.stats?.totalProducts || 0,
          activeUsers: action.payload?.stats?.activeUsers || 0,
          pendingOrders: action.payload?.stats?.pendingOrders || 0,
          monthlyRevenue: action.payload?.stats?.monthlyRevenue || 0,
        };
        state.recentOrders = action.payload?.recentOrders || [];
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unexpected error";
      });
  },
});

export default dashboardSlice.reducer;
