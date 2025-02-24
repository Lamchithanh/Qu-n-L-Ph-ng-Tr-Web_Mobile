// src/Backend/Routes/userRoutes.js
import express from "express";
import {
  createUser,
  loginUser,
  getUserProfile,
  updateUser,
  changePassword,
  deleteUser,
  checkUser,
  registerFromContract,
} from "../Controllers/userController.js";
import { authenticateToken } from "../Middleware/Middleware.js";

const router = express.Router();
// Routes không cần xác thực
router.post("/check-user", checkUser);
router.post("/registerFromContract", registerFromContract);
router.post("/register", createUser);
router.post("/login", loginUser);

// Routes cần xác thực
router.get("/profile", authenticateToken, getUserProfile);

router.put("/profile-updateUser", authenticateToken, updateUser);
router.put("/change-password", authenticateToken, changePassword);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
