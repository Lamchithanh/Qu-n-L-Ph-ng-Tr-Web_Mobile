import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Filter,
  Archive,
  RefreshCw,
} from "lucide-react";

// Định nghĩa các loại thông báo với mức độ ưu tiên
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

// Component Thông Báo Chi Tiết
const NotificationItem = ({ notification, onClose, onMarkAsRead }) => {
  const priorityDetails =
    NOTIFICATION_TYPES[notification.priority.toUpperCase()] ||
    NOTIFICATION_TYPES.LOW;

  return (
    <div
      className={`
        relative flex items-start p-4 mb-4 rounded-lg shadow-md transition-all duration-300 
        hover:scale-[1.01] hover:shadow-lg
        ${priorityDetails.bgColor} border-l-4 ${priorityDetails.borderColor}
        ${notification.isRead ? "opacity-70" : "opacity-100"}
      `}
    >
      {/* Badge Mức Độ Ưu Tiên */}
      <div
        className={`
          absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white 
          ${priorityDetails.color}
        `}
      >
        {notification.priority.toUpperCase()}
      </div>

      {/* Nội Dung Thông Báo */}
      <div className="flex-grow pr-10">
        <div className="flex items-center mb-2">
          <div className="font-bold text-gray-800 mr-3">
            {notification.title}
          </div>
          {!notification.isRead && (
            <span className="animate-pulse bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
              Mới
            </span>
          )}
        </div>

        <p className="text-sm text-gray-700 mb-2">{notification.message}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {new Date(notification.timestamp).toLocaleString()}
          </span>

          {notification.actionLink && (
            <a
              href={notification.actionLink}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
            >
              Chi Tiết
            </a>
          )}
        </div>
      </div>

      {/* Các Nút Hành Động */}
      <div className="flex flex-col space-y-2">
        {!notification.isRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="text-gray-500 hover:text-green-600 transition-colors"
            title="Đánh dấu đã đọc"
          >
            <CheckCircle size={20} />
          </button>
        )}
        <button
          onClick={() => onClose(notification.id)}
          className="text-gray-500 hover:text-red-600 transition-colors"
          title="Xóa thông báo"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

// Trang Thông Báo Nâng Cấp
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mô phỏng danh sách thông báo từ backend
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Hợp Đồng Mới",
        message: "Bạn có một hợp đồng thuê phòng mới cần ký kết ngay.",
        type: "info",
        priority: "high",
        timestamp: new Date().toISOString(),
        isRead: false,
        actionLink: "/hop-dong/chi-tiet",
      },
      {
        id: 2,
        title: "Thanh Toán Quá Hạn",
        message:
          "Hóa đơn tiền phòng tháng này chưa được thanh toán. Vui lòng thanh toán để tránh phát sinh phí.",
        type: "warning",
        priority: "critical",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isRead: false,
        actionLink: "/thanh-toan",
      },
      {
        id: 3,
        title: "Sự Cố Đã Được Giải Quyết",
        message:
          "Vấn đề sửa chữa phòng ốc đã hoàn tất. Xin cảm ơn sự phối hợp của bạn.",
        type: "success",
        priority: "low",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        isRead: true,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  // Xử lý đóng thông báo
  const handleCloseNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Đánh dấu đã đọc
  const handleMarkAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Lọc và tìm kiếm thông báo
  const filteredNotifications = notifications
    .filter(
      (notification) =>
        (filter === "all" || notification.priority === filter) &&
        (searchTerm === "" ||
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Tiêu Đề và Công Cụ */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Bell className="mr-3 text-indigo-600" size={32} />
          Thông Báo
        </h1>

        <div className="flex items-center space-x-4">
          {/* Ô Tìm Kiếm */}
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

          {/* Nút Làm Mới */}
          <button
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            title="Làm mới thông báo"
          >
            <RefreshCw size={20} />
          </button>

          {/* Nút Lưu Trữ */}
          <button
            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            title="Lưu trữ thông báo"
          >
            <Archive size={20} />
          </button>
        </div>
      </div>

      {/* Bộ Lọc Mức Độ Ưu Tiên */}
      <div className="flex justify-center space-x-2 mb-6">
        {[
          { label: "Tất Cả", value: "all" },
          ...Object.values(NOTIFICATION_TYPES).map((type) => ({
            label: type.value.charAt(0).toUpperCase() + type.value.slice(1),
            value: type.value,
          })),
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

      {/* Danh Sách Thông Báo */}
      <div>
        {filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
            <Bell className="mx-auto mb-4 text-gray-400" size={48} />
            <p>Không có thông báo nào phù hợp</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={handleCloseNotification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
