// src/features/store/storeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch stores
export const fetchStores = createAsyncThunk('store/fetchStores', async () => {
  const response = await axios.get('/api/storekeeper/stores');
  return response.data;
});

// Async thunk to add a new store
export const addStore = createAsyncThunk("store/addStore", async (storeData, thunkAPI) => {
  const res = await axios.post("/api/storekeeper/stores", storeData);
  return res.data.store;
});

export const updateStoreSellers = createAsyncThunk("store/updateSellers", async ({ storeId, assignedSellers }, thunkAPI) => {
  const res = await axios.put(`/api/storekeeper/stores/${storeId}/sellers`, { assignedSellers });
  return res.data.store;
});

// Async thunk to update a store
export const updateStore = createAsyncThunk('store/updateStore', async ({ id, updatedData }) => {
  const response = await axios.put(`/api/storekeeper/stores/${id}`, updatedData);
  return response.data;
});

// Async thunk to delete a store
export const deleteStore = createAsyncThunk('store/deleteStore', async (id) => {
  await axios.delete(`/api/storekeeper/stores/${id}`);
  return id;
});

const StoreKeeperStoreSlice = createSlice({
  name: 'store',
  initialState: {
    stores: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addStore.fulfilled, (state, action) => {
        state.stores.push(action.payload);
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        const index = state.stores.findIndex(store => store._id === action.payload._id);
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.stores = state.stores.filter(store => store._id !== action.payload);
      });
  },
});

export default StoreKeeperStoreSlice.reducer;
