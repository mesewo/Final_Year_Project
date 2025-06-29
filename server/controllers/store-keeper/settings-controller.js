import User from "../../models/User.js";
import bcrypt from "bcryptjs";

// Update username
export const updateStorekeeperUsername = async (req, res) => {
  try {
    const { userId, newUsername } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { userName: newUsername },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Username updated", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update username" });
  }
};

// Update password
export const updateStorekeeperPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Password updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update password" });
  }
};