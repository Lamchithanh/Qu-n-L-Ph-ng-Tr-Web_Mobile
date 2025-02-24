import { useState } from "react";
import {
  Home,
  Calendar,
  DollarSign,
  Ruler,
  ArrowRight,
  X,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  FileText,
  Camera,
} from "lucide-react";
import styles from "../../Style/RoomDetailModal.module.scss";

const RoomDetailModal = ({ room, onClose }) => {
  // State for active sub-section
  const [activeSection, setActiveSection] = useState("details");

  // If no room is selected, return null
  if (!room) return null;

  // Render different sections based on active tab
  const renderSection = () => {
    switch (activeSection) {
      case "details":
        return (
          <div className={styles.detailSection}>
            <h3>Chi tiết cơ bản</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <Calendar />
                <div>
                  <span className={styles.detailLabel}>Thời gian thuê</span>
                  <span className={styles.detailValue}>{room.period}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <DollarSign />
                <div>
                  <span className={styles.detailLabel}>
                    Giá thuê hàng tháng
                  </span>
                  <span className={styles.detailValue}>{room.monthlyRent}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <Ruler />
                <div>
                  <span className={styles.detailLabel}>Diện tích</span>
                  <span className={styles.detailValue}>{room.area}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <Home />
                <div>
                  <span className={styles.detailLabel}>Tầng</span>
                  <span className={styles.detailValue}>{room.floor}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className={styles.documentsSection}>
            <h3>Tài liệu và hợp đồng</h3>
            <div className={styles.documentList}>
              <div className={styles.documentItem}>
                <FileText />
                <div>
                  <span>Hợp đồng thuê phòng</span>
                  <button className={styles.downloadButton}>Tải xuống</button>
                </div>
              </div>
              <div className={styles.documentItem}>
                <Camera />
                <div>
                  <span>Biên bản bàn giao</span>
                  <button className={styles.downloadButton}>Tải xuống</button>
                </div>
              </div>
            </div>
          </div>
        );

      case "maintenance":
        return (
          <div className={styles.maintenanceSection}>
            <h3>Yêu cầu bảo trì</h3>
            <div className={styles.maintenanceList}>
              <div className={styles.maintenanceItem}>
                <div className={styles.maintenanceHeader}>
                  <span>Sửa điều hòa</span>
                  <span className={`${styles.statusBadge} ${styles.pending}`}>
                    Chờ xử lý
                  </span>
                </div>
                <p>Điều hòa phòng không mát, cần kiểm tra và sửa chữa</p>
                <span className={styles.maintenanceDate}>
                  Ngày yêu cầu: 15/01/2024
                </span>
              </div>
              <div className={styles.maintenanceItem}>
                <div className={styles.maintenanceHeader}>
                  <span>Thay bóng đèn</span>
                  <span className={`${styles.statusBadge} ${styles.completed}`}>
                    Đã hoàn thành
                  </span>
                </div>
                <p>Thay thế bóng đèn tại khu vực phòng ngủ</p>
                <span className={styles.maintenanceDate}>
                  Ngày hoàn thành: 20/12/2023
                </span>
              </div>
            </div>
            <button className={styles.newRequestButton}>
              <AlertCircle /> Báo sự cố mới
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X />
        </button>

        <div className={styles.modalHeader}>
          <Home className={styles.headerIcon} />
          <h2>Chi tiết phòng {room.roomNumber}</h2>
        </div>

        {/* Navigation for sub-sections */}
        <div className={styles.modalNavigation}>
          <button
            className={activeSection === "details" ? styles.activeNav : ""}
            onClick={() => setActiveSection("details")}
          >
            <CheckCircle /> Chi tiết
          </button>
          <button
            className={activeSection === "documents" ? styles.activeNav : ""}
            onClick={() => setActiveSection("documents")}
          >
            <FileText /> Tài liệu
          </button>
          <button
            className={activeSection === "maintenance" ? styles.activeNav : ""}
            onClick={() => setActiveSection("maintenance")}
          >
            <MessageCircle /> Bảo trì
          </button>
        </div>

        {/* Dynamic section rendering */}
        {renderSection()}

        <div className={styles.actionButtons}>
          <button className={styles.primaryButton}>Gia hạn hợp đồng</button>
          <button className={styles.secondaryButton}>Báo sự cố</button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;
