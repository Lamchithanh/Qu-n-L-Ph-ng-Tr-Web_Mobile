// Các environment
const environments = {
  development: {
    API_URL: "http://localhost:5000/api",
  },
  production: {
    API_URL: "https://localhost:5173/api",
  },
};

// Chọn môi trường hiện tại
const env = process.env.NODE_ENV || "development";

// Xuất cấu hình
export const CONFIG = {
  ...environments[env],
  // Các cấu hình chung khác nếu cần
  TIMEOUT: 10000, // Thời gian timeout mặc định
  MAX_RETRY: 3, // Số lần thử lại kết nối
};
