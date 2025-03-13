import express from "express";
import {
  getAllContracts,
  // getContractById,
  createContract,
  updateContract,
  deleteContract,
  terminateContract,
  signContract,
  updateTenantInfo,
  getContractServiceUsages,
  getContractServices,
  getCurrentContract,
  createPayment,
  getContractById,
} from "../Controllers/contractController.js";
import { authenticateToken } from "../Middleware/Middleware.js";
import {
  authorizeRole,
  checkAccountStatus,
  // checkResourceOwnership,
} from "../Middleware/authorizationMiddleware.js";

const router = express.Router();

// Các route không yêu cầu xác thực
router.get("/", getAllContracts);
router.get("/:id", authenticateToken, getContractById);
router.get("/:id/service-usages", getContractServiceUsages);

// Các route yêu cầu xác thực
router.post(
  "/",
  authenticateToken,
  authorizeRole(["admin", "tenant"]),
  createContract
);

router.get("/current", authenticateToken, getCurrentContract);

router.get(
  "/:id/services",
  authenticateToken,
  checkAccountStatus,
  getContractServices
);
router.put("/:id", authenticateToken, updateContract);
router.delete("/:id", authenticateToken, deleteContract);
router.patch("/:id/terminate", authenticateToken, terminateContract);
router.post("/:id/sign", authenticateToken, signContract); // Thêm route ký hợp đồng
router.post(
  "/payments",
  authenticateToken,
  authorizeRole(["tenant"]),
  createPayment
);
router.put("/:id/tenant-info", authenticateToken, updateTenantInfo); // Thêm route cập nhật thông tin người thuê

export default router;
