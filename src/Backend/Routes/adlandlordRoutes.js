import express from "express";
import {
  getAllLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  updateLandlordStatus,
  deleteLandlord,
} from "../Controllers/adLandlordController.js";
import { authenticateToken } from "../Middleware/Middleware.js";

const router = express.Router();

// Routes công khai - không yêu cầu xác thực
router.get("/", getAllLandlords);
router.get("/:id", getLandlordById);

// Routes yêu cầu xác thực
router.post("/create", authenticateToken, createLandlord);
router.put("/update/:id", authenticateToken, updateLandlord);
router.put("/status/:id", authenticateToken, updateLandlordStatus);
router.delete("/delete/:id", authenticateToken, deleteLandlord);

export default router;
