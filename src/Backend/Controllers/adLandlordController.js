import { executeQuery } from "../Database/database.js";

export const getAllLandlords = async (req, res) => {
  try {
    const {
      searchTerm = "",
      status = "all",
      dateRange = "all",
      page = 1,
      limit = 8,
    } = req.query;

    let query = `
      SELECT l.*, u.username, u.email, u.phone, u.full_name, u.avatar, u.status as user_status, u.created_at as user_created_at
      FROM landlords l
      JOIN users u ON l.user_id = u.id
      WHERE u.deleted_at IS NULL
    `;

    const queryParams = [];

    // Lọc theo trạng thái
    if (status && status !== "all") {
      if (status === "active") {
        query += " AND l.status = 'approved'";
      } else if (status === "inactive") {
        query += " AND l.status = 'rejected'";
      } else if (status === "pending") {
        query += " AND l.status = 'pending'";
      }
    }

    // Lọc theo ngày
    if (dateRange && dateRange !== "all") {
      const today = new Date();
      let dateLimit = new Date();

      if (dateRange === "lastMonth") {
        dateLimit.setMonth(today.getMonth() - 1);
        query += " AND l.created_at >= ?";
        queryParams.push(dateLimit.toISOString().split("T")[0]);
      } else if (dateRange === "last3Months") {
        dateLimit.setMonth(today.getMonth() - 3);
        query += " AND l.created_at >= ?";
        queryParams.push(dateLimit.toISOString().split("T")[0]);
      } else if (dateRange === "thisYear") {
        dateLimit = new Date(today.getFullYear(), 0, 1);
        query += " AND l.created_at >= ?";
        queryParams.push(dateLimit.toISOString().split("T")[0]);
      }
    }

    // Tìm kiếm
    if (searchTerm) {
      query += ` AND (
        u.username LIKE ? OR 
        u.email LIKE ? OR 
        u.full_name LIKE ? OR 
        u.phone LIKE ? OR 
        l.id_card_number LIKE ?
      )`;
      const searchPattern = `%${searchTerm}%`;
      queryParams.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern
      );
    }

    // Đếm tổng số kết quả
    const countQuery = query.replace(
      "SELECT l.*, u.username, u.email, u.phone, u.full_name, u.avatar, u.status as user_status, u.created_at as user_created_at",
      "SELECT COUNT(*) as total"
    );
    const totalResult = await executeQuery(countQuery, queryParams);
    const total = totalResult[0].total;

    // Sắp xếp và phân trang kết quả
    query += " ORDER BY l.created_at DESC";
    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    queryParams.push(Number(limit), Number(offset));

    // Lấy danh sách chủ trọ
    const landlords = await executeQuery(query, queryParams);

    // Bổ sung số lượng phòng cho mỗi chủ trọ
    const enrichedLandlords = await Promise.all(
      landlords.map(async (landlord) => {
        const propertyCountQuery = `
          SELECT COUNT(*) as property_count 
          FROM rooms 
          WHERE landlord_id = ? AND deleted_at IS NULL
        `;
        const propertyCountResult = await executeQuery(propertyCountQuery, [
          landlord.id,
        ]);
        return {
          ...landlord,
          property_count: propertyCountResult[0].property_count,
        };
      })
    );

    // Trả về kết quả
    res.status(200).json({
      success: true,
      data: enrichedLandlords,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching landlords:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách chủ trọ",
      error: error.message,
    });
  }
};

export const getLandlordById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT l.*, u.username, u.email, u.phone, u.full_name, u.avatar, u.status as user_status, u.created_at as user_created_at
      FROM landlords l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ? AND u.deleted_at IS NULL
    `;

    const result = await executeQuery(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chủ trọ",
      });
    }

    // Lấy số lượng phòng
    const propertyCountQuery = `
      SELECT COUNT(*) as property_count 
      FROM rooms 
      WHERE landlord_id = ? AND deleted_at IS NULL
    `;
    const propertyCountResult = await executeQuery(propertyCountQuery, [id]);

    const landlord = {
      ...result[0],
      property_count: propertyCountResult[0].property_count,
    };

    res.status(200).json({
      success: true,
      data: landlord,
    });
  } catch (error) {
    console.error(`Error fetching landlord ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin chủ trọ",
      error: error.message,
    });
  }
};

export const createLandlord = async (req, res) => {
  try {
    const landlordData = req.body;

    // Tạo câu truy vấn insert với các field trong landlordData
    const fields = Object.keys(landlordData);
    const placeholders = fields.map(() => "?").join(", ");
    const query = `INSERT INTO landlords (${fields.join(
      ", "
    )}) VALUES (${placeholders})`;

    const values = Object.values(landlordData);
    const result = await executeQuery(query, values);

    const newLandlord = {
      id: result.insertId,
      ...landlordData,
    };

    res.status(201).json({
      success: true,
      message: "Tạo chủ trọ mới thành công",
      data: newLandlord,
    });
  } catch (error) {
    console.error("Error creating landlord:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo chủ trọ mới",
      error: error.message,
    });
  }
};

export const updateLandlord = async (req, res) => {
  try {
    const { id } = req.params;
    const landlordData = req.body;

    // Kiểm tra xem chủ trọ có tồn tại không
    const checkQuery = `
      SELECT id FROM landlords WHERE id = ?
    `;
    const existingLandlord = await executeQuery(checkQuery, [id]);

    if (existingLandlord.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chủ trọ để cập nhật",
      });
    }

    // Xây dựng câu truy vấn SET từ landlordData
    const fields = Object.keys(landlordData);
    const setClauses = fields.map((field) => `${field} = ?`).join(", ");

    const query = `UPDATE landlords SET ${setClauses} WHERE id = ?`;
    const values = [...Object.values(landlordData), id];

    await executeQuery(query, values);

    // Lấy thông tin sau khi cập nhật
    const updatedLandlord = await executeQuery(
      `SELECT * FROM landlords WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật chủ trọ thành công",
      data: updatedLandlord[0],
    });
  } catch (error) {
    console.error(`Error updating landlord ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật chủ trọ",
      error: error.message,
    });
  }
};

export const updateLandlordStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không được để trống",
      });
    }

    // Kiểm tra xem chủ trọ có tồn tại không
    const checkQuery = `SELECT id FROM landlords WHERE id = ?`;
    const existingLandlord = await executeQuery(checkQuery, [id]);

    if (existingLandlord.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chủ trọ để cập nhật trạng thái",
      });
    }

    const query = `UPDATE landlords SET status = ? WHERE id = ?`;
    await executeQuery(query, [status, id]);

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái chủ trọ thành công",
    });
  } catch (error) {
    console.error(`Error updating landlord status ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật trạng thái chủ trọ",
      error: error.message,
    });
  }
};

export const deleteLandlord = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem chủ trọ có tồn tại không
    const checkQuery = `SELECT user_id FROM landlords WHERE id = ?`;
    const landlordRows = await executeQuery(checkQuery, [id]);

    if (landlordRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chủ trọ để xóa",
      });
    }

    const userId = landlordRows[0].user_id;

    // Soft delete user
    await executeQuery(
      "UPDATE users SET deleted_at = NOW(), status = 0 WHERE id = ?",
      [userId]
    );

    // Xóa bản ghi landlord
    await executeQuery("DELETE FROM landlords WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Xóa chủ trọ thành công",
    });
  } catch (error) {
    console.error(`Error deleting landlord ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa chủ trọ",
      error: error.message,
    });
  }
};
