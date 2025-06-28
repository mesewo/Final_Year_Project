import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const uploadAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/shop/users/avatar", formData, { withCredentials: true });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to upload avatar");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.put("/api/shop/users/profile", payload, { withCredentials: true });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update profile");
    }
  }
);

export const changePassword = createAsyncThunk("user/changePassword", async (payload) => {
  await axios.post("/api/shop/users/change-password", payload, { withCredentials: true });
});
export const deactivateAccount = createAsyncThunk("user/deactivateAccount", async () => {
  await axios.post("/api/shop/users/deactivate", {}, { withCredentials: true });
});
export const deleteAccount = createAsyncThunk("user/deleteAccount", async () => {
  await axios.delete("/api/shop/users/delete", { withCredentials: true });
});
export const fetchMyReviews = createAsyncThunk("user/fetchMyReviews", async () => {
  const res = await axios.get("/api/shop/users/my-reviews", { withCredentials: true });
  return res.data.feedbacks;
});
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/shop/users/me", { withCredentials: true });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch user");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, myReviews: [], avatar: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => { state.loading = true; })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(uploadAvatar.pending, (state) => { state.loading = true; })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMyReviews.pending, (state) => { state.loading = true; })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      });
  },
});
export default userSlice.reducer;