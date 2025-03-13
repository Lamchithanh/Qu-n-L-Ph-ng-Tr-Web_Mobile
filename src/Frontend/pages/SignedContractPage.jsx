import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Calendar,
  User,
  Home,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  FileSignature,
  Clock,
  Shield,
  X,
  Info,
  Search,
  DollarSign,
  ArrowRight,
  Check,
  CreditCard,
  Zap,
  MapPin,
  PhoneCall,
  Mail,
  Award,
  QrCode,
  Building2,
} from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../../Style/SignedContract.module.scss";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";
import MaQR from "../../assets/VCB_QR.png";

// Hàm tạo mã hợp đồng từ ID
const formatContractId = (id) => {
  return `HD${id.toString().padStart(4, "0")}`;
};

const SignedContractPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { id: contractId } = useParams();

  // State management
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedTerms, setExpandedTerms] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Fetch contract data
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setLoading(true);
        // Thay thế API call thực với dữ liệu mẫu
        // Trong triển khai thực tế, bạn sẽ gọi API thực ở đây
        // const response = await fetch(`${CONFIG.API_URL}/contracts/${contractId}`);
        // const result = await response.json();

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockContract = {
          id: contractId || "1001",
          display_code: formatContractId(contractId || "1001"),
          status: "active",
          startDate: "2023-10-01",
          endDate: "2024-10-01",
          room: {
            id: 101,
            name: "Căn hộ Riverside Garden",
            number: "A303",
            address: "123 Nguyễn Văn Linh, Quận Ninh Kiều, TP. Cần Thơ",
            area: "45m²",
            image:
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            type: "Căn hộ mini",
          },
          tenant: {
            id: 1001,
            name: "Nguyễn Văn A",
            phone: "0903123456",
            email: "nguyenvana@example.com",
            id_card: "079203000123",
            address: "456 Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          landlord: {
            id: 501,
            name: "Trần Thị B",
            phone: "0909888777",
            email: "tranthib@example.com",
            id_card: "079203000456",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          },
          payment: {
            rent: 5000000,
            deposit: 10000000,
            services: [
              { name: "Phí điện", amount: "3,500 VNĐ/kWh" },
              { name: "Phí nước", amount: "25,000 VNĐ/m³" },
              { name: "Internet", amount: "200,000 VNĐ/tháng" },
              { name: "Phí dịch vụ", amount: "200,000 VNĐ/tháng" },
            ],
          },
          terms: [
            {
              id: 1,
              title: "1. Điều khoản chung",
              content:
                "Hai bên tự nguyện thỏa thuận và cam kết thực hiện đúng các điều khoản trong hợp đồng thuê phòng này.",
            },
            {
              id: 2,
              title: "2. Thời hạn cho thuê",
              content: `Thời hạn thuê phòng từ 01/10/2023 đến 01/10/2024. Hợp đồng có thể gia hạn nếu hai bên đồng ý.`,
            },
            {
              id: 3,
              title: "3. Giá thuê và thanh toán",
              content: `Giá thuê phòng là 5.000.000 VNĐ/tháng. Tiền đặt cọc là 10.000.000 VNĐ.`,
            },
            {
              id: 4,
              title: "4. Trách nhiệm của bên thuê",
              content:
                "Bên thuê có trách nhiệm giữ gìn, bảo quản phòng ở và tài sản trong phòng, thanh toán đúng hạn, tuân thủ nội quy chung.",
            },
            {
              id: 5,
              title: "5. Trách nhiệm của bên cho thuê",
              content:
                "Bên cho thuê có trách nhiệm bảo đảm chất lượng phòng ở, đảm bảo quyền sử dụng hợp pháp, sửa chữa kịp thời các hư hỏng không do lỗi của bên thuê.",
            },
          ],
          activities: [
            {
              id: 1,
              date: "01/10/2023",
              action: "Ký kết hợp đồng",
              status: "completed",
            },
            {
              id: 2,
              date: "01/10/2023",
              action: "Thanh toán tiền cọc",
              status: "completed",
            },
            {
              id: 3,
              date: "01/11/2023",
              action: "Thanh toán tiền thuê tháng 11/2023",
              status: "completed",
            },
            {
              id: 4,
              date: "01/12/2023",
              action: "Thanh toán tiền thuê tháng 12/2023",
              status: "completed",
            },
            {
              id: 5,
              date: "01/01/2024",
              action: "Thanh toán tiền thuê tháng 01/2024",
              status: "completed",
            },
          ],
        };

        // Mock service history
        const mockServiceHistory = [
          {
            id: 1,
            month: "10/2023",
            electricity: {
              previous: 0,
              current: 150,
              usage: 150,
              price: 3500,
              total: 525000,
            },
            water: {
              previous: 0,
              current: 5,
              usage: 5,
              price: 25000,
              total: 125000,
            },
            internet: 200000,
            service: 200000,
            total: 1050000,
            status: "paid",
            date: "01/11/2023",
          },
          {
            id: 2,
            month: "11/2023",
            electricity: {
              previous: 150,
              current: 330,
              usage: 180,
              price: 3500,
              total: 630000,
            },
            water: {
              previous: 5,
              current: 11,
              usage: 6,
              price: 25000,
              total: 150000,
            },
            internet: 200000,
            service: 200000,
            total: 1180000,
            status: "paid",
            date: "01/12/2023",
          },
          {
            id: 3,
            month: "12/2023",
            electricity: {
              previous: 330,
              current: 530,
              usage: 200,
              price: 3500,
              total: 700000,
            },
            water: {
              previous: 11,
              current: 18,
              usage: 7,
              price: 25000,
              total: 175000,
            },
            internet: 200000,
            service: 200000,
            total: 1275000,
            status: "paid",
            date: "01/01/2024",
          },
          {
            id: 4,
            month: "01/2024",
            electricity: {
              previous: 530,
              current: 720,
              usage: 190,
              price: 3500,
              total: 665000,
            },
            water: {
              previous: 18,
              current: 24,
              usage: 6,
              price: 25000,
              total: 150000,
            },
            internet: 200000,
            service: 200000,
            total: 1215000,
            status: "paid",
            date: "01/02/2024",
          },
        ];

        // Mock payment history
        const mockPaymentHistory = [
          {
            id: 1,
            date: "01/10/2023",
            amount: 10000000,
            purpose: "Tiền đặt cọc",
            status: "paid",
          },
          {
            id: 2,
            date: "01/10/2023",
            amount: 5000000,
            purpose: "Tiền thuê tháng 10/2023",
            status: "paid",
          },
          {
            id: 3,
            date: "01/11/2023",
            amount: 5000000,
            purpose: "Tiền thuê tháng 11/2023",
            status: "paid",
          },
          {
            id: 4,
            date: "01/12/2023",
            amount: 5000000,
            purpose: "Tiền thuê tháng 12/2023",
            status: "paid",
          },
          {
            id: 5,
            date: "01/01/2024",
            amount: 5000000,
            purpose: "Tiền thuê tháng 01/2024",
            status: "paid",
          },
          {
            id: 6,
            date: "01/02/2024",
            amount: 5000000,
            purpose: "Tiền thuê tháng 02/2024",
            status: "pending",
            dueDate: "05/02/2024",
          },
        ];

        setContract(mockContract);
        setServiceHistory(mockServiceHistory);
        setPaymentHistory(mockPaymentHistory);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu hợp đồng:", error);
        setError("Không thể tải thông tin hợp đồng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchContractData();
  }, [contractId]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Toggle term expansion
  const toggleTerm = (id) => {
    if (expandedTerms.includes(id)) {
      setExpandedTerms(expandedTerms.filter((termId) => termId !== id));
    } else {
      setExpandedTerms([...expandedTerms, id]);
    }
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case "active":
        return styles.statusActive;
      case "pending":
        return styles.statusPending;
      case "terminated":
        return styles.statusTerminated;
      case "expired":
        return styles.statusExpired;
      case "paid":
        return styles.statusPaid;
      case "completed":
        return styles.statusCompleted;
      default:
        return styles.statusDefault;
    }
  };

  // Get status name
  const getStatusName = (status) => {
    switch (status) {
      case "active":
        return "Đang hiệu lực";
      case "pending":
        return "Chờ thanh toán";
      case "terminated":
        return "Đã hủy";
      case "expired":
        return "Đã hết hạn";
      case "paid":
        return "Đã thanh toán";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  // Handle payment
  const handlePayment = () => {
    navigate("/payment-confirmation", {
      state: {
        contractId: contract.id,
        amount: contract.payment.rent,
        displayCode: contract.display_code,
        roomId: contract.room.id,
      },
    });
  };

  // Handle download contract
  const handleDownloadContract = () => {
    showToast("Đang chuẩn bị tải hợp đồng PDF...", "info");
    // Trong triển khai thực tế, bạn sẽ gọi API để tải PDF
    setTimeout(() => {
      showToast("Tải hợp đồng thành công", "success");
    }, 1500);
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className={styles.loadingState}>
      <div className={styles.spinner}></div>
      <p>Đang tải thông tin hợp đồng...</p>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className={styles.errorState}>
      <AlertCircle size={64} className={styles.errorIcon} />
      <h2>Đã có lỗi xảy ra</h2>
      <p>{error}</p>
      <div className={styles.actions}>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <Search size={64} className={styles.emptyIcon} />
      <h2>Không tìm thấy hợp đồng</h2>
      <p>Hợp đồng không tồn tại hoặc đã bị xóa</p>
      <div className={styles.actions}>
        <button onClick={() => navigate("/")} className={styles.primaryButton}>
          <Home size={20} />
          Quay về trang chủ
        </button>
      </div>
    </div>
  );

  if (loading) {
    return renderLoadingState();
  }

  if (error) {
    return renderErrorState();
  }

  if (!contract) {
    return renderEmptyState();
  }
  return (
    <div className={styles.container}>
      {/* Loading, Error và Empty states */}
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Đang tải thông tin hợp đồng...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <AlertCircle size={64} className={styles.errorIcon} />
          <h2>Đã có lỗi xảy ra</h2>
          <p>{error}</p>
          <div className={styles.actions}>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {!loading && !error && !contract && (
        <div className={styles.emptyState}>
          <Search size={64} className={styles.emptyIcon} />
          <h2>Không tìm thấy hợp đồng</h2>
          <p>Hợp đồng không tồn tại hoặc đã bị xóa</p>
          <div className={styles.actions}>
            <button
              onClick={() => navigate("/")}
              className={styles.primaryButton}
            >
              <Home size={20} />
              Quay về trang chủ
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && contract && (
        <>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerTitle}>
                <FileText size={24} className={styles.icon} />
                <div>
                  <h1>Chi tiết hợp đồng</h1>
                  <p>Mã hợp đồng: {contract.display_code}</p>
                </div>
              </div>

              <div className={styles.headerActions}>
                <div
                  className={`${styles.status} ${getStatusColorClass(
                    contract.status
                  )}`}
                >
                  {contract.status === "active" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span>{getStatusName(contract.status)}</span>
                </div>

                <button
                  className={styles.downloadButton}
                  onClick={handleDownloadContract}
                >
                  <Download size={18} />
                  Tải PDF
                </button>
              </div>
            </div>
          </div>

          {/* Room Info Card */}
          <div className={styles.roomCard}>
            <div className={styles.roomImageContainer}>
              <img
                src={contract.room.image}
                alt={contract.room.name}
                className={styles.roomImage}
              />
              <div className={styles.roomImageOverlay}>
                <span className={styles.roomType}>{contract.room.type}</span>
              </div>
            </div>

            <div className={styles.roomContent}>
              <div className={styles.roomHeader}>
                <h2>{contract.room.name}</h2>
                <div className={styles.roomAddress}>
                  <MapPin size={16} className={styles.icon} />
                  <span>{contract.room.address}</span>
                </div>
                <div className={styles.roomDetails}>
                  <Home size={16} className={styles.icon} />
                  <span>
                    Phòng số: {contract.room.number} | Diện tích:{" "}
                    {contract.room.area}
                  </span>
                </div>
              </div>

              <div className={styles.contractPeriodGrid}>
                <div className={styles.contractPeriodItem}>
                  <div className={styles.label}>Thời hạn hợp đồng</div>
                  <div className={styles.periodValues}>
                    <div className={styles.periodDate}>
                      <Calendar size={16} className={styles.icon} />
                      <span>{formatDate(contract.startDate)}</span>
                    </div>
                    <ArrowRight size={16} className={styles.arrowIcon} />
                    <div className={styles.periodDate}>
                      <Calendar size={16} className={styles.icon} />
                      <span>{formatDate(contract.endDate)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.contractPeriodItem}>
                  <div className={styles.label}>Thanh toán hàng tháng</div>
                  <div className={styles.paymentValue}>
                    <div className={styles.amount}>
                      <DollarSign size={16} className={styles.icon} />
                      <span>{formatCurrency(contract.payment.rent)}</span>
                    </div>
                    <span className={styles.paymentType}>Tiền thuê</span>
                  </div>
                </div>
              </div>

              <div className={styles.servicesList}>
                <div className={styles.serviceItem}>
                  <Zap size={14} className={styles.icon} />
                  <span>Điện: 3,500 VNĐ/kWh</span>
                </div>
                <div className={styles.serviceItem}>
                  <Zap size={14} className={styles.icon} />
                  <span>Nước: 25,000 VNĐ/m³</span>
                </div>
                <div className={styles.serviceItem}>
                  <Zap size={14} className={styles.icon} />
                  <span>Internet: 200,000 VNĐ/tháng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeSection === "overview" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("overview")}
            >
              <FileText size={16} />
              <span>Tổng quan</span>
            </button>
            <button
              className={`${styles.tab} ${
                activeSection === "parties" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("parties")}
            >
              <User size={16} />
              <span>Các bên</span>
            </button>
            <button
              className={`${styles.tab} ${
                activeSection === "terms" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("terms")}
            >
              <FileSignature size={16} />
              <span>Điều khoản</span>
            </button>
            <button
              className={`${styles.tab} ${
                activeSection === "payments" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("payments")}
            >
              <CreditCard size={16} />
              <span>Thanh toán</span>
            </button>
          </div>

          {/* Content based on active section */}
          <div className={styles.content}>
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className={styles.overviewGrid}>
                <div className={styles.activityTimeline}>
                  <div className={styles.sectionHeader}>
                    <h3>
                      <Calendar size={18} className={styles.icon} />
                      Lịch sử hoạt động
                    </h3>
                  </div>
                  <div className={styles.timelineContent}>
                    {contract.activities.map((activity, index) => (
                      <div key={activity.id} className={styles.timelineItem}>
                        <div className={styles.timelineLine}></div>
                        <div
                          className={`${styles.timelineDot} ${
                            activity.status === "completed"
                              ? styles.completed
                              : ""
                          }`}
                        ></div>
                        <div className={styles.timelineInfo}>
                          <div className={styles.timelineHeader}>
                            <div className={styles.timelineAction}>
                              {activity.action}
                            </div>
                            <div className={styles.timelineDate}>
                              {activity.date}
                            </div>
                          </div>
                          <div className={styles.timelineStatus}>
                            {activity.status === "completed" && (
                              <span className={styles.completedBadge}>
                                <Check size={12} />
                                Hoàn thành
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.sideInfo}>
                  <div className={styles.paymentInfoCard}>
                    <div className={styles.sectionHeader}>
                      <h3>
                        <DollarSign size={18} className={styles.icon} />
                        Thông tin thanh toán
                      </h3>
                    </div>
                    <div className={styles.paymentDetails}>
                      <div className={styles.paymentRow}>
                        <span className={styles.paymentLabel}>
                          Tiền thuê hàng tháng
                        </span>
                        <span className={styles.paymentValue}>
                          {formatCurrency(contract.payment.rent)}
                        </span>
                      </div>
                      <div className={styles.paymentRow}>
                        <span className={styles.paymentLabel}>
                          Tiền đặt cọc
                        </span>
                        <span className={styles.paymentValue}>
                          {formatCurrency(contract.payment.deposit)}
                        </span>
                      </div>
                      <div className={styles.paymentDivider}></div>
                      <div
                        className={`${styles.paymentRow} ${styles.nextPayment}`}
                      >
                        <span className={styles.paymentLabel}>
                          Thanh toán tiếp theo
                        </span>
                        <span className={styles.paymentValue}>
                          {formatCurrency(contract.payment.rent)}
                        </span>
                      </div>
                      <div className={styles.paymentDueDate}>
                        Hạn thanh toán: 05/02/2024
                      </div>
                    </div>
                  </div>

                  <div className={styles.contractStatusCard}>
                    <div className={styles.sectionHeader}>
                      <h3>
                        <Award size={18} className={styles.icon} />
                        Trạng thái hợp đồng
                      </h3>
                    </div>
                    <div className={styles.statusList}>
                      <div className={styles.statusItem}>
                        <CheckCircle size={16} className={styles.statusIcon} />
                        <span>Hợp đồng đã được ký kết</span>
                      </div>
                      <div className={styles.statusItem}>
                        <CheckCircle size={16} className={styles.statusIcon} />
                        <span>Đã thanh toán tiền đặt cọc</span>
                      </div>
                      <div className={styles.statusItem}>
                        <CheckCircle size={16} className={styles.statusIcon} />
                        <span>Đã thanh toán tiền thuê tháng 1/2024</span>
                      </div>
                      <div className={styles.statusItem}>
                        <Clock
                          size={16}
                          className={`${styles.statusIcon} ${styles.pending}`}
                        />
                        <span>Đến hạn thanh toán tháng 2/2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Parties Section */}
            {activeSection === "parties" && (
              <div className={styles.partiesGrid}>
                <div className={styles.partyCard}>
                  <div className={styles.partyHeader}>
                    <div className={styles.partyAvatar}>
                      <img
                        src={contract.tenant.avatar}
                        alt={contract.tenant.name}
                      />
                    </div>
                    <div className={styles.partyTitle}>
                      <h3>Bên thuê</h3>
                      <p>Thông tin người thuê</p>
                    </div>
                  </div>
                  <div className={styles.partyContent}>
                    <div className={styles.infoItem}>
                      <User size={20} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>Họ và tên</div>
                        <div className={styles.infoValue}>
                          {contract.tenant.name}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <FileText size={20} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>CMND/CCCD</div>
                        <div className={styles.infoValue}>
                          {contract.tenant.id_card}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <PhoneCall size={20} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>Số điện thoại</div>
                        <div className={styles.infoValue}>
                          {contract.tenant.phone}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <Mail size={20} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>Email</div>
                        <div className={styles.infoValue}>
                          {contract.tenant.email}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <MapPin size={20} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>
                          Địa chỉ thường trú
                        </div>
                        <div className={styles.infoValue}>
                          {contract.tenant.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.partyCard}>
                  <div className={styles.partyHeader}>
                    <div className={styles.partyAvatar}>
                      <img
                        src={contract.landlord.avatar}
                        alt={contract.landlord.name}
                      />
                    </div>
                    <div className={styles.partyTitle}>
                      <h3>Bên cho thuê</h3>
                      <p>Thông tin chủ nhà</p>
                    </div>
                  </div>
                  <div className={styles.partyContent}>
                    <div className={styles.infoItem}>
                      <User size={20} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>Họ và tên</div>
                        <div className={styles.infoValue}>
                          {contract.landlord.name}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <FileText size={20} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>CMND/CCCD</div>
                        <div className={styles.infoValue}>
                          {contract.landlord.id_card}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <PhoneCall size={20} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>Số điện thoại</div>
                        <div className={styles.infoValue}>
                          {contract.landlord.phone}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <Mail size={20} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>Email</div>
                        <div className={styles.infoValue}>
                          {contract.landlord.email}
                        </div>
                      </div>
                    </div>

                    <div className={styles.contactAction}>
                      <div className={styles.contactLabel}>
                        Thông tin liên hệ
                      </div>
                      <button className={styles.contactButton}>
                        <PhoneCall size={16} />
                        Liên hệ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terms Section */}
            {activeSection === "terms" && (
              <div className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <h3>
                    <FileSignature size={20} className={styles.icon} />
                    Điều khoản hợp đồng
                  </h3>
                  <p>Các điều khoản đã được hai bên thống nhất và ký kết</p>
                </div>

                <div className={styles.termsList}>
                  {contract.terms.map((term) => (
                    <div key={term.id} className={styles.termItem}>
                      <div
                        className={`${styles.termHeader} ${
                          expandedTerms.includes(term.id) ? styles.expanded : ""
                        }`}
                        onClick={() => toggleTerm(term.id)}
                      >
                        <h3>{term.title}</h3>
                        {expandedTerms.includes(term.id) ? (
                          <ChevronUp size={20} className={styles.termIcon} />
                        ) : (
                          <ChevronDown size={20} className={styles.termIcon} />
                        )}
                      </div>

                      {expandedTerms.includes(term.id) && (
                        <div className={styles.termContent}>
                          <p>{term.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.termsFooter}>
                  <Shield size={20} className={styles.icon} />
                  <p>
                    Hợp đồng này được bảo vệ bởi luật pháp Việt Nam và được xác
                    thực điện tử. Mọi thông tin trong hợp đồng đều được mã hóa
                    và lưu trữ an toàn.
                  </p>
                </div>
              </div>
            )}

            {/* Payments Section */}
            {activeSection === "payments" && (
              <div className={styles.paymentsSection}>
                <div className={styles.paymentsGrid}>
                  <div className={styles.paymentHistoryCard}>
                    <div className={styles.sectionHeader}>
                      <h3>
                        <CreditCard size={20} className={styles.icon} />
                        Lịch sử thanh toán
                      </h3>
                    </div>
                    <div className={styles.paymentHistoryTable}>
                      <table>
                        <thead>
                          <tr>
                            <th>Ngày</th>
                            <th>Nội dung</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((payment) => (
                            <tr key={payment.id}>
                              <td>{payment.date}</td>
                              <td>{payment.purpose}</td>
                              <td className={styles.paymentAmount}>
                                {formatCurrency(payment.amount)}
                              </td>
                              <td>
                                <div className={styles.paymentStatus}>
                                  {payment.status === "paid" ? (
                                    <span className={styles.statusPaid}>
                                      <CheckCircle size={14} />
                                      Đã thanh toán
                                    </span>
                                  ) : (
                                    <span className={styles.statusPending}>
                                      <Clock size={14} />
                                      Chờ thanh toán
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={styles.serviceUsageCard}>
                    <div className={styles.sectionHeader}>
                      <h3>
                        <Zap size={20} className={styles.icon} />
                        Sử dụng dịch vụ
                      </h3>
                    </div>
                    <div className={styles.serviceUsageTable}>
                      <table>
                        <thead>
                          <tr>
                            <th>Tháng</th>
                            <th>Điện (kWh)</th>
                            <th>Nước (m³)</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {serviceHistory.map((service) => (
                            <tr key={service.id}>
                              <td>{service.month}</td>
                              <td>
                                <div className={styles.usageValue}>
                                  {service.electricity.usage} kWh
                                </div>
                                <div className={styles.usageDetails}>
                                  {service.electricity.previous} →{" "}
                                  {service.electricity.current}
                                </div>
                              </td>
                              <td>
                                <div className={styles.usageValue}>
                                  {service.water.usage} m³
                                </div>
                                <div className={styles.usageDetails}>
                                  {service.water.previous} →{" "}
                                  {service.water.current}
                                </div>
                              </td>
                              <td className={styles.paymentAmount}>
                                {formatCurrency(service.total)}
                              </td>
                              <td>
                                <div className={styles.paymentStatus}>
                                  {service.status === "paid" ? (
                                    <span className={styles.statusPaid}>
                                      <CheckCircle size={14} />
                                      Đã thanh toán
                                    </span>
                                  ) : (
                                    <span className={styles.statusPending}>
                                      <Clock size={14} />
                                      Chờ thanh toán
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={styles.nextPaymentCard}>
                    <div className={styles.cardHeader}>
                      <CreditCard size={20} className={styles.icon} />
                      <h3>Thanh toán tiếp theo</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.nextPaymentInfo}>
                        <div className={styles.nextPaymentLabel}>
                          Tháng 02/2024
                        </div>
                        <div className={styles.nextPaymentAmount}>
                          {formatCurrency(5000000)}
                        </div>
                      </div>

                      <div className={styles.nextPaymentDueDate}>
                        <span>Hạn thanh toán</span>
                        <span>05/02/2024</span>
                      </div>

                      <button
                        className={styles.payNowButton}
                        onClick={handlePayment}
                      >
                        Thanh toán ngay
                      </button>
                    </div>
                  </div>

                  <div className={styles.paymentInfoCard}>
                    <div className={styles.cardHeader}>
                      <Info size={18} className={styles.icon} />
                      <h3>Thông tin thanh toán</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.bankInfo}>
                        <div className={styles.bankInfoItem}>
                          <div className={styles.bankInfoLabel}>
                            Tên ngân hàng
                          </div>
                          <div className={styles.bankInfoValue}>
                            Vietcombank
                          </div>
                        </div>

                        <div className={styles.bankInfoItem}>
                          <div className={styles.bankInfoLabel}>
                            Số tài khoản
                          </div>
                          <div className={styles.bankInfoValue}>
                            <span>9981911449</span>
                            <button
                              className={styles.copyButton}
                              onClick={() => {
                                navigator.clipboard.writeText("9981911449");
                                showToast(
                                  "Đã sao chép số tài khoản",
                                  "success"
                                );
                              }}
                            >
                              <span>Sao chép</span>
                            </button>
                          </div>
                        </div>

                        <div className={styles.bankInfoItem}>
                          <div className={styles.bankInfoLabel}>
                            Chủ tài khoản
                          </div>
                          <div className={styles.bankInfoValue}>
                            DANG LAM CHI THANH
                          </div>
                        </div>

                        <div className={styles.bankInfoItem}>
                          <div className={styles.bankInfoLabel}>
                            Nội dung chuyển khoản
                          </div>
                          <div className={styles.transferContent}>
                            <div className={styles.transferCode}>
                              DATCOC {contract.display_code}
                            </div>
                            <button
                              className={styles.copyButton}
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `DATCOC ${contract.display_code}`
                                );
                                showToast(
                                  "Đã sao chép nội dung chuyển khoản",
                                  "success"
                                );
                              }}
                            >
                              <span>Sao chép</span>
                            </button>
                          </div>
                        </div>

                        <button
                          className={styles.qrCodeButton}
                          onClick={() => setShowQRCode(!showQRCode)}
                        >
                          <QrCode size={16} />
                          {showQRCode ? "Ẩn mã QR" : "Hiển thị mã QR"}
                        </button>

                        {showQRCode && (
                          <div className={styles.qrCodeContainer}>
                            <img
                              src={MaQR}
                              alt="QR Code"
                              className={styles.qrCode}
                            />
                            <div className={styles.qrCodeNote}>
                              Quét mã để thanh toán
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer section with additional actions */}
          <div className={styles.footer}>
            <div className={styles.footerInfo}>
              <Shield size={20} className={styles.icon} />
              <p>
                Mọi thông tin của bạn đều được bảo mật theo quy định pháp luật.
              </p>
            </div>

            <div className={styles.footerActions}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  if (
                    window.confirm(
                      "Bạn có chắc chắn muốn yêu cầu hủy hợp đồng?"
                    )
                  ) {
                    showToast("Yêu cầu hủy hợp đồng đã được gửi", "info");
                  }
                }}
              >
                <X size={16} />
                Yêu cầu hủy hợp đồng
              </button>

              <button
                className={styles.extendButton}
                onClick={() => {
                  showToast("Yêu cầu gia hạn đã được gửi", "info");
                }}
              >
                <Edit size={16} />
                Yêu cầu gia hạn
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignedContractPage;
