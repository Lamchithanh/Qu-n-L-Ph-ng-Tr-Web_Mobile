import express from "express";
import multer from "multer";
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
  // Import new controllers
  getNotifications,
  getMaintenanceRequests,
  createMaintenanceRequest,
} from "../Controllers/userController.js";
import { authenticateToken } from "../Middleware/Middleware.js";

const router = express.Router();

// Cấu hình upload file cho maintenance requests
const upload = multer({
  dest: "uploads/maintenance/",
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

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
// Thêm vào đầu file userRoutes.js
router.get(
  "/maintenance-requests",
  (req, res, next) => {
    console.log("GET /maintenance-requests được gọi");
    next();
  },
  authenticateToken,
  getMaintenanceRequests
);

router.post(
  "/maintenance-requests",
  (req, res, next) => {
    console.log("POST /maintenance-requests được gọi");
    next();
  },
  authenticateToken,
  upload.array("images", 5),
  createMaintenanceRequest
);

export default router;
