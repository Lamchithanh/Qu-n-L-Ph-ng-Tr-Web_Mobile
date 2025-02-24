import React, { useState } from "react";
import styles from "../../Style/EditContractModal.module.scss";

const EditContractModal = ({ onClose, onSubmit }) => {
  const [editRequest, setEditRequest] = useState({
    section: "",
    details: "",
    reason: "",
  });

  const editableItems = [
    {
      section: "tenant_info",
      label: "Thông tin cá nhân",
      fields: ["Họ tên", "CMND/CCCD", "Số điện thoại", "Email"],
    },
    {
      section: "contract_period",
      label: "Thời hạn hợp đồng",
      fields: ["Ngày bắt đầu", "Ngày kết thúc"],
    },
    {
      section: "payment",
      label: "Thanh toán",
      fields: ["Tiền thuê hàng tháng", "Tiền đặt cọc"],
    },
    {
      section: "services",
      label: "Phí dịch vụ",
      fields: ["Phí điện", "Phí nước", "Internet", "Phí dịch vụ"],
    },
  ];

  const handleSubmit = () => {
    onSubmit(editRequest);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Yêu cầu chỉnh sửa hợp đồng</h2>

        <div className={styles.formGroup}>
          <label>Phần cần chỉnh sửa:</label>
          <select
            value={editRequest.section}
            onChange={(e) =>
              setEditRequest({ ...editRequest, section: e.target.value })
            }
          >
            <option value="">Chọn phần cần chỉnh sửa</option>
            {editableItems.map((item) => (
              <option key={item.section} value={item.section}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {editRequest.section && (
          <div className={styles.formGroup}>
            <label>Thông tin cụ thể:</label>
            <select
              value={editRequest.details}
              onChange={(e) =>
                setEditRequest({ ...editRequest, details: e.target.value })
              }
            >
              <option value="">Chọn thông tin cần chỉnh sửa</option>
              {editableItems
                .find((item) => item.section === editRequest.section)
                ?.fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Lý do chỉnh sửa:</label>
          <textarea
            value={editRequest.reason}
            onChange={(e) =>
              setEditRequest({ ...editRequest, reason: e.target.value })
            }
            placeholder="Vui lòng nêu rõ lý do cần chỉnh sửa..."
          />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContractModal;
