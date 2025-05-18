import express from "express";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/factman/users-controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser); 
router.put("/:id", updateUser);
router.delete("/:id", deleteUser); 
router.put("/block/:id", blockUser);
router.put("/unblock/:id", unblockUser);

export default router;