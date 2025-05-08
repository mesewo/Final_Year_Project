import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  settings: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all settings
export const fetchSettings = createAsyncThunk("settings/fetchSettings", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/admin/settings");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch settings");
  }
});

// Async thunk to add a new setting
export const addSetting = createAsyncThunk("settings/addSetting", async (newSetting, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/admin/settings/add", newSetting);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to add setting");
  }
});

// Async thunk to update a setting
export const updateSetting = createAsyncThunk("settings/updateSetting", async ({ id, key, value }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/admin/settings/update/${id}`, { key, value });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to update setting");
  }
});

// Async thunk to delete a setting
export const deleteSetting = createAsyncThunk("settings/deleteSetting", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/admin/settings/delete/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete setting");
  }
});

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSetting.fulfilled, (state, action) => {
        state.settings.push(action.payload);
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        const index = state.settings.findIndex((setting) => setting._id === action.payload._id);
        if (index !== -1) {
          state.settings[index] = action.payload;
        }
      })
      .addCase(deleteSetting.fulfilled, (state, action) => {
        state.settings = state.settings.filter((setting) => setting._id !== action.payload);
      });
  },
});

export default settingsSlice.reducer;