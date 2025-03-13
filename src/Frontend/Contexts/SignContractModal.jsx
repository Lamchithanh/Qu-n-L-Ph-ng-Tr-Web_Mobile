import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  User,
  Lock,
  X,
  Clock,
  Info,
} from "lucide-react";
import styles from "../../Style/SignContractModal.module.scss";
import { CONFIG } from "../config/config";
import ContractTerms from "../components/ContractTerms";
import { useToast } from "./ToastContext";

const SignContractModal = ({ contractInfo, onClose, onConfirm, guestMode }) => {
  const { showToast } = useToast();
  const [userExists, setUserExists] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);
  const [agreeToPolicies, setAgreeToPolicies] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signStatus, setSignStatus] = useState({
    signing: false,
    success: false,
    error: null,
    contractId: null, // Thêm ID hợp đồng nếu ký thành công
  });

  const formatContractCode = (id, prefix = "HD") => {
    return `${prefix}${String(id).padStart(4, "0")}`;
  };

  useEffect(() => {
    // Kiểm tra đăng nhập khi component được tải
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);

    if (!contractInfo?.tenant?.email) {
      setError("Thông tin hợp đồng không hợp lệ");
      setIsChecking(false);
      return;
    }
    checkUserExists();
  }, [contractInfo]);

  // Thêm dòng này trước khi gửi request
  console.log("Request body:", {
    room_id: contractInfo.room.id,
    tenant_info: {
      name: contractInfo.tenant.name,
      id_card: contractInfo.tenant.id,
      phone: contractInfo.tenant.phone,
      email: contractInfo.tenant.email,
    },
    start_date: contractInfo.startDate,
    end_date: contractInfo.endDate,
    deposit_amount: contractInfo.payment.deposit,
    monthly_rent: contractInfo.payment.rent,
  });

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

  const performContractSigning = async () => {
    try {
      // 1. Kiểm tra token
      const token = localStorage.getItem("userToken");
      if (!token) {
        showToast("Vui lòng đăng nhập để ký hợp đồng", "error");
        return;
      }

      // 2. Kiểm tra và validate thông tin người thuê
      const tenantInfo = {
        name: contractInfo.tenant.name || "",
        id_card: contractInfo.tenant.id || contractInfo.tenant.id_card || "",
        phone: contractInfo.tenant.phone || "",
        email: contractInfo.tenant.email || "",
        address: contractInfo.room.address || "",
      };

      // 3. Kiểm tra các trường bắt buộc
      const requiredFields = ["name", "id_card", "phone", "email"];
      const missingFields = requiredFields.filter(
        (field) => !tenantInfo[field]
      );

      if (missingFields.length > 0) {
        showToast(`Vui lòng điền đầy đủ: ${missingFields.join(", ")}`, "error");
        return;
      }

      // 4. Chuẩn bị payload
      const today = new Date();
      const endDate = new Date(today);
      endDate.setMonth(endDate.getMonth() + 6);

      const contractPayload = {
        room_id: contractInfo.room.id,
        tenant_info: {
          name: tenantInfo.name,
          id_card: tenantInfo.id_card,
          phone: tenantInfo.phone,
          email: tenantInfo.email,
          address: tenantInfo.address,
        },
        start_date: today.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        deposit_amount: contractInfo.payment.deposit,
        monthly_rent: contractInfo.payment.rent,
      };

      // 5. Đặt trạng thái đang ký
      setSignStatus({ signing: true, success: false, error: null });

      // 6. Xử lý ký hợp đồng
      const contractResponse = await fetch(`${CONFIG.API_URL}/contracts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contractPayload),
      });

      // 7. Xử lý kết quả
      const contractResult = await contractResponse.json();

      if (!contractResponse.ok) {
        throw new Error(contractResult.message || "Không thể ký hợp đồng");
      }

      // 8. Cập nhật trạng thái
      setSignStatus({
        signing: false,
        success: true,
        error: null,
        contractId: contractResult.data.contractId,
      });

      // 9. Gọi onConfirm để chuyển đến trang thanh toán
      if (onConfirm) {
        onConfirm({
          contractId: formatContractCode(contractResult.data.contractId), // Format mã hợp đồng
          displayCode: contractResult.data.displayCode,
          roomId: contractResult.data.roomId,
          amount: contractInfo.payment.deposit,
          isNewContract: true,
        });
      } else {
        // Nếu không có onConfirm, chuyển hướng mặc định
        showToast("Ký hợp đồng thành công", "success");
      }
    } catch (error) {
      console.error("Lỗi ký hợp đồng:", error);

      // Cập nhật trạng thái lỗi
      setSignStatus({
        signing: false,
        success: false,
        error: error.message || "Đã xảy ra lỗi khi ký hợp đồng",
        contractId: null,
      });

      // Hiển thị thông báo lỗi
      showToast(
        `Lỗi: ${error.message || "Đã xảy ra lỗi khi ký hợp đồng"}`,
        "error"
      );
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  if (isChecking) {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang kiểm tra thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (signStatus?.signing) {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang xử lý yêu cầu ký hợp đồng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (signStatus?.success) {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.success}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h3>Ký hợp đồng thành công!</h3>
            <p>
              Hợp đồng đã được xác nhận. Bạn sẽ được chuyển đến trang thanh
              toán.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (signStatus?.error || error) {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.error}>
            <AlertCircle size={24} />
            <p>{signStatus?.error || error}</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Đóng
            </button>
            <button className={styles.confirmBtn} onClick={onConfirm}>
              Thử lại
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
        <div className={styles.modalHeader}>
          <h2>Xác nhận ký hợp đồng</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

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
                <span>Phòng:</span>
                <strong>{contractInfo.room.name}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Địa chỉ:</span>
                <strong>{contractInfo.room.address}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Người thuê:</span>
                <strong>{contractInfo.tenant.name}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Tiền thuê hàng tháng:</span>
                <strong>{formatCurrency(contractInfo.payment.rent)}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Tiền đặt cọc (cần thanh toán):</span>
                <strong className={styles.depositAmount}>
                  {formatCurrency(contractInfo.payment.deposit)}
                </strong>
              </div>
            </div>

            {guestMode && (
              <div className={styles.guestModeNotice}>
                <Info size={20} />
                <div>
                  <h4>Lưu ý quan trọng</h4>
                  <p>
                    Bằng việc ký hợp đồng, hệ thống sẽ tự động tạo tài khoản với
                    thông tin bạn đã cung cấp. Mật khẩu mặc định sẽ là số điện
                    thoại của bạn.
                  </p>
                </div>
              </div>
            )}

            <div className={styles.paymentInfo}>
              <Clock size={20} />
              <div>
                <h4>Thời hạn thanh toán</h4>
                <p>
                  Vui lòng thanh toán tiền đặt cọc trong vòng 24 giờ sau khi ký
                  hợp đồng để đảm bảo quyền lợi.
                </p>
              </div>
            </div>

            <div className={styles.checkList}>
              <h3>Điều khoản & Điều kiện</h3>
              <div className={styles.checkItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={agreeToPolicies}
                    onChange={() => setAgreeToPolicies(!agreeToPolicies)}
                  />
                  <span>
                    Tôi đã đọc và đồng ý với tất cả{" "}
                    <span
                      className={styles.link}
                      onClick={() => setShowTerms(true)}
                      style={{ cursor: "pointer" }}
                    >
                      điều khoản và điều kiện
                    </span>
                    của hợp đồng.
                  </span>
                </label>
              </div>
              {showTerms && (
                <div className={styles.termsModal}>
                  <ContractTerms onClose={() => setShowTerms(false)} />
                </div>
              )}
              <div className={styles.checkItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={confirmAction}
                    onChange={() => setConfirmAction(!confirmAction)}
                  />
                  <span>
                    Tôi xác nhận thông tin đã cung cấp là chính xác và đồng ý ký
                    hợp đồng này.
                  </span>
                </label>
              </div>
            </div>

            {/* Chỉ hiển thị thông báo khi chưa đăng nhập */}
            {!isLoggedIn && (
              <div className={styles.notice}>
                <AlertCircle size={20} />
                {userExists ? (
                  <p>
                    Email này đã tồn tại. Vui lòng đăng nhập để tiếp tục ký hợp
                    đồng.
                  </p>
                ) : (
                  <p>
                    Hệ thống sẽ tạo tài khoản tự động cho bạn khi ký hợp đồng.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy bỏ
          </button>
          <button
            className={styles.confirmBtn}
            onClick={performContractSigning} // Sử dụng tên hàm mới
            disabled={!agreeToPolicies || !confirmAction}
          >
            Xác nhận ký kết
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignContractModal;
