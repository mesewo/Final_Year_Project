import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  salesReport: null,
  inventoryReport: null,
  loading: false,
  error: null
};

export const generateSalesReport = createAsyncThunk(
  "accountant/generateSalesReport",
  async (reportParams, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/accountant/reports/sales", reportParams);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const generateInventoryReport = createAsyncThunk(
  "accountant/generateInventoryReport",
  async (threshold = 5, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/accountant/reports/inventory?threshold=${threshold}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const accountantReportsSlice = createSlice({
  name: "accountantReports",
  initialState,
  reducers: {
    clearReports: (state) => {
      state.salesReport = null;
      state.inventoryReport = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateSalesReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReport = action.payload;
      })
      .addCase(generateInventoryReport.fulfilled, (state, action) => {
        state.inventoryReport = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export const { clearReports } = accountantReportsSlice.actions;
export default accountantReportsSlice.reducer;