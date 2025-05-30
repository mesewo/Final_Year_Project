import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Example async thunk for fetching summary
 const getFinancialSummary = createAsyncThunk(
  "accountantFinance/getFinancialSummary",
  async (_, thunkAPI) => {
    // Replace with your API call
    const response = await fetch("/api/accountant/financial-summary");
    if (!response.ok) throw new Error("Failed to fetch summary");
    return await response.json();
  }
);

export const accountantFinanceSlice = createSlice({
  name: "accountantFinance",
  initialState: {
    transactions: [],
    loading: false,
    error: null,
    summary: null, // Add summary if needed
  },
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFinancialSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFinancialSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getFinancialSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default accountantFinanceSlice.reducer;
export const { setTransactions, setLoading, setError } = accountantFinanceSlice.actions;
export { getFinancialSummary };