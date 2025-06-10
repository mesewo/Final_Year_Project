import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

// Register
export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      lastLogin: new Date(),
      role: req.body.role || "buyer",
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
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
    const decoded = jwt.verify(
      token,
      "70a642ec31b78e62ad6cffabc0f42e3d44d9c59758f07730bb2a7a6e527882df59c5a014df3cb94f662ff4b573231db81a3217a50d448cf02aa39ba56f78d56b"
    );

    // console.log("Decoded JWT:", decoded);
    // console.log("Decoded JWT in storekeeperAuthMiddleware:", decoded);
    
    if (decoded.role !== "store_keeper") {
      // console.log("Decoded JWT:", decoded);
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


// ... (existing code)

// Generate token specifically for Socket.io
// export const generateSocketToken = (user) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       role: user.role,
//       email: user.email
//     },
//     "70a642ec31b78e62ad6cffabc0f42e3d44d9c59758f07730bb2a7a6e527882df59c5a014df3cb94f662ff4b573231db81a3217a50d448cf02aa39ba56f78d56b",
//     { expiresIn: "1h" }
//   );
// };

// // New endpoint for Socket.io auth
// router.get("/socket-token", authMiddleware, (req, res) => {
//   const socketToken = generateSocketToken(req.user);
//   res.json({ success: true, token: socketToken });
// });
