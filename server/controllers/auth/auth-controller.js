import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../../models/User.js";

const tempUsers = {}; // In-memory store for temporary users awaiting email verification

// Register
export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Check if user already exists in main User collection
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again",
      });
    }

    // Check if already pending verification
    if (tempUsers[email]) {
      return res.status(200).json({
        success: true,
        message: "Please verify your email with the OTP sent.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store in temp
    tempUsers[email] = {
      userName,
      email,
      password: hashPassword,
      otp,
      otpExpire,
    };

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE|| 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      subject: "Verify your email",
      html: `<p>Your OTP for email verification is: <b>${otp}</b></p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Please verify your email with the OTP sent.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    if (checkUser.isBlocked) {
      return res.json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
        isBlocked: true,
      });
    }

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    checkUser.lastLogin = new Date();
    await checkUser.save();

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "70a642ec31b78e62ad6cffabc0f42e3d44d9c59758f07730bb2a7a6e527882df59c5a014df3cb94f662ff4b573231db81a3217a50d448cf02aa39ba56f78d56b",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" }).json({
      success: true,
      message: "Logged in successfully",
      
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
        lastLogin: checkUser.lastLogin,
      },
    });
    
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    // console.log("Google login payload:", req.body);
// Validate required fields
    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: "Missing required Google account information.",
      });
    }

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      const safeName = typeof name === "string" && name.trim() ? name : "GoogleUser";
      const generatedUsername =
        safeName.replace(/\s+/g, '').toLowerCase() +
        Math.floor(1000 + Math.random() * 9000);

      // Use a hardcoded bcrypt hash for "googleuserpassword"
      const hardcodedHash = "$2a$12$wH6QwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwq";

      console.log("Creating user with:", {
        userName: generatedUsername,
        email,
        password: hardcodedHash,
        googleId,
      });

      user = new User({
        userName: generatedUsername,
        email,
        password: hardcodedHash,
        googleId,
        isEmailVerified: true,
        lastLogin: new Date(),
        profile: {
          firstName: safeName.split(' ')[0]
        ||"Google",
          lastName: safeName.split(' ')[1] ||"User",
        },
        role: "buyer",
      });
      console.log("User object before save:", user);
      await user.save();
    } else if (user.isBlocked) {
      return res.json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
        isBlocked: true,
      });
    } else {
      user.lastLogin = new Date();
      if (!user.googleId) {
        user.googleId = googleId;
      }
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      "70a642ec31b78e62ad6cffabc0f42e3d44d9c59758f07730bb2a7a6e527882df59c5a014df3cb94f662ff4b573231db81a3217a50d448cf02aa39ba56f78d56b",
      { expiresIn: "60m" }
    );

    res
      .cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })
      .json({
        success: true,
        message: "Logged in successfully with Google",
        user: {
          email: user.email,
          role: user.role,
          id: user._id,
          userName: user.userName,
          lastLogin: user.lastLogin,
        },
      });
  } catch (e) {
    console.error("Google login error:", e);
    res.status(500).json({
      success: false,
      message: "Google login error",
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return res.json({
        success: true,
        message: "If this email exists in our system, a password reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // Create reset URL
    const resetUrl = `${req.headers.origin  ||'http://localhost:5173'}/auth/reset-password/${resetToken}`;
// Create email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE  ||'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_FROM  ||process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You are receiving this email because you (or someone else) has requested to reset the password for your account.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Reset Password</a>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>This password reset link is valid for 30 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #777;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
          <p style="font-size: 0.9em; color: #777; word-break: break-all;">${resetUrl}</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "If this email exists in our system, a password reset link has been sent",
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: "Error sending password reset email. Please try again later.",
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!token ||!password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired",
      });
    }

    // Set new password
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE  ||'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      subject: 'Password Changed Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Password Updated</h2>
          <p>Your password has been successfully changed.</p>
          <p>If you did not make this change, please contact our support team immediately.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Password updated successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: "Error resetting password. Please try again.",
    });
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Auth middleware
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, "70a642ec31b78e62ad6cffabc0f42e3d44d9c59758f07730bb2a7a6e527882df59c5a014df3cb94f662ff4b573231db81a3217a50d448cf02aa39ba56f78d56b");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

export const sellerAuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, "70a642ec31b78e62ad6cffabc0f42e3d44d9c59758f07730bb2a7a6e527882df59c5a014df3cb94f662ff4b573231db81a3217a50d448cf02aa39ba56f78d56b");

    // 👇 Check if user is a seller
    if (decoded.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller access only.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

export const buyerAuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      "70a642ec31b78e62ad6cffabc0f42e3d44d9c59758f07730bb2a7a6e527882df59c5a014df3cb94f662ff4b573231db81a3217a50d448cf02aa39ba56f78d56b"
    );

    if (decoded.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Buyer access only.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

export const buyerOrSellerAuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, "70a642ec31b78e62ad6cffabc0f42e3d44d9c59758f07730bb2a7a6e527882df59c5a014df3cb94f662ff4b573231db81a3217a50d448cf02aa39ba56f78d56b");
    if (decoded.role !== "buyer" && decoded.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Buyer or Seller access only.",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

export const storekeeperAuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded =jwt.verify(
      token,
      "70a642ec31b78e62ad6cffabc0f42e3d44d9c59758f07730bb2a7a6e527882df59c5a014df3cb94f662ff4b573231db81a3217a50d448cf02aa39ba56f78d56b"
    );
    
    if (decoded.role !== "store_keeper") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Store Keeper access only.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

export const verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const tempUser = tempUsers[email];
    if (!tempUser) {
      return res.status(400).json({ success: false, message: "No registration in progress for this email." });
    }

    // Debug log
    console.log("Verifying OTP:", { received: otp, expected: tempUser.otp, expires: tempUser.otpExpire, now: Date.now() });

    if (tempUser.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    if (String(tempUser.otp) !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Create user in main collection
    const newUser = new User({
      userName: tempUser.userName,
      email: tempUser.email,
      password: tempUser.password,
      isEmailVerified: true,
      lastLogin: new Date(),
      role: "buyer",
    });
    await newUser.save();

    // Remove from temp
    delete tempUsers[email];

    res.json({ success: true, message: "Email verified and account created successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    // Look in tempUsers, not the database
    const tempUser = tempUsers[email];
    if (!tempUser) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "No registration in progress for this email. Please register again.",
        });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;
    tempUser.otp = otp;
    tempUser.otpExpire = otpExpire;

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      subject: "Verify your email",
      html: `<p>Your OTP for email verification is: <b>${otp}</b></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP resent to your email." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Could not resend OTP" });
  }
};