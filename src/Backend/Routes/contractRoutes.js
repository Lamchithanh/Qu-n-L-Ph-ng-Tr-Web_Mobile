import express from "express";
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  terminateContract,
} from "../controllers/contractController.js";

const router = express.Router();

router.get("/", getAllContracts);
router.get("/:id", getContractById);
router.post("/", createContract);
router.put("/:id", updateContract);
router.delete("/:id", deleteContract);
router.patch("/:id/terminate", terminateContract);

export default router;
