import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateSellerUsername = createAsyncThunk(
  "sellerSettings/updateUsername",
  async ({ userId, newUsername }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/seller/settings/update-username", { userId, newUsername });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update username");
    }
  }
);

export const updateSellerPassword = createAsyncThunk(
  "sellerSettings/updatePassword",
  async ({ userId, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/seller/settings/update-password", { userId, newPassword });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update password");
    }
  }
);

const sellerSettingsSlice = createSlice({
  name: "sellerSettings",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateSellerUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerUsername.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSellerUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSellerPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSellerPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sellerSettingsSlice.reducer;