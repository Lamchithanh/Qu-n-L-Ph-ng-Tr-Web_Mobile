import React, { useState, useEffect } from "react";
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
  Star,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../Style/RentalContract.module.scss";
import SignContractModal from "../Contexts/SignContractModal";
import { CONFIG } from "../config/config";

const RentalContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [showSignModal, setShowSignModal] = useState(false);
  const [signStatus, setSignStatus] = useState({
    signing: false,
    success: false,
    error: null,
  });
  const [contractData, setContractData] = useState(null);
  const [expandedTerms, setExpandedTerms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);

  // Mock data - Thay thế bằng API call trong thực tế
  const contractInfo = {
    id: "HD2024-0123",
    status: "pending",
    startDate: "2024-03-01",
    endDate: "2025-03-01",
    room: {
      name: "Phòng trọ cao cấp Central Plaza",
      address: "123 Nguyễn Văn A, Quận 1, TP.HCM",
      type: "Căn hộ mini",
      area: "35m²",
      image:
        "https://www.treehugger.com/thmb/kRiHvAQ9O1FIcHDuRtYm0xw8MsI=/2250x0/filters:no_upscale():max_bytes(150000):strip_icc()/kay-tiny-house-mitchcraft-tiny-homes-2-1fa157dd68144e018300bcc69f602ed2.jpeg",
    },
    tenant: {
      name: "Nguyễn Văn A",
      id: "123456789",
      phone: "0123456789",
      email: "nguyenvana@email.com",
    },
    landlord: {
      name: "Trần Thị B",
      id: "987654321",
      phone: "0987654321",
      email: "landlord@email.com",
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
  };

  const terms = [
    {
      id: 1,
      title: "1. Điều khoản chung",
      content:
        "Hai bên tự nguyện thỏa thuận và cam kết thực hiện đúng các điều khoản sau đây...",
    },
    {
      id: 2,
      title: "2. Thời hạn cho thuê",
      content:
        "Thời hạn thuê nhà là 12 tháng kể từ ngày ký hợp đồng. Có thể gia hạn nếu hai bên đồng ý...",
    },
    {
      id: 3,
      title: "3. Giá thuê và thanh toán",
      content:
        "Giá thuê được thanh toán hàng tháng vào ngày 05. Bao gồm tiền thuê và các chi phí phát sinh...",
    },
    {
      id: 4,
      title: "4. Quyền và nghĩa vụ bên thuê",
      content:
        "Bên thuê có trách nhiệm giữ gìn nhà ở và tài sản trong nhà, thanh toán đúng hạn...",
    },
    {
      id: 5,
      title: "5. Quyền và nghĩa vụ bên cho thuê",
      content:
        "Bên cho thuê có trách nhiệm bảo đảm quyền sử dụng nhà ở, bảo trì sửa chữa khi cần...",
    },
  ];

  const toggleTerm = (termId) => {
    setExpandedTerms((prev) =>
      prev.includes(termId)
        ? prev.filter((id) => id !== termId)
        : [...prev, termId]
    );
  };

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const response = await fetch(`${CONFIG.API_URL}/contracts/${id}`);
        const data = await response.json();
        setContractData(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu hợp đồng:", error);
      }
    };

    fetchContractData();
  }, [id]);

  const handleUpdateInfo = async () => {
    try {
      const response = await fetch(
        `${CONFIG.API_URL}/contracts/${id}/tenant-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editedInfo),
        }
      );

      if (response.ok) {
        setContractData((prev) => ({
          ...prev,
          tenant: editedInfo,
        }));
        setIsEditing(false);
      } else {
        throw new Error("Không thể cập nhật thông tin");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  // Xử lý ký hợp đồng
  const handleSignContract = async () => {
    try {
      setSignStatus({ signing: true, success: false, error: null });

      // 1. Kiểm tra xem tenant đã có tài khoản chưa
      const checkUserResponse = await fetch(
        `${CONFIG.API_URL}/users/check-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: contractData.tenant.email,
          }),
        }
      );
      const checkUserData = await checkUserResponse.json();

      // 2. Nếu chưa có tài khoản, tạo tài khoản mới
      if (!checkUserData.exists) {
        const registerResponse = await fetch(
          `${CONFIG.API_URL}/users/registerFromContract`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: contractData.tenant.name.split(" ")[0].toLowerCase(),
              email: contractData.tenant.email,
              password: contractData.tenant.phone,
              phone: contractData.tenant.phone,
              full_name: contractData.tenant.name,
            }),
          }
        );

        if (!registerResponse.ok) {
          throw new Error("Không thể tạo tài khoản");
        }
      }

      // 3. Cập nhật trạng thái hợp đồng
      const contractResponse = await fetch(
        `${CONFIG.API_URL}/contracts/${id}/sign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!contractResponse.ok) {
        throw new Error("Không thể ký hợp đồng");
      }

      // 4. Nếu thành công, chuyển đến trang thanh toán
      setSignStatus({ signing: false, success: true, error: null });
      navigate("/payment-confirmation", {
        state: {
          contractId: contractData.id,
          amount: contractData.payment.deposit,
        },
      });
    } catch (error) {
      setSignStatus({
        signing: false,
        success: false,
        error: error.message,
      });
    }
  };

  // Các hàm tiện ích
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerRoom}>
          <img src={contractInfo.room.image} alt={contractInfo.room.name} />
          <div className={styles.roomInfo}>
            <h1>{contractInfo.room.name}</h1>
            <div className={styles.roomMeta}>
              <span>
                <Star size={16} className={styles.icon} /> 4.8 (128 đánh giá)
              </span>
              <span>
                <Home size={16} className={styles.icon} />{" "}
                {contractInfo.room.type}
              </span>
              <span>
                <AlertCircle size={16} className={styles.icon} />{" "}
                {contractInfo.room.area}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.contractStatus}>
          <div className={styles.contractId}>
            <FileText size={20} />
            <span>Mã HĐ: {contractInfo.id}</span>
          </div>
          <div className={`${styles.status} ${styles[contractInfo.status]}`}>
            {contractInfo.status === "pending" ? (
              <>
                <Clock size={20} />
                <span>Chờ ký kết</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span>Đã ký kết</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeSection === "overview" ? styles.active : ""
          }`}
          onClick={() => setActiveSection("overview")}
        >
          Tổng quan
        </button>
        <button
          className={`${styles.tab} ${
            activeSection === "terms" ? styles.active : ""
          }`}
          onClick={() => setActiveSection("terms")}
        >
          Điều khoản
        </button>
        <button
          className={`${styles.tab} ${
            activeSection === "payment" ? styles.active : ""
          }`}
          onClick={() => setActiveSection("payment")}
        >
          Thanh toán
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {activeSection === "overview" && (
          <div className={styles.overview}>
            {/* Contract Period */}
            <div className={styles.section}>
              <h2>
                <Calendar size={20} />
                Thời hạn hợp đồng
              </h2>
              <div className={styles.periodGrid}>
                <div className={styles.periodItem}>
                  <span className={styles.label}>Ngày bắt đầu</span>
                  <span className={styles.value}>
                    {formatDate(contractInfo.startDate)}
                  </span>
                </div>
                <div className={styles.periodItem}>
                  <span className={styles.label}>Ngày kết thúc</span>
                  <span className={styles.value}>
                    {formatDate(contractInfo.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Parties Information */}
            <div className={styles.partiesGrid}>
              {/* Tenant Info */}
              {/* Tenant Info */}
              <div className={styles.partyCard}>
                <h2>
                  <User size={20} />
                  Bên thuê
                </h2>
                <div className={styles.partyInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Họ tên:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.name}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, name: e.target.value })
                        }
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.value}>
                        {contractInfo.tenant.name}
                      </span>
                    )}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>CMND/CCCD:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.id}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, id: e.target.value })
                        }
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.value}>
                        {contractInfo.tenant.id}
                      </span>
                    )}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Số điện thoại:</span>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedInfo.phone}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            phone: e.target.value,
                          })
                        }
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.value}>
                        {contractInfo.tenant.phone}
                      </span>
                    )}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedInfo.email}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            email: e.target.value,
                          })
                        }
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.value}>
                        {contractInfo.tenant.email}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <div className={styles.editActions}>
                      <button
                        className={styles.saveBtn}
                        onClick={() => {
                          // Xử lý lưu thông tin
                          setIsEditing(false);
                        }}
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => {
                          setEditedInfo({ ...contractInfo.tenant });
                          setIsEditing(false);
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Landlord Info */}
              <div className={styles.partyCard}>
                <h2>
                  <User size={20} />
                  Bên cho thuê
                </h2>
                <div className={styles.partyInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Họ tên:</span>
                    <span className={styles.value}>
                      {contractInfo.landlord.name}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>CMND/CCCD:</span>
                    <span className={styles.value}>
                      {contractInfo.landlord.id}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Số điện thoại:</span>
                    <span className={styles.value}>
                      {contractInfo.landlord.phone}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>
                      {contractInfo.landlord.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "terms" && (
          <div className={styles.terms}>
            <div className={styles.termsHeader}>
              <h2>Điều khoản hợp đồng</h2>
              <p>Vui lòng đọc kỹ các điều khoản dưới đây trước khi ký kết</p>
            </div>

            <div className={styles.termsList}>
              {terms.map((term) => (
                <div key={term.id} className={styles.termItem}>
                  <div
                    className={styles.termHeader}
                    onClick={() => toggleTerm(term.id)}
                  >
                    <h3>{term.title}</h3>
                    {expandedTerms.includes(term.id) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                  {expandedTerms.includes(term.id) && (
                    <div className={styles.termContent}>{term.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "payment" && (
          <div className={styles.payment}>
            <div className={styles.paymentSummary}>
              <h2>Chi phí thuê</h2>
              <div className={styles.paymentDetails}>
                <div className={styles.paymentItem}>
                  <span className={styles.label}>Tiền thuê hàng tháng</span>
                  <span className={styles.value}>
                    {formatCurrency(contractInfo.payment.rent)}
                  </span>
                </div>
                <div className={styles.paymentItem}>
                  <span className={styles.label}>Tiền đặt cọc</span>
                  <span className={styles.value}>
                    {formatCurrency(contractInfo.payment.deposit)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.serviceCharges}>
              <h2>Phí dịch vụ</h2>
              <div className={styles.serviceList}>
                {contractInfo.payment.services.map((service, index) => (
                  <div key={index} className={styles.serviceItem}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceAmount}>
                      {service.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.downloadBtn}>
          <Download size={20} />
          Tải hợp đồng PDF
        </button>
        {contractInfo.status === "pending" && (
          <>
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(true)}
            >
              <Edit size={20} />
              Cập nhật thông tin cá nhân
            </button>
            <button
              className={styles.signBtn}
              onClick={() => setShowSignModal(true)}
            >
              <FileSignature size={20} />
              Ký hợp đồng ngay
            </button>

            {showSignModal && (
              <SignContractModal
                contractInfo={contractData}
                onClose={() => setShowSignModal(false)}
                onConfirm={handleSignContract}
                signStatus={signStatus}
              />
            )}
          </>
        )}
      </div>

      {/* Notice */}
      <div className={styles.notice}>
        <Shield size={20} />
        <p>
          Hợp đồng này được bảo vệ bởi luật pháp Việt Nam và được xác thực điện
          tử. Mọi thông tin trong hợp đồng đều được mã hóa và lưu trữ an toàn.
        </p>
      </div>
    </div>
  );
};

export default RentalContract;
