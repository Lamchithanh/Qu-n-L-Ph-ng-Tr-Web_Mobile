// src/services/roomService.js
import axios from "axios";
import { CONFIG } from "../config/config";

const roomService = {
  // Lấy danh sách tất cả phòng
  getRooms: async () => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/rooms`);
      return response.data;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },

  // Lọc phòng theo các tiêu chí
  getRoomsByFilters: async (filters) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/rooms/filter`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error searching rooms:", error);
      throw error;
    }
  },

  // Lấy chi tiết phòng theo ID
  getRoomById: async (roomId) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching room details:", error);
      throw error;
    }
  },

  toggleFavorite: async (roomId) => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/rooms/${roomId}/toggle-favorite`
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  },

  // Tạo phòng mới (chỉ dành cho admin/staff)
  createRoom: async (roomData) => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/rooms/create`,
        roomData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  // Cập nhật thông tin phòng
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/rooms/update/${roomId}`,
        roomData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  },

  // Xóa phòng (soft delete)
  deleteRoom: async (roomId) => {
    try {
      const response = await axios.delete(
        `${CONFIG.API_URL}/rooms/delete/${roomId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  },

  // Lấy các phòng trống
  getAvailableRooms: async () => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/rooms/available`);
      return response.data;
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      throw error;
    }
  },

  // Lấy phòng theo tầng
  getRoomsByFloor: async (floor) => {
    try {
      const response = await axios.get(
        `${CONFIG.API_URL}/rooms/floor/${floor}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching rooms by floor:", error);
      throw error;
    }
  },
};

export default roomService;
