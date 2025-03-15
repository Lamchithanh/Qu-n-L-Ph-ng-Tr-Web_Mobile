import React, { useState } from "react";
import {
  Edit,
  AlertCircle,
  FileText,
  Calendar,
  User,
  CheckCircle,
  Clock,
  CreditCard,
  ClipboardList,
  Shield,
  ArrowLeft,
  Send,
  Home,
  DollarSign,
  X,
  CalendarCheck,
} from "lucide-react";
import styles from "../../Style/ExtendContractRequest.module.scss";
import { useToast } from "../Contexts/ToastContext";

const ExtendContractRequest = ({ contract, onClose, onSubmit }) => {
  const { showToast } = useToast();
  const [extensionPeriod, setExtensionPeriod] = useState("");
  const [rentAdjustment, setRentAdjustment] = useState("same");
  const [customRent, setCustomRent] = useState(contract.payment.rent);
  const [note, setNote] = useState("");
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Danh sách các kỳ hạn gia hạn
  const extensionOptions = [
    { id: 1, value: "3", text: "3 tháng" },
    { id: 2, value: "6", text: "6 tháng" },
    { id: 3, value: "12", text: "12 tháng" },
  ];

  // Tính ngày kết thúc mới dựa trên kỳ hạn được chọn
  const calculateNewEndDate = () => {
    if (!extensionPeriod) return "";

    const currentEndDate = new Date(contract.endDate);
    const months = parseInt(extensionPeriod);

    // Thêm số tháng vào ngày kết thúc hiện tại
    currentEndDate.setMonth(currentEndDate.getMonth() + months);

    return currentEndDate.toISOString().split("T")[0];
  };

  // Xử lý khi người dùng submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!extensionPeriod || !confirmTerms) {
      showToast("Vui lòng chọn kỳ hạn gia hạn và xác nhận điều khoản", "error");
      return;
    }

    if (rentAdjustment === "custom" && (!customRent || customRent <= 0)) {
      showToast("Vui lòng nhập giá thuê hợp lệ", "error");
      return;
    }

    setShowConfirmation(true);
  };

  // Xử lý khi người dùng xác nhận yêu cầu gia hạn
  const handleConfirmExtend = () => {
    const newEndDate = calculateNewEndDate();
    const newRent =
      rentAdjustment === "custom" ? customRent : contract.payment.rent;

    const requestData = {
      contractId: contract.id,
      extensionPeriod: parseInt(extensionPeriod),
      currentEndDate: contract.endDate,
      newEndDate: newEndDate,
      currentRent: contract.payment.rent,
      newRent: newRent,
      note: note,
      requestDate: new Date().toISOString(),
      status: "pending",
    };

    onSubmit(requestData);
    showToast("Yêu cầu gia hạn hợp đồng đã được gửi thành công", "success");
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
                <Edit size={20} className={styles.headerIcon} />
                <h2>Yêu cầu gia hạn hợp đồng</h2>
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

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <Home size={16} className={styles.icon} />
                    <div className={styles.infoContent}>
                      <span className={styles.label}>Phòng/Căn hộ:</span>
                      <span className={styles.value}>{contract.room.name}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <Calendar size={16} className={styles.icon} />
                    <div className={styles.infoContent}>
                      <span className={styles.label}>Ngày hết hạn:</span>
                      <span className={styles.value}>
                        {formatDate(contract.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <CreditCard size={16} className={styles.icon} />
                  <div className={styles.infoContent}>
                    <span className={styles.label}>Tiền thuê hiện tại:</span>
                    <span className={styles.value}>
                      {formatCurrency(contract.payment.rent)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.divider}></div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Kỳ hạn gia hạn</label>
                  <div className={styles.extensionOptions}>
                    {extensionOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`${styles.extensionOption} ${
                          extensionPeriod === option.value
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() => setExtensionPeriod(option.value)}
                      >
                        <CalendarCheck size={16} className={styles.icon} />
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {extensionPeriod && (
                  <div className={styles.newEndDateBox}>
                    <div className={styles.newEndDateContent}>
                      <Clock size={20} className={styles.icon} />
                      <div className={styles.dateInfo}>
                        <p>Ngày kết thúc mới</p>
                        <h4>{formatDate(calculateNewEndDate())}</h4>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Đề xuất giá thuê mới</label>
                  <div className={styles.rentOptions}>
                    <div className={styles.radioGroup}>
                      <input
                        type="radio"
                        id="sameRent"
                        name="rentAdjustment"
                        value="same"
                        checked={rentAdjustment === "same"}
                        onChange={() => setRentAdjustment("same")}
                      />
                      <label htmlFor="sameRent">
                        Giữ nguyên giá hiện tại (
                        {formatCurrency(contract.payment.rent)})
                      </label>
                    </div>

                    <div className={styles.radioGroup}>
                      <input
                        type="radio"
                        id="customRent"
                        name="rentAdjustment"
                        value="custom"
                        checked={rentAdjustment === "custom"}
                        onChange={() => setRentAdjustment("custom")}
                      />
                      <label htmlFor="customRent">Đề xuất giá mới</label>
                    </div>

                    {rentAdjustment === "custom" && (
                      <div className={styles.customRentInput}>
                        <DollarSign size={16} className={styles.inputIcon} />
                        <input
                          type="number"
                          value={customRent}
                          onChange={(e) =>
                            setCustomRent(parseInt(e.target.value) || 0)
                          }
                          placeholder="Nhập giá đề xuất"
                          step="100000"
                        />
                        <span className={styles.currency}>VNĐ</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Ghi chú (không bắt buộc)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Thêm ghi chú hoặc yêu cầu đặc biệt (nếu có)"
                    rows={3}
                  />
                </div>

                <div className={styles.noteBox}>
                  <ClipboardList size={20} className={styles.icon} />
                  <div className={styles.noteContent}>
                    <h4>Lưu ý:</h4>
                    <ul>
                      <li>
                        Yêu cầu gia hạn cần được gửi ít nhất 30 ngày trước khi
                        hợp đồng hết hạn.
                      </li>
                      <li>
                        Chủ nhà có quyền đồng ý hoặc từ chối yêu cầu gia hạn.
                      </li>
                      <li>
                        Giá thuê mới (nếu có) sẽ được áp dụng sau khi hai bên
                        thống nhất.
                      </li>
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
                    Tôi đã đọc và hiểu rõ các điều khoản gia hạn hợp đồng
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
              <CheckCircle size={48} className={styles.successIcon} />
              <h2>Xác nhận gia hạn hợp đồng</h2>
              <p>Vui lòng xác nhận thông tin yêu cầu gia hạn</p>
            </div>

            <div className={styles.confirmationDetails}>
              <div className={styles.confirmationItem}>
                <span className={styles.label}>Mã hợp đồng:</span>
                <span className={styles.value}>{contract.display_code}</span>
              </div>
              <div className={styles.confirmationItem}>
                <span className={styles.label}>Kỳ hạn gia hạn:</span>
                <span className={styles.value}>
                  {
                    extensionOptions.find(
                      (option) => option.value === extensionPeriod
                    )?.text
                  }
                </span>
              </div>
              <div className={styles.confirmationItem}>
                <span className={styles.label}>Ngày hết hạn mới:</span>
                <span className={styles.value}>
                  {formatDate(calculateNewEndDate())}
                </span>
              </div>
              <div className={styles.confirmationItem}>
                <span className={styles.label}>Giá thuê mới:</span>
                <span className={styles.value}>
                  {formatCurrency(
                    rentAdjustment === "custom"
                      ? customRent
                      : contract.payment.rent
                  )}
                </span>
              </div>
              {note && (
                <div className={styles.confirmationItem}>
                  <span className={styles.label}>Ghi chú:</span>
                  <span className={styles.value}>{note}</span>
                </div>
              )}
            </div>

            <div className={styles.infoBox}>
              <p>
                <strong>Lưu ý:</strong> Sau khi gửi yêu cầu, chủ nhà sẽ xem xét
                và liên hệ với bạn. Nếu được chấp nhận, hai bên sẽ tiến hành ký
                phụ lục gia hạn hoặc ký hợp đồng mới.
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
                onClick={handleConfirmExtend}
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

export default ExtendContractRequest;
