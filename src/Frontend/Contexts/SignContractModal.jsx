import React, { useState, useEffect } from "react";
import { FileText, CheckCircle, AlertCircle, User, Lock } from "lucide-react";
import styles from "../../Style/SignContractModal.module.scss";
import { CONFIG } from "../config/config";

const SignContractModal = ({ onClose, onConfirm, contractInfo }) => {
  const [userExists, setUserExists] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contractInfo?.tenant?.email) {
      setError("Thông tin hợp đồng không hợp lệ");
      setIsChecking(false);
      return;
    }
    checkUserExists();
  }, [contractInfo]);

  const checkUserExists = async () => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/users/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: contractInfo?.tenant?.email,
        }),
      });
      const data = await response.json();
      setUserExists(data.exists);
      setIsChecking(false);
    } catch (error) {
      console.error("Error checking user:", error);
      setError("Không thể kiểm tra thông tin người dùng");
      setIsChecking(false);
    }
  };

  const handleSignContract = async () => {
    if (!userExists) {
      try {
        const username =
          contractInfo?.tenant?.name?.split(" ")[0]?.toLowerCase() || "";
        const response = await fetch(
          `${CONFIG.API_URL}/users/registerFromContract`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              email: contractInfo?.tenant?.email,
              password: contractInfo?.tenant?.phone,
              phone: contractInfo?.tenant?.phone,
              full_name: contractInfo?.tenant?.name,
              role: "tenant",
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setCredentials({
            username,
            password: contractInfo?.tenant?.phone,
          });
          setShowCredentials(true);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error creating account:", error);
        setError("Không thể tạo tài khoản. Vui lòng thử lại sau.");
      }
    } else {
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
    }
  };

  if (isChecking) {
    return <div className={styles.loading}>Đang kiểm tra thông tin...</div>;
  }

  if (error) {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.error}>
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!contractInfo) {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.error}>
            <AlertCircle size={24} />
            <p>Không tìm thấy thông tin hợp đồng</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Xác nhận ký hợp đồng</h2>

        {showCredentials ? (
          <div className={styles.credentialsInfo}>
            <h3>Thông tin tài khoản của bạn</h3>
            <div className={styles.credentialItem}>
              <User size={20} />
              <span>
                Tên đăng nhập: <strong>{credentials?.username}</strong>
              </span>
            </div>
            <div className={styles.credentialItem}>
              <Lock size={20} />
              <span>
                Mật khẩu: <strong>{credentials?.password}</strong>
              </span>
            </div>
            <p className={styles.credentialNote}>
              Vui lòng lưu lại thông tin đăng nhập và đổi mật khẩu sau khi đăng
              nhập lần đầu
            </p>
          </div>
        ) : (
          <>
            <div className={styles.contractSummary}>
              <h3>Thông tin hợp đồng</h3>
              <div className={styles.summaryItem}>
                <span>Mã hợp đồng:</span>
                <strong>{contractInfo?.id || "N/A"}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Thời hạn:</span>
                <strong>
                  {contractInfo?.startDate &&
                    new Date(contractInfo.startDate).toLocaleDateString(
                      "vi-VN"
                    )}{" "}
                  -
                  {contractInfo?.endDate &&
                    new Date(contractInfo.endDate).toLocaleDateString("vi-VN")}
                </strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Giá thuê:</span>
                <strong>
                  {contractInfo?.payment?.rent &&
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(contractInfo.payment.rent)}
                  /tháng
                </strong>
              </div>
            </div>

            <div className={styles.checkList}>
              <h3>Điều khoản & Điều kiện</h3>
              <div className={styles.checkItem}>
                <CheckCircle size={20} />
                <p>Tôi đã đọc và đồng ý với tất cả điều khoản trong hợp đồng</p>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle size={20} />
                <p>Tôi xác nhận thông tin cá nhân là chính xác</p>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle size={20} />
                <p>Tôi đồng ý với các điều kiện thanh toán</p>
              </div>
            </div>

            <div className={styles.notice}>
              <AlertCircle size={20} />
              {userExists ? (
                <p>Vui lòng đăng nhập để tiếp tục ký hợp đồng</p>
              ) : (
                <p>Hệ thống sẽ tạo tài khoản tự động cho bạn khi ký hợp đồng</p>
              )}
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy bỏ
          </button>
          {showCredentials ? (
            <button className={styles.confirmBtn} onClick={onConfirm}>
              Tiếp tục thanh toán
            </button>
          ) : (
            <button className={styles.confirmBtn} onClick={handleSignContract}>
              {userExists ? "Đăng nhập ngay" : "Xác nhận ký kết"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignContractModal;
