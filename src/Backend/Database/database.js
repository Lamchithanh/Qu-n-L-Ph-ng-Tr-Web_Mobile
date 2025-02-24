import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Cấu hình môi trường
// Cấu hình môi trường
dotenv.config({ path: ".env" });

// Cấu hình kết nối database từ biến môi trường
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

// Tạo kết nối pool để quản lý kết nối hiệu quả
const pool = mysql.createPool(dbConfig);

// Hàm kiểm tra kết nối
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Kết nối MySQL thành công!");
    connection.release();
    return true;
  } catch (error) {
    console.error("Lỗi kết nối MySQL:", error);
    return false;
  }
}

// Hàm thực thi truy vấn an toàn
async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error("Lỗi thực thi truy vấn:", error);
    throw error;
  }
}

export { testConnection, executeQuery, pool };
