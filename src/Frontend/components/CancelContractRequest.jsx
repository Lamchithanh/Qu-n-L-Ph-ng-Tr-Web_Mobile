import React, { useState } from "react";
import {
  X,
  AlertCircle,
  FileText,
  Calendar,
  User,
  CheckCircle,
  ChevronDown,
  CreditCard,
  ClipboardList,
  Shield,
  ArrowLeft,
  Send,
} from "lucide-react";
import styles from "../../Style/CancelContractRequest.module.scss";
import { useToast } from "../Contexts/ToastContext";

const CancelContractRequest = ({ contract, onClose, onSubmit }) => {
  const { showToast } = useToast();
  const [reason, setReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Danh sách lý do hủy hợp đồng
  const cancelReasons = [
    { id: 1, text: "Chuyển đi nơi khác" },
    { id: 2, text: "Vấn đề tài chính" },
    { id: 3, text: "Không hài lòng với chất lượng phòng/căn hộ" },
    { id: 4, text: "Thay đổi kế hoạch cá nhân" },
    { id: 5, text: "Vấn đề sức khỏe" },
    { id: 6, text: "Khác" },
  ];

  // Xử lý khi người dùng chọn lý do
  const handleReasonSelect = (reasonId) => {
    const selected = cancelReasons.find((reason) => reason.id === reasonId);
    setSelectedReason(selected.text);
    if (selected.id !== 6) {
      setReason(selected.text);
    } else {
      setReason("");
    }
  };

  // Xử lý khi người dùng submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason || !preferredDate || !confirmTerms) {
      showToast(
        "Vui lòng điền đầy đủ thông tin và xác nhận điều khoản",
        "error"
      );
      return;
    }

    setShowConfirmation(true);
  };

  // Xử lý khi người dùng xác nhận hủy hợp đồng
  const handleConfirmCancel = () => {
    const requestData = {
      contractId: contract.id,
      reason: reason,
      preferredDate: preferredDate,
      requestDate: new Date().toISOString(),
      status: "pending",
    };

    onSubmit(requestData);
    showToast("Yêu cầu hủy hợp đồng đã được gửi thành công", "success");
    onClose();
  };

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {!showConfirmation ? (
          <>
            <div className={styles.modalHeader}>
              <div className={styles.headerTitle}>
                <X size={20} className={styles.headerIcon} />
                <h2>Yêu cầu hủy hợp đồng</h2>
              </div>
              <button className={styles.closeButton} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.contractInfo}>
                <div className={styles.infoItem}>
                  <FileText size={16} className={styles.icon} />
                  <div className={styles.infoContent}>
                    <span className={styles.label}>Mã hợp đồng:</span>
                    <span className={styles.value}>
                      {contract.display_code}
                    </span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Calendar size={16} className={styles.icon} />
                  <div className={styles.infoContent}>
                    <span className={styles.label}>Thời gian:</span>
                    <span className={styles.value}>
                      {formatDate(contract.startDate)} -{" "}
                      {formatDate(contract.endDate)}
                    </span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <User size={16} className={styles.icon} />
                  <div className={styles.infoContent}>
                    <span className={styles.label}>Chủ nhà:</span>
                    <span className={styles.value}>
                      {contract.landlord.name}
                    </span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <CreditCard size={16} className={styles.icon} />
                  <div className={styles.infoContent}>
                    <span className={styles.label}>Tiền thuê hàng tháng:</span>
                    <span className={styles.value}>
                      {formatCurrency(contract.payment.rent)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.divider}></div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Lý do hủy hợp đồng</label>
                  <div className={styles.reasonSelector}>
                    <div className={styles.dropdownHeader}>
                      <span>{selectedReason || "Chọn lý do"}</span>
                      <ChevronDown size={16} />
                    </div>
                    <div className={styles.dropdownOptions}>
                      {cancelReasons.map((reason) => (
                        <div
                          key={reason.id}
                          className={styles.option}
                          onClick={() => handleReasonSelect(reason.id)}
                        >
                          {reason.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedReason === "Khác" && (
                  <div className={styles.formGroup}>
                    <label>Lý do cụ thể</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Vui lòng nêu rõ lý do của bạn"
                      rows={4}
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Ngày muốn hủy hợp đồng</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    max={contract.endDate}
                  />
                  <div className={styles.helperText}>
                    <AlertCircle size={14} />
                    <span>
                      Vui lòng chọn ngày cách hiện tại ít nhất 30 ngày
                    </span>
                  </div>
                </div>

                <div className={styles.noteBox}>
                  <ClipboardList size={20} className={styles.icon} />
                  <div className={styles.noteContent}>
                    <h4>Lưu ý quan trọng:</h4>
                    <ul>
                      <li>
                        Việc hủy hợp đồng sớm có thể phát sinh phí phạt tùy theo
                        điều khoản hợp đồng.
                      </li>
                      <li>
                        Tiền đặt cọc có thể bị mất một phần hoặc toàn bộ tùy
                        theo tình trạng phòng/căn hộ.
                      </li>
                      <li>Bạn cần bàn giao phòng/căn hộ theo đúng quy định.</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="confirmTerms"
                    checked={confirmTerms}
                    onChange={() => setConfirmTerms(!confirmTerms)}
                  />
                  <label htmlFor="confirmTerms">
                    Tôi đã đọc và hiểu rõ các điều khoản về hủy hợp đồng
                  </label>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onClose}
                  >
                    Hủy bỏ
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Gửi yêu cầu
                  </button>
                </div>
              </form>

              <div className={styles.securityNote}>
                <Shield size={16} className={styles.icon} />
                <p>Thông tin của bạn được bảo mật theo quy định pháp luật</p>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.confirmationScreen}>
            <div className={styles.confirmationHeader}>
              <AlertCircle size={48} className={styles.warningIcon} />
              <h2>Xác nhận hủy hợp đồng</h2>
              <p>Vui lòng xác nhận thông tin yêu cầu hủy hợp đồng</p>
            </div>

            <div className={styles.confirmationDetails}>
              <div className={styles.confirmationItem}>
                <span className={styles.label}>Mã hợp đồng:</span>
                <span className={styles.value}>{contract.display_code}</span>
              </div>
              <div className={styles.confirmationItem}>
                <span className={styles.label}>Lý do hủy:</span>
                <span className={styles.value}>{reason}</span>
              </div>
              <div className={styles.confirmationItem}>
                <span className={styles.label}>Ngày yêu cầu hủy:</span>
                <span className={styles.value}>
                  {new Date(preferredDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            <div className={styles.warningBox}>
              <p>
                <strong>Lưu ý:</strong> Sau khi gửi yêu cầu, chủ nhà sẽ xem xét
                và liên hệ với bạn trong vòng 3-5 ngày. Yêu cầu hủy hợp đồng sẽ
                được xử lý theo điều khoản đã ký kết.
              </p>
            </div>

            <div className={styles.confirmationActions}>
              <button
                className={styles.backButton}
                onClick={() => setShowConfirmation(false)}
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmCancel}
              >
                <Send size={16} />
                Xác nhận gửi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelContractRequest;
