import { executeQuery } from "../Database/database.js";
import { sendPasswordResetEmail } from "./emailService.js";

/**
 * Tạo mã xác nhận cho reset password và lưu vào database
 * @param {string} email - Email người dùng
 * @param {number} userId - ID người dùng
 * @param {number} expiresInMinutes - Thời gian hết hạn (phút)
 * @returns {string} Mã xác nhận
 */
export const createResetCode = async (email, userId, expiresInMinutes = 1) => {
  try {
    // Tạo mã xác nhận 6 số
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Tính thời gian hết hạn - giảm từ 15 phút xuống 1 phút
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

    // Xóa các mã cũ của email này
    await executeQuery("DELETE FROM password_resets WHERE email = ?", [email]);

    // Lưu mã mới vào database
    await executeQuery(
      "INSERT INTO password_resets (email, user_id, reset_code, expires_at) VALUES (?, ?, ?, ?)",
      [email, userId, verificationCode, expiresAt]
    );

    return verificationCode;
  } catch (error) {
    console.error("Lỗi tạo mã reset:", error);
    throw error;
  }
};

/**
 * Xác thực mã reset password
 * @param {string} email - Email người dùng
 * @param {string} code - Mã xác nhận
 * @returns {Object} Thông tin xác thực
 */
export const verifyResetCode = async (email, code) => {
  try {
    const now = new Date();

    const resetRecord = await executeQuery(
      "SELECT * FROM password_resets WHERE email = ? AND reset_code = ? AND expires_at > ? AND used = false",
      [email, code, now]
    );

    if (resetRecord.length === 0) {
      return {
        valid: false,
        message: "Mã xác nhận không hợp lệ hoặc đã hết hạn",
      };
    }

    return {
      valid: true,
      userId: resetRecord[0].user_id,
      resetId: resetRecord[0].id,
    };
  } catch (error) {
    console.error("Lỗi xác thực mã reset:", error);
    throw error;
  }
};

/**
 * Đánh dấu mã reset password đã được sử dụng
 * @param {number} resetId - ID của bản ghi reset
 */
export const markResetCodeAsUsed = async (resetId) => {
  try {
    await executeQuery("UPDATE password_resets SET used = true WHERE id = ?", [
      resetId,
    ]);
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái mã reset:", error);
    throw error;
  }
};

/**
 * Xóa các mã reset password đã hết hạn
 */
export const cleanupExpiredResetCodes = async () => {
  try {
    const now = new Date();
    const result = await executeQuery(
      "DELETE FROM password_resets WHERE expires_at < ?",
      [now]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Lỗi dọn dẹp mã reset hết hạn:", error);
    throw error;
  }
};

/**
 * Xử lý toàn bộ quy trình gửi mã reset
 * @param {string} email - Email người dùng
 * @returns {boolean} Kết quả gửi mã
 */
export const handlePasswordResetRequest = async (email) => {
  try {
    // Tìm thông tin người dùng từ email
    const user = await executeQuery(
      "SELECT id, username FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return {
        success: false,
        message: "Email không tồn tại trong hệ thống",
      };
    }

    // Tạo mã reset mới
    const verificationCode = await createResetCode(email, user[0].id);

    // Gửi email
    await sendPasswordResetEmail(email, user[0].username, verificationCode);

    // Dọn dẹp các mã hết hạn
    await cleanupExpiredResetCodes();

    return { success: true };
  } catch (error) {
    console.error("Lỗi xử lý yêu cầu reset mật khẩu:", error);
    throw error;
  }
};

export default {
  createResetCode,
  verifyResetCode,
  markResetCodeAsUsed,
  cleanupExpiredResetCodes,
  handlePasswordResetRequest,
};
