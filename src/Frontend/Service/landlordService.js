import axios from "axios";
import { CONFIG } from "../Config/config.js";

const landlordService = {
  // Lấy danh sách chủ trọ với bộ lọc
  getAllLandlords: async (params = {}) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/landlords`, {
        params: params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching landlords:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết của một chủ trọ theo ID
  getLandlordById: async (id) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/landlords/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching landlord details for ID ${id}:`, error);
      throw error;
    }
  },

  // Tạo mới chủ trọ
  createLandlord: async (landlordData) => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/landlords/create`,
        landlordData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating landlord:", error);
      throw error;
    }
  },

  // Cập nhật thông tin chủ trọ
  updateLandlord: async (id, landlordData) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/landlords/update/${id}`,
        landlordData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating landlord ID ${id}:`, error);
      throw error;
    }
  },

  // Cập nhật trạng thái chủ trọ
  updateLandlordStatus: async (id, status) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/landlords/status/${id}`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating landlord status ID ${id}:`, error);
      throw error;
    }
  },

  // Xóa chủ trọ
  deleteLandlord: async (id) => {
    try {
      const response = await axios.delete(
        `${CONFIG.API_URL}/landlords/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting landlord ID ${id}:`, error);
      throw error;
    }
  },

  // Lấy danh sách chủ trọ đang chờ phê duyệt
  getPendingLandlords: async () => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/landlords`, {
        params: { status: "pending" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching pending landlords:", error);
      throw error;
    }
  },

  // Lấy danh sách chủ trọ đã được chấp thuận
  getApprovedLandlords: async () => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/landlords`, {
        params: { status: "active" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching approved landlords:", error);
      throw error;
    }
  },

  // Lấy thống kê về chủ trọ
  getLandlordStats: async () => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/landlords/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching landlord statistics:", error);
      throw error;
    }
  },
};

export default landlordService;
