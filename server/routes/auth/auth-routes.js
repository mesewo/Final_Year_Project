import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyEmailOTP,
  resendOTP,
} from "../../controllers/auth/auth-controller.js";

const router = express.Router();

// Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email-otp", verifyEmailOTP);
router.post("/resend-otp", resendOTP);

// Protected route example using authMiddleware
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

export default router;
