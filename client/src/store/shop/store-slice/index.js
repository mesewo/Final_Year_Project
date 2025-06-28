import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllStores = createAsyncThunk(
  "stores/fetchAll",
  async () => {
    const res = await axios.get("/api/shop/stores");
    return res.data.stores;
  }
);

export const fetchStoreById = createAsyncThunk(
  "store/fetchById",
  async (storeId) => {
    const res = await axios.get(`/api/shop/stores/${storeId}`);
    return res.data.store;
  }
);

const storesSlice = createSlice({
  name: "stores",
  initialState: { stores: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStores.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllStores.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stores = action.payload;
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchStoreById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.storeInfo = action.payload;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default storesSlice.reducer;