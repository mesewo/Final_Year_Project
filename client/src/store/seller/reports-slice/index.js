import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const generateSellerSalesReport = createAsyncThunk(
  "sellerReports/generateSalesReport",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/seller/reports/sales?startDate=${startDate}&endDate=${endDate}`,
        { withCredentials: true }
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch sales report");
    }
  }
);

const initialState = {
  salesReport: [],
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "sellerReports",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(generateSellerSalesReport.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSellerSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReport = action.payload || [];
      })
      .addCase(generateSellerSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unexpected error";
      });
  },
});

export default reportsSlice.reducer;