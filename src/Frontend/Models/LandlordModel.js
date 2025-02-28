import { executeQuery } from "../../Backend/Database/database.js";

export const LandlordModel = {
  /**
   * Lấy danh sách chủ trọ với bộ lọc và phân trang
   * @param {Object} params - Các tham số lọc và phân trang
   * @returns {Promise<Array>} - Danh sách chủ trọ
   */
  async getAllLandlords(params = {}) {
    const {
      searchTerm = "",
      status = "all",
      dateRange = "all",
      page = 1,
      limit = 8,
    } = params;

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

    // Sắp xếp
    query += " ORDER BY l.created_at DESC";

    // Phân trang
    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    queryParams.push(Number(limit), Number(offset));

    return await executeQuery(query, queryParams);
  },

  /**
   * Đếm tổng số chủ trọ theo bộ lọc
   * @param {Object} params - Các tham số lọc
   * @returns {Promise<Number>} - Tổng số chủ trọ
   */
  async countLandlords(params = {}) {
    const { searchTerm = "", status = "all", dateRange = "all" } = params;

    let query = `
      SELECT COUNT(*) as total
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

    const result = await executeQuery(query, queryParams);
    return result[0].total;
  },

  /**
   * Lấy thông tin chi tiết chủ trọ theo ID
   * @param {Number} id - ID của chủ trọ
   * @returns {Promise<Object>} - Thông tin chủ trọ
   */
  async getLandlordById(id) {
    const query = `
      SELECT l.*, u.username, u.email, u.phone, u.full_name, u.avatar, u.status as user_status, u.created_at as user_created_at
      FROM landlords l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ? AND u.deleted_at IS NULL
    `;

    const result = await executeQuery(query, [id]);
    return result[0] || null;
  },

  /**
   * Lấy số lượng phòng trọ của chủ trọ
   * @param {Number} landlordId - ID của chủ trọ
   * @returns {Promise<Number>} - Số lượng phòng trọ
   */
  async getPropertyCountByLandlordId(landlordId) {
    const query = `
      SELECT COUNT(*) as property_count 
      FROM rooms 
      WHERE landlord_id = ? AND deleted_at IS NULL
    `;

    const result = await executeQuery(query, [landlordId]);
    return result[0].property_count;
  },

  /**
   * Thêm mới chủ trọ
   * @param {Object} landlordData - Dữ liệu chủ trọ
   * @returns {Promise<Object>} - Thông tin chủ trọ mới
   */
  async createLandlord(landlordData) {
    // Tạo câu truy vấn insert với các field trong landlordData
    const fields = Object.keys(landlordData);
    const placeholders = fields.map(() => "?").join(", ");
    const query = `INSERT INTO landlords (${fields.join(
      ", "
    )}) VALUES (${placeholders})`;

    const values = Object.values(landlordData);
    const result = await executeQuery(query, values);

    return {
      id: result.insertId,
      ...landlordData,
    };
  },

  /**
   * Cập nhật thông tin chủ trọ
   * @param {Number} id - ID của chủ trọ
   * @param {Object} landlordData - Dữ liệu cập nhật
   * @returns {Promise<Boolean>} - Kết quả cập nhật
   */
  async updateLandlord(id, landlordData) {
    // Xây dựng câu truy vấn SET từ landlordData
    const fields = Object.keys(landlordData);
    const setClauses = fields.map((field) => `${field} = ?`).join(", ");

    const query = `UPDATE landlords SET ${setClauses} WHERE id = ?`;
    const values = [...Object.values(landlordData), id];

    const result = await executeQuery(query, values);
    return result.affectedRows > 0;
  },

  /**
   * Cập nhật trạng thái chủ trọ
   * @param {Number} id - ID của chủ trọ
   * @param {String} status - Trạng thái mới
   * @returns {Promise<Boolean>} - Kết quả cập nhật
   */
  async updateLandlordStatus(id, status) {
    const query = `UPDATE landlords SET status = ? WHERE id = ?`;
    const result = await executeQuery(query, [status, id]);

    return result.affectedRows > 0;
  },

  /**
   * Xóa chủ trọ (soft delete)
   * @param {Number} id - ID của chủ trọ
   * @returns {Promise<Boolean>} - Kết quả xóa
   */
  async deleteLandlord(id) {
    try {
      // Lấy user_id từ bảng landlords
      const getLandlordQuery = "SELECT user_id FROM landlords WHERE id = ?";
      const landlordRows = await executeQuery(getLandlordQuery, [id]);

      if (landlordRows.length === 0) {
        return false;
      }

      const userId = landlordRows[0].user_id;

      // Soft delete user
      const updateUserQuery =
        "UPDATE users SET deleted_at = NOW(), status = 0 WHERE id = ?";
      await executeQuery(updateUserQuery, [userId]);

      // Xóa bản ghi landlord
      const deleteLandlordQuery = "DELETE FROM landlords WHERE id = ?";
      const result = await executeQuery(deleteLandlordQuery, [id]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Lỗi khi xóa chủ trọ:", error);
      throw error;
    }
  },
};
