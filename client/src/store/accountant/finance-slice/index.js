import { createSlice } from "@reduxjs/toolkit"; // Add this import
export const accountantFinanceSlice = createSlice({
  name: "accountantFinance",
  initialState: {
    transactions: [],
    loading: false,
    error: null,
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
});
export default accountantFinanceSlice.reducer;
export const { setTransactions, setLoading, setError } = accountantFinanceSlice.actions;