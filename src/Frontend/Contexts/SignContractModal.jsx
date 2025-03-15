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
import { useToast } from "../Contexts/ToastContext";

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
    contractId: null,
    display_code: null,
  });

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Kiểm tra tồn tại của người dùng
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

  // Kiểm tra trạng thái đăng nhập và người dùng
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);

    if (!contractInfo?.tenant?.email) {
      setError("Thông tin hợp đồng không hợp lệ");
      setIsChecking(false);
      return;
    }
    checkUserExists();
  }, [contractInfo]);

  // Xử lý ký hợp đồng
  const performContractSigning = async () => {
    try {
      setSignStatus({ signing: true, success: false, error: null });

      // Trường hợp chưa đăng nhập hoặc ở chế độ khách
      if (guestMode || !isLoggedIn) {
        // Chuẩn bị thông tin người dùng
        const userInfo = {
          username: contractInfo.tenant.email.split("@")[0],
          email: contractInfo.tenant.email,
          password: contractInfo.tenant.phone,
          phone: contractInfo.tenant.phone,
          full_name: contractInfo.tenant.name,
          cccd: contractInfo.tenant.id_card,
          address: contractInfo.tenant.address || "",
        };

        // Đăng ký tài khoản mới
        const registerResponse = await fetch(
          `${CONFIG.API_URL}/users/registerFromContract`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo),
          }
        );

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          if (registerData.requireLogin) {
            setSignStatus({
              signing: false,
              success: false,
              error: "Email đã tồn tại",
            });
            showToast(
              "Email này đã tồn tại. Vui lòng đăng nhập để tiếp tục",
              "error"
            );
            return;
          }
          throw new Error(registerData.message || "Không thể tạo tài khoản");
        }

        // Lưu token
        localStorage.setItem("userToken", registerData.token);

        // Lưu thông tin đăng nhập và hiển thị ngay
        setCredentials({
          username: userInfo.username,
          password: userInfo.password,
          email: userInfo.email,
        });
        setShowCredentials(true);

        // Tạo hợp đồng
        const contractPayload = {
          room_id: contractInfo.room.id,
          tenant_info: {
            name: contractInfo.tenant.name,
            id_card: contractInfo.tenant.id_card,
            phone: contractInfo.tenant.phone,
            email: contractInfo.tenant.email,
            address: contractInfo.tenant.address || "",
          },
          start_date: contractInfo.startDate,
          end_date: contractInfo.endDate,
          deposit_amount: contractInfo.payment.deposit,
          monthly_rent: contractInfo.payment.rent,
        };

        const contractResponse = await fetch(`${CONFIG.API_URL}/contracts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${registerData.token}`,
          },
          body: JSON.stringify(contractPayload),
        });

        const contractResult = await contractResponse.json();

        if (!contractResponse.ok) {
          throw new Error(contractResult.message || "Không thể tạo hợp đồng");
        }

        setSignStatus({
          signing: false,
          success: true,
          error: null,
          contractId: contractResult.data.contractId,
          display_code: contractResult.data.display_code,
        });

        // Đối với người dùng đã đăng nhập, chuyển thẳng đến trang thanh toán
        if (onConfirm) {
          onConfirm({
            contractId: contractResult.data.contractId,
            displayCode:
              contractResult.data.display_code ||
              `HD${String(contractResult.data.contractId).padStart(4, "0")}`,
            amount: contractInfo.payment.deposit,
            isNewContract: true,
          });
        }
      } else {
        // Xử lý cho người dùng đã đăng nhập
        const token = localStorage.getItem("userToken");
        if (!token) {
          setSignStatus({
            signing: false,
            success: false,
            error: "Vui lòng đăng nhập",
          });
          showToast("Vui lòng đăng nhập để ký hợp đồng", "error");
          return;
        }

        // Tạo hợp đồng cho người dùng đã đăng nhập
        const contractPayload = {
          room_id: contractInfo.room.id,
          tenant_info: {
            name: contractInfo.tenant.name,
            id_card: contractInfo.tenant.id_card,
            phone: contractInfo.tenant.phone,
            email: contractInfo.tenant.email,
            address: contractInfo.tenant.address || "",
          },
          start_date: contractInfo.startDate,
          end_date: contractInfo.endDate,
          deposit_amount: contractInfo.payment.deposit,
          monthly_rent: contractInfo.payment.rent,
        };

        const contractResponse = await fetch(`${CONFIG.API_URL}/contracts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(contractPayload),
        });

        const contractResult = await contractResponse.json();

        if (!contractResponse.ok) {
          throw new Error(contractResult.message || "Không thể ký hợp đồng");
        }

        setSignStatus({
          signing: false,
          success: true,
          error: null,
          contractId: contractResult.data.contractId,
          display_code: contractResult.data.display_code,
        });

        // Đối với người dùng đã đăng nhập, chuyển thẳng đến trang thanh toán
        if (onConfirm) {
          onConfirm({
            contractId: contractResult.data.contractId,
            displayCode:
              contractResult.data.display_code ||
              `HD${String(contractResult.data.contractId).padStart(4, "0")}`,
            amount: contractInfo.payment.deposit,
            isNewContract: true,
          });
        }
      }
    } catch (error) {
      console.error("Lỗi ký hợp đồng:", error);
      setSignStatus({
        signing: false,
        success: false,
        error: error.message || "Đã xảy ra lỗi khi ký hợp đồng",
      });
      showToast(
        `Lỗi: ${error.message || "Đã xảy ra lỗi khi ký hợp đồng"}`,
        "error"
      );
    }
  };

  // Render phần thông tin tài khoản
  const renderCredentialsSection = () => {
    return (
      <div className={styles.credentialsContainer}>
        <div className={styles.credentialsInfo}>
          <div className={styles.successHeader}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h3>Tài khoản của bạn đã được tạo</h3>
          </div>
          <div className={styles.credentialDetails}>
            <div className={styles.credentialItem}>
              <User size={20} />
              <div>
                <span className={styles.label}>Email:</span>
                <strong>{contractInfo.tenant.email}</strong>
              </div>
            </div>

            <div className={styles.credentialItem}>
              <Lock size={20} />
              <div>
                <span className={styles.label}>Mật khẩu:</span>
                <strong>{credentials?.password}</strong>
              </div>
            </div>
          </div>
          <div className={styles.credentialWarning}>
            <AlertCircle size={20} />
            <p>
              Đây là tài khoản đăng nhập duy nhất của bạn.
              <strong> Vui lòng lưu lại thông tin đăng nhập</strong> và đổi mật
              khẩu ngay sau lần đăng nhập đầu tiên.
            </p>
          </div>
          <div className={styles.contractSummary}>
            <div className={styles.summaryHeader}>
              <FileText size={24} />
              <h3>Chi tiết hợp đồng</h3>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summarySection}>
                <h4>Thông tin phòng</h4>
                <div className={styles.summaryItem}>
                  <span>Tên phòng:</span>
                  <strong>{contractInfo.room.name}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Địa chỉ:</span>
                  <strong>{contractInfo.room.address}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Diện tích:</span>
                  <strong>{contractInfo.room.area || "Chưa cập nhật"}</strong>
                </div>
              </div>

              <div className={styles.summarySection}>
                <h4>Thông tin thuê</h4>
                <div className={styles.summaryItem}>
                  <span>Thời hạn:</span>
                  <strong>
                    {formatDate(contractInfo.startDate)} -{" "}
                    {formatDate(contractInfo.endDate)}
                  </strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Tiền thuê hàng tháng:</span>
                  <strong className={styles.rentAmount}>
                    {formatCurrency(contractInfo.payment.rent)}
                  </strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Tiền đặt cọc:</span>
                  <strong className={styles.depositAmount}>
                    {formatCurrency(contractInfo.payment.deposit)}
                  </strong>
                </div>
              </div>

              <div className={styles.summarySection}>
                <h4>Thông tin người thuê</h4>
                <div className={styles.summaryItem}>
                  <span>Họ tên:</span>
                  <strong>{contractInfo.tenant.name}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Số điện thoại:</span>
                  <strong>{contractInfo.tenant.phone}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Email:</span>
                  <strong>{contractInfo.tenant.email}</strong>
                </div>
              </div>
            </div>

            <div className={styles.summaryNote}>
              <Info size={20} />
              <p>
                Vui lòng kiểm tra kỹ thông tin trước khi ký kết. Sau khi ký, bạn
                sẽ phải thanh toán tiền đặt cọc để hoàn tất quá trình thuê
                phòng.
              </p>
            </div>
          </div>
          <div className={styles.nextSteps}>
            <h4>Các bước tiếp theo:</h4>
            <ul>
              <li>Đăng nhập bằng tên đăng nhập và mật khẩu ở trên</li>
              <li>Thay đổi mật khẩu ngay sau khi đăng nhập lần đầu</li>
              <li>Kiểm tra và cập nhật đầy đủ thông tin cá nhân</li>
            </ul>
          </div>
          {/* Nút Tiếp tục để chuyển đến trang thanh toán */}
          <button
            className={styles.continueBtn}
            onClick={() => {
              onConfirm({
                contractId: signStatus.contractId,
                displayCode:
                  signStatus.display_code ||
                  `HD${signStatus.contractId.toString().padStart(4, "0")}`,
                amount: contractInfo.payment.deposit,
                isNewContract: true,
              });
            }}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    );
  };

  // Render các trạng thái loading
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

  // Nếu đã hiển thị thông tin tài khoản
  if (showCredentials) {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>{renderCredentialsSection()}</div>
      </div>
    );
  }

  // Render trạng thái đang ký
  if (signStatus.signing) {
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

  // Render trạng thái ký thành công
  if (signStatus.success) {
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

  // Render trạng thái lỗi
  if (signStatus.error || error) {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.error}>
            <AlertCircle size={24} />
            <p>{signStatus.error || error}</p>
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

  // Render modal chính
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Xác nhận ký hợp đồng</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.contractSummary}>
          <div className={styles.summaryHeader}>
            <FileText size={24} />
            <h3>Chi tiết hợp đồng</h3>
          </div>

          <div className={styles.summaryGrid}>
            <div className={styles.summarySection}>
              <h4>Thông tin phòng</h4>
              <div className={styles.summaryItem}>
                <span>Tên phòng:</span>
                <strong>{contractInfo.room.name}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Địa chỉ:</span>
                <strong>{contractInfo.room.address}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Diện tích:</span>
                <strong>{contractInfo.room.area || "Chưa cập nhật"}</strong>
              </div>
            </div>

            <div className={styles.summarySection}>
              <h4>Thông tin thuê</h4>
              <div className={styles.summaryItem}>
                <span>Thời hạn:</span>
                <strong>
                  {formatDate(contractInfo.startDate)} -{" "}
                  {formatDate(contractInfo.endDate)}
                </strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Tiền thuê hàng tháng:</span>
                <strong className={styles.rentAmount}>
                  {formatCurrency(contractInfo.payment.rent)}
                </strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Tiền đặt cọc:</span>
                <strong className={styles.depositAmount}>
                  {formatCurrency(contractInfo.payment.deposit)}
                </strong>
              </div>
            </div>

            <div className={styles.summarySection}>
              <h4>Thông tin người thuê</h4>
              <div className={styles.summaryItem}>
                <span>Họ tên:</span>
                <strong>{contractInfo.tenant.name}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Số điện thoại:</span>
                <strong>{contractInfo.tenant.phone}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Email:</span>
                <strong>{contractInfo.tenant.email}</strong>
              </div>
            </div>
          </div>
        </div>

        {guestMode && (
          <div className={styles.guestModeNotice}>
            <Info size={20} />
            <div>
              <h4>Lưu ý quan trọng</h4>
              <p>
                Bằng việc ký hợp đồng, hệ thống sẽ tự động tạo tài khoản với
                thông tin bạn đã cung cấp. Mật khẩu mặc định sẽ là số điện thoại
                của bạn.
              </p>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className={styles.notice}>
            <AlertCircle size={20} />
            {userExists ? (
              <p>
                Email này đã tồn tại. Vui lòng đăng nhập để tiếp tục ký hợp
                đồng.
              </p>
            ) : (
              <p>Hệ thống sẽ tạo tài khoản tự động cho bạn khi ký hợp đồng.</p>
            )}
          </div>
        )}

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
                Tôi xác nhận thông tin đã cung cấp là chính xác và đồng ý ký hợp
                đồng này.
              </span>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy bỏ
          </button>
          <button
            className={styles.confirmBtn}
            onClick={performContractSigning}
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
