import React from "react";
import {
  CheckCircle,
  Download,
  Home,
  FileText,
  X,
  QrCode,
  Calendar,
  User,
  Building2,
  Shield,
  Mail,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../Style/ReceiptModal.module.scss";
import { CONFIG } from "../config/config";

const ReceiptModal = ({ isOpen, onClose, receiptData, onDownload }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchFullReceiptData = async () => {
    try {
      // Sử dụng dữ liệu hiện tại để tạo biên nhận
      onDownload(receiptData);

      // Không gọi API vì hiện tại endpoint không tồn tại
      // Đoạn code dưới đây đã được comment để tránh lỗi 404
      /*
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("Không có phiên đăng nhập");
      }

      // Lấy thông tin giao dịch chi tiết
      const paymentResponse = await fetch(
        `${CONFIG.API_URL}/payments/${receiptData.contractId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentData = await paymentResponse.json();
      if (!paymentData.success) {
        throw new Error("Không thể lấy thông tin thanh toán");
      }

      // Gọi hàm download với dữ liệu đầy đủ
      onDownload({
        contractId: receiptData.contractId,
        transactionId: paymentData.data.transaction_id,
        amount: paymentData.data.amount,
        paymentMethod: paymentData.data.payment_method,
      });
      */
    } catch (error) {
      console.error("Lỗi lấy thông tin biên nhận:", error);
      // Fallback sử dụng dữ liệu hiện tại
      onDownload(receiptData);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Biên nhận thanh toán</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.receiptContainer}>
          <div className={styles.receiptHeader}>
            <div className={styles.receiptLogo}>
              <FileText size={24} />
              <span>BIÊN NHẬN THANH TOÁN</span>
            </div>
            <div className={styles.receiptDate}>
              <Calendar size={16} />
              <span>
                Ngày thanh toán:{" "}
                {receiptData.transactionDate ||
                  new Date().toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>

          <div className={styles.receiptBody}>
            <div className={styles.receiptSection}>
              <h3>Thông tin giao dịch</h3>
              <div className={styles.receiptRow}>
                <span>Mã hợp đồng:</span>
                <strong>{receiptData.contractId}</strong>
              </div>
              <div className={styles.receiptRow}>
                <span>Mã giao dịch:</span>
                <strong className={styles.confirmationCode}>
                  {receiptData.confirmationCode}
                </strong>
              </div>
              <div className={styles.receiptRow}>
                <span>Số tiền thanh toán:</span>
                <strong className={styles.amount}>
                  {formatCurrency(receiptData.amount)}
                </strong>
              </div>
              <div className={styles.receiptRow}>
                <span>Phương thức:</span>
                <strong>{receiptData.method}</strong>
              </div>
              <div className={styles.receiptRow}>
                <span>Trạng thái:</span>
                <strong className={styles.status}>Đã thanh toán</strong>
              </div>
            </div>

            <div className={styles.receiptSection}>
              <h3>Thông tin người thanh toán</h3>
              <div className={styles.customerInfo}>
                <div className={styles.customerRow}>
                  <User size={16} />
                  <span>Họ tên:</span>
                  <strong>{receiptData.tenantName || "Chưa cập nhật"}</strong>
                </div>
                <div className={styles.customerRow}>
                  <Mail size={16} />
                  <span>Email:</span>
                  <strong>{receiptData.tenantEmail || "Chưa cập nhật"}</strong>
                </div>
                <div className={styles.customerRow}>
                  <Phone size={16} />
                  <span>Số điện thoại:</span>
                  <strong>{receiptData.tenantPhone || "Chưa cập nhật"}</strong>
                </div>
              </div>
            </div>

            <div className={styles.receiptNote}>
              <p>
                Biên nhận này là xác nhận cho việc đặt cọc hợp đồng thuê phòng.
                Vui lòng giữ lại biên nhận này để xuất trình khi cần thiết.
              </p>
            </div>
          </div>

          <div className={styles.receiptFooter}>
            <div className={styles.footerInfo}>
              <p>Biên nhận điện tử - Hệ thống Quản lý cho thuê phòng</p>
              <p>Mã xác thực: {receiptData.confirmationCode}</p>
            </div>
            <div className={styles.footerLogo}>
              <FileText size={16} />
              <span>QLPT</span>
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.downloadButton}
            onClick={fetchFullReceiptData}
          >
            <Download size={20} />
            Tải biên nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
