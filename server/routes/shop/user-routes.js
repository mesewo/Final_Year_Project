import { updateProfile, uploadAvatar, changePassword, deactivateAccount, deleteAccount, getMyReviews, getCurrentUser } from "../../controllers/shop/user-controller.js";
import { upload } from "../../helpers/cloudinary.js";
import express from "express";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.put("/profile", authMiddleware, updateProfile);
router.post("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar);
router.post("/change-password", authMiddleware, changePassword);
router.post("/deactivate", authMiddleware, deactivateAccount);
router.delete("/delete", authMiddleware, deleteAccount);
router.get("/my-reviews", authMiddleware, getMyReviews);
router.get("/me", authMiddleware, getCurrentUser);

export default router;