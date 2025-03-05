import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Đảm bảo biến môi trường được load
dotenv.config();

// Kiểm tra xem các biến môi trường cần thiết đã được thiết lập chưa
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn(
    "Cảnh báo: EMAIL_USER hoặc EMAIL_PASSWORD chưa được thiết lập trong file .env"
  );
}

// Tạo transporter với cấu hình từ biến môi trường
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail", // Mặc định là gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Thêm cấu hình SMTP nếu cần
  // host: process.env.EMAIL_HOST,
  // port: process.env.EMAIL_PORT,
  // secure: true/false
});

/**
 * Gửi email reset mật khẩu
 * @param {string} to - Email người nhận
 * @param {string} username - Tên người dùng
 * @param {string} verificationCode - Mã xác nhận
 * @returns {Promise} - Kết quả gửi email
 */
export const sendPasswordResetEmail = async (
  to,
  username,
  verificationCode
) => {
  try {
    const mailOptions = {
      from: `RoomManager <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "Đặt lại mật khẩu - Room Manager",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://i.pinimg.com/736x/22/02/7b/22027b8a2b10228783284f13454681aa.jpg" alt="Room Manager Logo" style="max-width: 150px; border-radius: 8px" />
          </div>
          <h2 style="color: #333; text-align: center;">Đặt lại mật khẩu</h2>
          <p>Xin chào ${username || "Quý khách"},</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại Room Manager.</p>
          <p>Mã xác nhận của bạn là:</p>
          <div style="text-align: center; margin: 20px 0;">
            <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${verificationCode}
            </div>
          </div>
          <p>Mã này sẽ hết hạn sau 1 phút.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi nếu có nghi ngờ về bảo mật tài khoản.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin-top: 20px; font-size: 14px; color: #888;">Đây là email tự động, vui lòng không trả lời.</p>
            <p style="font-size: 14px; color: #888;">© ${new Date().getFullYear()} Room Manager. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw error;
  }
};

// Kiểm tra kết nối SMTP
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Kết nối email server thành công!");
    return true;
  } catch (error) {
    console.error("Không thể kết nối đến email server:", error);
    return false;
  }
};

export default {
  sendPasswordResetEmail,
  verifyEmailConnection,
};
