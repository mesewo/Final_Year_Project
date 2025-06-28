import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  transactions: [],
  requests: [],
  stats: {},
  loading: false,
  error: null,
};

export const fetchAccountantTransactions = createAsyncThunk(
  "accountant/fetchTransactions",
  async () => {
    const { data } = await axios.get("/api/admin/accountant/transactions");
    return data.data;
  }
);

export const fetchAccountantRequests = createAsyncThunk(
  "accountant/fetchRequests",
  async () => {
    const { data } = await axios.get("/api/admin/accountant/requests");
    return data.data;
  }
);

export const fetchAccountantStats = createAsyncThunk(
  "accountant/fetchStats",
  async () => {
    const { data } = await axios.get("/api/admin/accountant/stats");
    return data.stats;
  }
);

const accountantSlice = createSlice({
  name: "accountant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountantTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccountantTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchAccountantTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAccountantRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccountantRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchAccountantRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAccountantStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default accountantSlice.reducer;