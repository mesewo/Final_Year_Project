import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateStorekeeperUsername = createAsyncThunk(
  "storekeeperSettings/updateUsername",
  async ({ userId, newUsername }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/storekeeper/settings/update-username", { userId, newUsername });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update username");
    }
  }
);

export const updateStorekeeperPassword = createAsyncThunk(
  "storekeeperSettings/updatePassword",
  async ({ userId, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/storekeeper/settings/update-password", { userId, newPassword });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update password");
    }
  }
);

const storekeeperSettingsSlice = createSlice({
  name: "storekeeperSettings",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateStorekeeperUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStorekeeperUsername.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStorekeeperUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStorekeeperPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStorekeeperPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStorekeeperPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storekeeperSettingsSlice.reducer;