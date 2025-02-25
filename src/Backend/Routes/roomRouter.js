// src/Routes/roomRouter.js
import express from "express";
import {
  getAllRooms,
  getRoomById,
  toggleFavorite,
  createRoom,
  updateRoom,
  deleteRoom,
  // getAvailableRooms,
  // getRoomsByFloor,
  // getRoomsByPriceRange,
  getRoomsByFilters,
  // updateRoomStatus,
} from "../Controllers/roomController.js";
import { authenticateToken } from "../Middleware/Middleware.js";

const router = express.Router();

// Lưu ý: Đã bỏ tiền tố /rooms vì đã được định nghĩa trong app.js
router.get("/", getAllRooms);
// router.get("/available", getAvailableRooms);
// router.get("/floor/:floor", getRoomsByFloor);
// router.get("/price-range", getRoomsByPriceRange);
router.get("/filter", getRoomsByFilters);
router.get("/:id", getRoomById);

// Routes cần xác thực
router.post("/create", authenticateToken, createRoom);
router.put("/update/:id", authenticateToken, updateRoom);
// router.put("/status/:id", authenticateToken, updateRoomStatus);
router.delete("/delete/:id", authenticateToken, deleteRoom);
router.post("/:id/toggle-favorite", authenticateToken, toggleFavorite);

export default router;
