import axios from "axios";
import { CONFIG } from "../Config/config.js";

export const adLandlordService = {
  /**
   * Lấy danh sách chủ trọ từ API Admin
   * @param {Object} params - Tham số lọc và phân trang
   * @returns {Promise<Object>} - Dữ liệu trả về từ API
   */
  getAllLandlords: async (params = {}) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/admin/landlords`, {
        params: params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching landlords:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết chủ trọ theo ID
   * @param {Number} id - ID của chủ trọ
   * @returns {Promise<Object>} - Dữ liệu trả về từ API
   */
  getLandlordById: async (id) => {
    try {
      const response = await axios.get(
        `${CONFIG.API_URL}/admin/landlords/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching landlord details for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo mới chủ trọ
   * @param {Object} landlordData - Dữ liệu chủ trọ cần tạo
   * @returns {Promise<Object>} - Dữ liệu trả về từ API
   */
  createLandlord: async (landlordData) => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/admin/landlords/create`,
        landlordData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating landlord:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin chủ trọ
   * @param {Number} id - ID của chủ trọ
   * @param {Object} landlordData - Dữ liệu cập nhật
   * @returns {Promise<Object>} - Dữ liệu trả về từ API
   */
  updateLandlord: async (id, landlordData) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/admin/landlords/update/${id}`,
        landlordData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating landlord ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật trạng thái chủ trọ
   * @param {Number} id - ID của chủ trọ
   * @param {String} status - Trạng thái mới
   * @returns {Promise<Object>} - Dữ liệu trả về từ API
   */
  updateLandlordStatus: async (id, status) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/admin/landlords/status/${id}`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating landlord status ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa chủ trọ
   * @param {Number} id - ID của chủ trọ
   * @returns {Promise<Object>} - Dữ liệu trả về từ API
   */
  deleteLandlord: async (id) => {
    try {
      const response = await axios.delete(
        `${CONFIG.API_URL}/admin/landlords/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting landlord ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thống kê về chủ trọ dành cho admin
   * @returns {Promise<Object>} - Dữ liệu thống kê
   */
  getAdminLandlordStats: async () => {
    try {
      const response = await axios.get(
        `${CONFIG.API_URL}/admin/landlords/stats`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching landlord statistics:", error);
      throw error;
    }
  },

  /**
   * Phê duyệt nhiều chủ trọ cùng lúc
   * @param {Array<Number>} ids - Danh sách ID chủ trọ cần phê duyệt
   * @returns {Promise<Object>} - Kết quả phê duyệt
   */
  bulkApproveLandlords: async (ids) => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/admin/landlords/bulk-approve`,
        { ids }
      );
      return response.data;
    } catch (error) {
      console.error("Error bulk approving landlords:", error);
      throw error;
    }
  },

  /**
   * Từ chối nhiều chủ trọ cùng lúc
   * @param {Array<Number>} ids - Danh sách ID chủ trọ cần từ chối
   * @param {String} reason - Lý do từ chối
   * @returns {Promise<Object>} - Kết quả từ chối
   */
  bulkRejectLandlords: async (ids, reason) => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/admin/landlords/bulk-reject`,
        { ids, reason }
      );
      return response.data;
    } catch (error) {
      console.error("Error bulk rejecting landlords:", error);
      throw error;
    }
  },
};
