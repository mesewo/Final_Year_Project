import User from "../../models/User.js";
import { imageUploadUtil } from "../../helpers/cloudinary.js";
import bcrypt from "bcryptjs";
import Feedback from "../../models/Feedback.js";

// Update profile info (username, phone, etc.)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName, profile } = req.body;
    const update = {};
    if (userName) update.userName = userName;
    if (profile) update.profile = profile;
    await User.findByIdAndUpdate(userId, update);
    // Fetch the full, up-to-date user object (including avatar)
    const user = await User.findById(userId);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const result = await imageUploadUtil(req.file.buffer);
    await User.findByIdAndUpdate(userId, { "profile.avatar": result.secure_url });
    // Fetch the full, up-to-date user object (including avatar)
    const user = await User.findById(userId);
    res.json({ success: true, avatar: result.secure_url, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Avatar upload failed" });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId).select("+password");
    if (!user || !await bcrypt.compare(oldPassword, user.password)) {
      return res.status(400).json({ success: false, message: "Old password incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Password change failed" });
  }
};

// Deactivate/Delete account
export const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { isBlocked: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Account deactivation failed" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Account deletion failed" });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const feedbacks = await Feedback.find({ user: userId }).populate("product", "title image");
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

