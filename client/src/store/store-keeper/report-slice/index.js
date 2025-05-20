import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const fetchSalesTrend = createAsyncThunk(
//   "storeKeeperReports/fetchSalesTrend",
//   async ({ start, end }) => {
//     const res = await axios.get("/api/storekeeper/reports/sales-trend", {
//       params: {
//         start: start.toISOString(),
//         end: end.toISOString()
//       }
//     });
//     return res.data;
//   }
// );

export const fetchInventoryReport = createAsyncThunk(
  "storeKeeperReports/fetchInventoryReport",
  async () => {
    const res = await axios.get("/api/storekeeper/reports/inventory");
    return res.data;
  }
);




const storeKeeperReportSlice = createSlice({
  name: "storeKeeperReports",
  initialState: {
    salesTrend: [],
    inventory: [],
    loading: false,
    error: null,
    
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // .addCase(fetchSalesTrend.pending, state => { state.loading = true; })
      // .addCase(fetchSalesTrend.fulfilled, (state, action) => {
      //   state.salesTrend = action.payload;
      //   state.loading = false;
      // })
      // .addCase(fetchSalesTrend.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // })
      .addCase(fetchInventoryReport.pending, state => { 
        state.loading = true; })
      .addCase(fetchInventoryReport.fulfilled, (state, action) => {
        console.log("Inventory API response:", action.payload); 
        state.inventory = action.payload;
        state.loading = false;
      })
      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default storeKeeperReportSlice.reducer;