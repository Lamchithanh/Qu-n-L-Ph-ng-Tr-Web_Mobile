import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Bell, CheckCircle, X, Filter, Archive, RefreshCw } from "lucide-react";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";

// Định nghĩa các loại thông báo
const NOTIFICATION_TYPES = {
  CRITICAL: {
    value: "critical",
    color: "bg-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
  },
  HIGH: {
    value: "high",
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-500",
  },
  MEDIUM: {
    value: "medium",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
  },
  LOW: {
    value: "low",
    color: "bg-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
  },
};

const NotificationPage = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [notificationStats, setNotificationStats] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Lấy danh sách thông báo từ API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          `${CONFIG.API_URL}/users/notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Cập nhật để lấy đúng dữ liệu từ response
        if (response.data && response.data.notifications) {
          setNotifications(response.data.notifications);
          setNotificationStats(response.data.stats || {});
        } else {
          setNotifications([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy thông báo:", error);
        showToast("Không thể tải thông báo", "error");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Xóa thông báo
  const handleDeleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(`${CONFIG.API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
      showToast("Đã xóa thông báo", "success");
    } catch (error) {
      console.error("Lỗi xóa thông báo:", error);
      showToast("Không thể xóa thông báo", "error");
    }
  };

  // Đánh dấu đã đọc
  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.put(
        `${CONFIG.API_URL}/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
      showToast("Đã đánh dấu đã đọc", "success");
    } catch (error) {
      console.error("Lỗi đánh dấu đọc:", error);
      showToast("Không thể đánh dấu đọc", "error");
    }
  };

  // Lọc và tìm kiếm thông báo
  const filteredNotifications = notifications
    .filter(
      (notification) =>
        (filter === "all" || notification.severity === filter) &&
        (searchTerm === "" ||
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.content.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Render notification item
  const renderNotificationItem = (notification) => {
    const priorityDetails =
      NOTIFICATION_TYPES[notification.severity?.toUpperCase()] ||
      NOTIFICATION_TYPES.LOW;

    return (
      <div
        key={notification.id}
        className={`
          relative flex items-start p-4 mb-4 rounded-lg shadow-md 
          ${priorityDetails.bgColor} border-l-4 ${priorityDetails.borderColor}
          ${notification.is_read ? "opacity-70" : "opacity-100"}
        `}
      >
        {/* Nội dung thông báo */}
        <div className="flex-grow pr-10">
          <div className="flex items-center mb-2">
            <div className="font-bold text-gray-800 mr-3">
              {notification.title}
            </div>
            {!notification.is_read && (
              <span className="animate-pulse bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                Mới
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700 mb-2">{notification.content}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(notification.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Các nút hành động */}
        <div className="flex flex-col space-y-2">
          {!notification.is_read && (
            <button
              onClick={() => handleMarkAsRead(notification.id)}
              className="text-gray-500 hover:text-green-600 transition-colors"
              title="Đánh dấu đã đọc"
            >
              <CheckCircle size={20} />
            </button>
          )}
          <button
            onClick={() => handleDeleteNotification(notification.id)}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Xóa thông báo"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Tiêu đề và công cụ */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Bell className="mr-3 text-indigo-600" size={32} />
          Thông Báo
          {notificationStats.unread > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {notificationStats.unread}
            </span>
          )}
        </h1>

        <div className="flex items-center space-x-4">
          {/* Ô tìm kiếm */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full w-full md:w-64 focus:ring-2 focus:ring-indigo-500"
            />
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>

          {/* Nút làm mới */}
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            title="Làm mới thông báo"
          >
            <RefreshCw size={20} />
          </button>

          {/* Nút lưu trữ */}
          <button
            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            title="Lưu trữ thông báo"
          >
            <Archive size={20} />
          </button>
        </div>
      </div>

      {/* Bộ lọc mức độ ưu tiên */}
      <div className="flex justify-center space-x-2 mb-6">
        {[
          { label: "Tất Cả", value: "all" },
          { label: "Khẩn cấp", value: "urgent" },
          { label: "Cao", value: "high" },
          { label: "Trung bình", value: "medium" },
          { label: "Thấp", value: "low" },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${
                filter === value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Danh sách thông báo */}
      <div>
        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Đang tải thông báo...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
            <Bell className="mx-auto mb-4 text-gray-400" size={48} />
            <p>Không có thông báo nào phù hợp</p>
          </div>
        ) : (
          filteredNotifications.map(renderNotificationItem)
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
