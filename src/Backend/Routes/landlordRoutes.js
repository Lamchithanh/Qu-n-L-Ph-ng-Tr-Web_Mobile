import express from "express";
import {
  registerLandlord,
  getLandlordRegistrations,
  approveLandlord,
  rejectLandlord,
  getLandlordProfile,
} from "../Controllers/landlordController.js";

import { authenticateToken, isAdmin } from "../Middleware/Middleware.js";

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/landlord/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error("Chỉ cho phép các file ảnh và PDF"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

const router = express.Router();
// Route đăng ký chủ trọ (public)
router.post(
  "/register-landlord",
  upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "propertyDocuments", maxCount: 5 },
  ]),
  registerLandlord
);

// Route lấy thông tin đăng ký chủ trọ (chỉ admin)
router.get(
  "/registrations",
  authenticateToken,
  isAdmin,
  getLandlordRegistrations
);

// Route phê duyệt chủ trọ (chỉ admin)
router.put("/approve/:id", authenticateToken, isAdmin, approveLandlord);

// Route từ chối chủ trọ (chỉ admin)
router.put("/reject/:id", authenticateToken, isAdmin, rejectLandlord);

// Route lấy profile chủ trọ (chỉ dành cho chủ trọ đã đăng nhập)
router.get("/profile", authenticateToken, getLandlordProfile);

export default router;
