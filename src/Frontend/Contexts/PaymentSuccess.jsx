// PaymentSuccess.jsx
import React from "react";
import { CheckCircle, Download, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateReceipt } from "../../Utils/generateReceipt";
import styles from "../../Style/PaymentSuccess.module.scss";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contractId, amount, method } = location.state || {};

  const confirmationCode = `${contractId}-${Math.random()
    .toString(36)
    .substr(2, 6)
    .toUpperCase()}`;

  const handleDownload = async () => {
    try {
      await generateReceipt({
        contractId,
        confirmationCode,
        amount,
        method: method || "Chuyển khoản", // Thêm giá trị mặc định nếu method không tồn tại
      });

      // Thông báo tải thành công
      alert("Đã tải biên nhận thành công!");
    } catch (error) {
      console.error("Lỗi tải biên nhận:", error);
      alert(`Lỗi: ${error.message || "Không thể tải biên nhận"}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>
          <CheckCircle size={48} />
        </div>

        <h1>Thanh toán thành công!</h1>
        <p className={styles.message}>
          Cảm ơn bạn đã đặt cọc. Thông tin xác nhận đã được gửi đến email của
          bạn.
        </p>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span>Mã hợp đồng:</span>
            <strong>{contractId}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Mã xác nhận:</span>
            <strong className={styles.confirmationCode}>
              {confirmationCode}
            </strong>
          </div>
          <div className={styles.detailItem}>
            <span>Số tiền đã thanh toán:</span>
            <strong>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(amount)}
            </strong>
          </div>
        </div>

        <div className={styles.notice}>
          <h3>Hướng dẫn nhận phòng:</h3>
          <ol>
            <li>
              Lưu giữ mã xác nhận: <strong>{confirmationCode}</strong>
            </li>
            <li>Mang theo CMND/CCCD khi đến nhận phòng</li>
            <li>Xuất trình mã xác nhận cho quản lý</li>
            <li>Ký nhận bàn giao phòng và nhận chìa khóa</li>
          </ol>
        </div>

        <div className={styles.actions}>
          <button className={styles.downloadBtn} onClick={handleDownload}>
            <Download size={20} />
            Tải biên nhận
          </button>
          <button className={styles.homeBtn} onClick={() => navigate("/")}>
            <Home size={20} />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
