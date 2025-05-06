import Feedback from "../../models/Feedback.js";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define async thunks
export const getAllFeedback = createAsyncThunk(
  "shopFeedback/getAllFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/feedback"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFeedbackDetails = createAsyncThunk(
  "shopFeedback/getFeedbackDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/feedback/${id}`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch feedback details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const shopFeedbackSlice = createSlice({
  name: "shopFeedbackSlice",
  initialState: {
    feedbackList: [],
    feedbackDetails: null,
    isLoading: false,
  },
  reducers: {
    resetFeedbackDetails: (state) => {
      state.feedbackDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeedback.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbackList = action.payload;
      })
      .addCase(getAllFeedback.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getFeedbackDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeedbackDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbackDetails = action.payload;
      })
      .addCase(getFeedbackDetails.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetFeedbackDetails } = shopFeedbackSlice.actions;
export default shopFeedbackSlice.reducer;

// Controller functions
export const getAllFeedbackController = async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .populate("user", "name email")
      .populate("product", "title");

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    res.status(200).json({
      success: true,
      message: "Feedback status updated",
      data: feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};