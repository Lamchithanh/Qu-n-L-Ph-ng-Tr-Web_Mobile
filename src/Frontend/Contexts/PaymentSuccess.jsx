import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Download,
  Home,
  FileText,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateReceipt } from "../../Utils/generateReceipt";
import styles from "../../Style/PaymentSuccess.module.scss";
import { CONFIG } from "../config/config";
import ReceiptModal from "./ReceiptModal";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const { contractId, displayCode, amount, method, isNewContract } =
    location.state || {};

  // Nếu có displayCode, ưu tiên sử dụng nó
  const displayContractId =
    displayCode ||
    (contractId
      ? String(contractId).startsWith("HD")
        ? String(contractId)
        : `HD${String(contractId).padStart(4, "0")}`
      : "HDXXXX");

  // Tạo mã xác nhận giao dịch
  const transactionId = `${displayContractId}-${Math.random()
    .toString(36)
    .substr(2, 6)
    .toUpperCase()}`;

  // Lấy ngày hiện tại
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [receiptData, setReceiptData] = useState({
    contractId: displayContractId,
    confirmationCode: transactionId,
    transactionDate: currentDate,
    amount: amount || 0,
    method: method || "Chuyển khoản",
    tenantName: "",
    tenantEmail: "",
    tenantPhone: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await fetch(`${CONFIG.API_URL}/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result) {
          setUserProfile(result);
          setReceiptData((prev) => ({
            ...prev,
            tenantName: result.full_name || "",
            tenantEmail: result.email || "",
            tenantPhone: result.phone || "",
          }));
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleDownload = async () => {
    try {
      const receiptData = {
        contractId: displayContractId,
        confirmationCode: transactionId,
        transactionDate: currentDate,
        amount,
        method: method || "Chuyển khoản",
        tenantName: userProfile?.full_name || "",
        tenantEmail: userProfile?.email || "",
        tenantPhone: userProfile?.phone || "",
      };

      await generateReceipt(receiptData);
    } catch (error) {
      console.error("Lỗi tải biên nhận:", error);
      alert(`Lỗi: ${error.message || "Không thể tải biên nhận"}`);
    }
  };

  const handleViewReceipt = () => {
    setIsReceiptModalOpen(true);
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
            <strong>{displayContractId}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Mã giao dịch:</span>
            <strong className={styles.confirmationCode}>{transactionId}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>Ngày thanh toán:</span>
            <strong>{currentDate}</strong>
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
          <div className={styles.detailItem}>
            <span>Phương thức:</span>
            <strong>{method || "Chuyển khoản"}</strong>
          </div>
        </div>

        <div className={styles.receiptPreview}>
          <h3>Biên nhận thanh toán</h3>
          <div className={styles.receiptContent}>
            <div className={styles.receiptHeader}>
              <div className={styles.receiptLogo}>
                <FileText size={24} />
                <span>BIÊN NHẬN THANH TOÁN</span>
              </div>
              <div className={styles.receiptDate}>
                <Calendar size={16} />
                <span>Ngày thanh toán: {currentDate}</span>
              </div>
            </div>

            <div className={styles.receiptDetails}>
              <div className={styles.receiptRow}>
                <span>Mã hợp đồng</span>
                <strong>{displayContractId}</strong>
              </div>
              <div className={styles.receiptRow}>
                <span>Mã giao dịch</span>
                <strong>{transactionId}</strong>
              </div>
              <div className={styles.receiptRow}>
                <span>Số tiền thanh toán</span>
                <strong>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(amount)}
                </strong>
              </div>
              <div className={styles.receiptRow}>
                <span>Phương thức</span>
                <strong>{method || "Chuyển khoản"}</strong>
              </div>
            </div>

            <div className={styles.receiptCustomer}>
              <h4>Thông tin người thanh toán</h4>
              <div className={styles.customerInfo}>
                <div className={styles.customerRow}>
                  <User size={16} />
                  <span>
                    Họ tên: {userProfile?.full_name || "Đang cập nhật"}
                  </span>
                </div>
                <div className={styles.customerRow}>
                  <Mail size={16} />
                  <span>Email: {userProfile?.email || "Đang cập nhật"}</span>
                </div>
                <div className={styles.customerRow}>
                  <Phone size={16} />
                  <span>SĐT: {userProfile?.phone || "Đang cập nhật"}</span>
                </div>
              </div>
            </div>

            <div className={styles.receiptFooter}>
              <p>Biên nhận điện tử - Hệ thống Quản lý cho thuê phòng</p>
            </div>
          </div>
        </div>

        <div className={styles.notice}>
          <h3>Hướng dẫn nhận phòng:</h3>
          <ol>
            <li>
              Lưu giữ mã giao dịch: <strong>{transactionId}</strong>
            </li>
            <li>Mang theo CMND/CCCD khi đến nhận phòng</li>
            <li>Xuất trình mã giao dịch cho quản lý</li>
            <li>Ký nhận bàn giao phòng và nhận chìa khóa</li>
          </ol>
        </div>

        <div className={styles.actions}>
          <button className={styles.viewBtn} onClick={handleViewReceipt}>
            <FileText size={20} />
            Xem biên nhận
          </button>
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

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptData={{
          contractId: displayContractId,
          confirmationCode: transactionId,
          transactionDate: currentDate,
          amount,
          method: method || "Chuyển khoản",
          tenantName: userProfile?.full_name || "",
          tenantEmail: userProfile?.email || "",
          tenantPhone: userProfile?.phone || "",
        }}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default PaymentSuccess;
