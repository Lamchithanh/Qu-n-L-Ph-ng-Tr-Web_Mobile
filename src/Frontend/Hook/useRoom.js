import { useState, useEffect } from "react";
import axios from "axios";
import { CONFIG } from "../config/config";

export const useRoom = (roomId) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`${CONFIG.API_URL}/rooms/${roomId}`);
        if (response.data.success) {
          setRoom(response.data.data);
          // Increment view count
          await axios.post(`${CONFIG.API_URL}/rooms/${roomId}/views`);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const toggleFavorite = async () => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/rooms/${roomId}/favorite`
      );
      return response.data;
    } catch (err) {
      console.error("Error toggling favorite:", err);
      throw err;
    }
  };

  return { room, loading, error, toggleFavorite };
};
