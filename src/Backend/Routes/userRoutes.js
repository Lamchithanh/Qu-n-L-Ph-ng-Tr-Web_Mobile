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
  forgotPassword,
  verifyResetCode,
  resetPassword,
  resendResetCode,
  getNotifications,
  getMaintenanceRequests,
  createMaintenanceRequest,
  updateAvatar,
} from "../Controllers/userController.js";
import { authenticateToken } from "../Middleware/Middleware.js";
import uploadMaintenance from "../Middleware/uploadMaintenanceMiddleware.js"; // Tạo middleware riêng cho maintenance
import uploadAvatar from "../Middleware/uploadMiddleware.js"; // Sử dụng middleware upload avatar

const router = express.Router();

// Routes không cần xác thực
router.post("/check-user", checkUser);
router.post("/registerFromContract", registerFromContract);
router.post("/register", createUser);
router.post("/login", loginUser);

// Routes quên mật khẩu
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.post("/resend-reset-code", resendResetCode);

// Routes cần xác thực
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile-updateUser", authenticateToken, updateUser);
router.put("/change-password", authenticateToken, changePassword);
router.delete("/:id", authenticateToken, deleteUser);

// Routes cho notifications và maintenance requests
router.get("/notifications", authenticateToken, getNotifications);

router.get("/maintenance-requests", authenticateToken, getMaintenanceRequests);

router.post(
  "/maintenance-requests",
  authenticateToken,
  uploadMaintenance.array("images", 5), // Sử dụng middleware upload riêng
  createMaintenanceRequest
);

router.post(
  "/upload-avatar",
  authenticateToken,
  uploadAvatar.single("avatar"), // Sử dụng middleware upload avatar
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không có file được tải lên" });
      }

      // Tạo URL avatar tương đối
      const avatarUrl = `/uploads/avatar/${req.file.filename}`;

      // Gọi hàm cập nhật avatar từ controller
      await updateAvatar(req, res, avatarUrl);
    } catch (error) {
      console.error("Lỗi upload avatar:", error);
      res.status(500).json({
        message: "Lỗi tải lên avatar",
        error: error.message,
      });
    }
  }
);

export default router;
