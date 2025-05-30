import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Example async thunk to fetch transactions (replace with your API)
export const fetchTransactions = createAsyncThunk(
  "accountantTransactions/fetchTransactions",
  async () => {
    // Replace with your real API call
    const response = await fetch("/api/accountant/transactions");
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return await response.json();
  }
);

const transactionSlice = createSlice({
  name: "accountantTransactions",
  initialState: {
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default transactionSlice.reducer;