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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../Style/ReceiptModal.module.scss";
import { CONFIG } from "../config/config";

const ReceiptModal = ({ isOpen, onClose, receiptData, onDownload }) => {
  if (!isOpen) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
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
    } catch (error) {
      console.error("Lỗi lấy thông tin biên nhận:", error);
      // Fallback sử dụng dữ liệu hiện tại
      onDownload(receiptData);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.receiptModal}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className={styles.modalHeader}>
            <div className={styles.logoSection}>
              <FileText size={32} className={styles.logoIcon} />
              <h2>Biên nhận thanh toán</h2>
            </div>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={24} />
            </button>
          </div>

          <div className={styles.receiptContent}>
            <div className={styles.receiptSection}>
              <div className={styles.sectionHeader}>
                <FileText size={20} />
                <h3>Thông tin hợp đồng</h3>
              </div>
              <div className={styles.detailRow}>
                <span>Mã hợp đồng:</span>
                <strong>{receiptData.contractId}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Mã xác nhận:</span>
                <strong>{receiptData.confirmationCode || "Chưa có"}</strong>
              </div>
            </div>

            <div className={styles.receiptSection}>
              <div className={styles.sectionHeader}>
                <Calendar size={20} />
                <h3>Chi tiết thanh toán</h3>
              </div>
              <div className={styles.detailRow}>
                <span>Ngày thanh toán:</span>
                <strong>{formatDate(new Date())}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Số tiền:</span>
                <strong className={styles.amount}>
                  {formatCurrency(receiptData.amount)}
                </strong>
              </div>
              <div className={styles.detailRow}>
                <span>Phương thức:</span>
                <strong>{receiptData.method || "Chuyển khoản"}</strong>
              </div>
            </div>

            <div className={styles.receiptSection}>
              <div className={styles.sectionHeader}>
                <User size={20} />
                <h3>Thông tin người thanh toán</h3>
              </div>
              <div className={styles.detailRow}>
                <span>Tên:</span>
                <strong>{receiptData.tenantName || "Chưa cập nhật"}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Email:</span>
                <strong>{receiptData.tenantEmail || "Chưa cập nhật"}</strong>
              </div>
            </div>
          </div>

          <div className={styles.receiptFooter}>
            <div className={styles.footerNotice}>
              <Shield size={20} />
              <p>Biên nhận được bảo vệ và xác thực điện tử</p>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.downloadBtn}
                onClick={fetchFullReceiptData}
              >
                <Download size={20} />
                Tải PDF
              </button>
              <button className={styles.closeModalBtn} onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReceiptModal;
