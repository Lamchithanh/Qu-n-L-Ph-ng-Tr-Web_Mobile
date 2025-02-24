import { executeQuery } from "../Database/database.js";
import validateContract from "../../Frontend/Validations/contractValidator.js";

// Lấy danh sách hợp đồng
export const getAllContracts = async (req, res) => {
  try {
    const contracts = await executeQuery(
      `SELECT c.*, r.name as room_name, t.full_name as tenant_name 
       FROM contracts c 
       LEFT JOIN rooms r ON c.room_id = r.id 
       LEFT JOIN tenants t ON c.tenant_id = t.id 
       WHERE c.deleted_at IS NULL`,
      []
    );
    res.json(contracts);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hợp đồng",
      error: error.message,
    });
  }
};

// Lấy chi tiết hợp đồng
export const getContractById = async (req, res) => {
  try {
    const [contract] = await executeQuery(
      `SELECT c.*, r.name as room_name, t.full_name as tenant_name,
       r.price as room_price, r.address as room_address
       FROM contracts c 
       LEFT JOIN rooms r ON c.room_id = r.id 
       LEFT JOIN tenants t ON c.tenant_id = t.id 
       WHERE c.id = ? AND c.deleted_at IS NULL`,
      [req.params.id]
    );
    if (!contract)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng" });
    res.json(contract);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy chi tiết hợp đồng", error: error.message });
  }
};

// Tạo hợp đồng mới
export const createContract = async (req, res) => {
  try {
    const { error } = validateContract(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const {
      room_id,
      tenant_id,
      start_date,
      end_date,
      deposit_amount,
      monthly_rent,
      payment_date,
      terms_conditions,
    } = req.body;
    const result = await executeQuery(
      `INSERT INTO contracts (room_id, tenant_id, start_date, end_date, deposit_amount, monthly_rent, payment_date, terms_conditions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        room_id,
        tenant_id,
        start_date,
        end_date,
        deposit_amount,
        monthly_rent,
        payment_date,
        terms_conditions,
      ]
    );
    await executeQuery("UPDATE rooms SET status = 'rented' WHERE id = ?", [
      room_id,
    ]);
    res.status(201).json({
      message: "Tạo hợp đồng thành công",
      contractId: result.insertId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo hợp đồng", error: error.message });
  }
};

// Cập nhật hợp đồng
export const updateContract = async (req, res) => {
  try {
    const { error } = validateContract(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const {
      room_id,
      tenant_id,
      start_date,
      end_date,
      deposit_amount,
      monthly_rent,
      payment_date,
      terms_conditions,
      status,
    } = req.body;
    const result = await executeQuery(
      `UPDATE contracts SET room_id = ?, tenant_id = ?, start_date = ?, end_date = ?, deposit_amount = ?, monthly_rent = ?, payment_date = ?, terms_conditions = ?, status = ?
       WHERE id = ? AND deleted_at IS NULL`,
      [
        room_id,
        tenant_id,
        start_date,
        end_date,
        deposit_amount,
        monthly_rent,
        payment_date,
        terms_conditions,
        status,
        req.params.id,
      ]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng" });
    res.json({ message: "Cập nhật hợp đồng thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật hợp đồng", error: error.message });
  }
};

// Xóa mềm hợp đồng
export const deleteContract = async (req, res) => {
  try {
    const result = await executeQuery(
      "UPDATE contracts SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng" });
    const [contract] = await executeQuery(
      "SELECT room_id FROM contracts WHERE id = ?",
      [req.params.id]
    );
    await executeQuery("UPDATE rooms SET status = 'available' WHERE id = ?", [
      contract.room_id,
    ]);
    res.json({ message: "Xóa hợp đồng thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa hợp đồng", error: error.message });
  }
};

// Kết thúc hợp đồng
export const terminateContract = async (req, res) => {
  try {
    const { termination_reason } = req.body;
    const result = await executeQuery(
      `UPDATE contracts SET status = 'terminated', termination_reason = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND deleted_at IS NULL`,
      [termination_reason, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng" });
    const [contract] = await executeQuery(
      "SELECT room_id FROM contracts WHERE id = ?",
      [req.params.id]
    );
    await executeQuery("UPDATE rooms SET status = 'available' WHERE id = ?", [
      contract.room_id,
    ]);
    res.json({ message: "Kết thúc hợp đồng thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi kết thúc hợp đồng", error: error.message });
  }
};
