import React, { useState, useEffect } from "react";
import { CheckCircle, Download, Home } from "lucide-react";
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
  const { contractId, amount, method } = location.state || {};

  const [receiptData, setReceiptData] = useState({
    contractId: contractId
      ? String(contractId).startsWith("HD")
        ? String(contractId)
        : `HD${String(contractId).padStart(4, "0")}`
      : "HDXXXX",
    confirmationCode: `${
      contractId
        ? String(contractId).startsWith("HD")
          ? String(contractId)
          : `HD${String(contractId).padStart(4, "0")}`
        : "HDXXXX"
    }-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    amount: amount || 0,
    method: method || "Chuyển khoản",
    tenantName: "",
    tenantEmail: "",
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
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Format mã hợp đồng theo cùng định dạng với các thành phần khác
  const displayContractId = contractId
    ? String(contractId).startsWith("HD")
      ? String(contractId)
      : `HD${String(contractId).padStart(4, "0")}`
    : "HDXXXX";

  const confirmationCode = `${displayContractId}-${Math.random()
    .toString(36)
    .substr(2, 6)
    .toUpperCase()}`;

  const handleDownload = async () => {
    try {
      const receiptData = {
        contractId: displayContractId,
        confirmationCode,
        amount,
        method: method || "Chuyển khoản",
        tenantName: userProfile?.full_name,
        tenantEmail: userProfile?.email,
        tenantPhone: userProfile?.phone,
      };

      await generateReceipt(receiptData);
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
            <strong>{displayContractId}</strong>
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

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptData={receiptData}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default PaymentSuccess;
