import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  features: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all features
export const fetchFeatures = createAsyncThunk("features/fetchFeatures", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/admin/features/get");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch features");
  }
});

// Async thunk to delete a feature
export const deleteFeature = createAsyncThunk("features/deleteFeature", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/admin/features/delete/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete feature");
  }
});

const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFeature.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.loading = false;
        state.features = state.features.filter((feature) => feature._id !== action.payload);
      })
      .addCase(deleteFeature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default featuresSlice.reducer;