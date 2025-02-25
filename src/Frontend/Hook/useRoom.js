import { useState, useEffect } from "react";
import roomService from "../Service/roomService.js";

export const useRoom = (roomId) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const response = await roomService.getRoomById(roomId);
        if (response.success) {
          setRoom(response.data);
        } else {
          setError(response.message || "Không thể lấy thông tin phòng");
        }
      } catch (err) {
        setError(err.message || "Không thể kết nối đến server");
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  const toggleFavorite = async () => {
    try {
      // Kiểm tra đăng nhập
      const token = localStorage.getItem("token");
      if (!token) {
        // Chuyển hướng tới trang đăng nhập hoặc hiển thị thông báo
        return false;
      }

      // Gọi API toggle favorite
      const response = await roomService.toggleFavorite(roomId);

      if (response.success) {
        // Cập nhật state
        setRoom((prev) => ({
          ...prev,
          is_favorite: !prev.is_favorite,
        }));
        return true;
      } else {
        setError(response.message || "Không thể thay đổi trạng thái yêu thích");
        return false;
      }
    } catch (err) {
      setError("Không thể thay đổi trạng thái yêu thích");
      return false;
    }
  };

  return { room, loading, error, toggleFavorite };
};
