import Setting from "../../models/Setting.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

// Get all settings
export const getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

// Update a specific setting
export const updateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, value } = req.body;

    const updatedSetting = await Setting.findByIdAndUpdate(
      id,
      { key, value },
      { new: true }
    );

    if (!updatedSetting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Setting updated successfully",
      data: updatedSetting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update setting",
    });
  }
};

// Add a new setting
export const addSetting = async (req, res) => {
  try {
    const { key, value } = req.body;

    const newSetting = new Setting({
      key,
      value,
    });

    await newSetting.save();

    res.status(201).json({
      success: true,
      message: "Setting added successfully",
      data: newSetting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add setting",
    });
  }
};

// Delete a specific setting
export const deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSetting = await Setting.findByIdAndDelete(id);

    if (!deletedSetting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Setting deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete setting",
    });
  }
};

// Update admin username
export const updateAdminUsername = async (req, res) => {
  try {
    const { userId, newUsername } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { userName: newUsername },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "Username updated", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update username" });
  }
};

// Update admin password
export const updateAdminPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "Password updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update password" });
  }
};

export default {
  getAllSettings,
  updateSetting,
  addSetting,
  deleteSetting,
  updateAdminUsername,
  updateAdminPassword,
};