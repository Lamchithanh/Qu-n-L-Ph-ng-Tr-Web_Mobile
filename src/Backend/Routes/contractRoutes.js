import express from "express";
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  terminateContract,
  signContract,
  updateTenantInfo,
  getContractServiceUsages,
} from "../Controllers/contractController.js";
import { authenticateToken } from "../Middleware/Middleware.js";

const router = express.Router();

// Các route không yêu cầu xác thực
router.get("/", getAllContracts);
router.get("/:id", getContractById);
router.get("/:id/service-usages", getContractServiceUsages);

// Các route yêu cầu xác thực
router.post("/", authenticateToken, createContract);
router.put("/:id", authenticateToken, updateContract);
router.delete("/:id", authenticateToken, deleteContract);
router.patch("/:id/terminate", authenticateToken, terminateContract);
router.post("/:id/sign", authenticateToken, signContract); // Thêm route ký hợp đồng
router.put("/:id/tenant-info", authenticateToken, updateTenantInfo); // Thêm route cập nhật thông tin người thuê

export default router;
