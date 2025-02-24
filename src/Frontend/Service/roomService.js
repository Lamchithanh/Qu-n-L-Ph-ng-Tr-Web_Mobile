// src/services/roomService.js
import axios from "axios";
import { CONFIG } from "../config/config";

const roomService = {
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
};

export default roomService;
