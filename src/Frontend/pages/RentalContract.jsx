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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(true);
        const response = await fetch(`${CONFIG.API_URL}/contracts/${id}`);

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin hợp đồng");
        }

        const result = await response.json();

        if (result.success) {
          setContractData(result.data);
          setEditedInfo({
            name: result.data.tenant.name,
            id: result.data.tenant.id,
            phone: result.data.tenant.phone,
            email: result.data.tenant.email,
          });
        } else {
          throw new Error(result.message || "Không thể lấy thông tin hợp đồng");
        }
      } catch (error) {
        setError(error.message);
        console.error("Lỗi khi lấy dữ liệu hợp đồng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id]);

  const [serviceUsages, setServiceUsages] = useState([]);

  useEffect(() => {
    const fetchServiceUsages = async () => {
      try {
        const response = await fetch(
          `${CONFIG.API_URL}/contracts/${id}/service-usages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Response status:", response.status);
        const result = await response.json();
        console.log("Service usages result:", result);

        if (response.ok) {
          if (result.success) {
            setServiceUsages(result.data);
          }
        } else {
          console.error("Lỗi khi lấy dữ liệu dịch vụ:", result);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
      }
    };

    if (contractData) {
      fetchServiceUsages();
    }
  }, [contractData, id]);

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
        const result = await response.json();
        if (result.success) {
          // Cập nhật dữ liệu hợp đồng với thông tin đã cập nhật
          setContractData((prev) => ({
            ...prev,
            tenant: {
              ...prev.tenant,
              name: editedInfo.name,
              id: editedInfo.id,
              phone: editedInfo.phone,
              email: editedInfo.email,
            },
          }));
          setIsEditing(false);
        } else {
          throw new Error(result.message || "Không thể cập nhật thông tin");
        }
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

      const contractResult = await contractResponse.json();

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

  if (loading) {
    return <div className={styles.loading}>Đang tải thông tin hợp đồng...</div>;
  }

  if (error) {
    return <div className={styles.error}>Lỗi: {error}</div>;
  }

  if (!contractData) {
    return (
      <div className={styles.error}>Không tìm thấy thông tin hợp đồng</div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerRoom}>
          <img src={contractData.room.image} alt={contractData.room.name} />
          <div className={styles.roomInfo}>
            <h1>{contractData.room.name}</h1>
            <div className={styles.roomMeta}>
              <span>
                <Home size={16} className={styles.icon} />{" "}
                {contractData.room.type}
              </span>
              <span>
                <AlertCircle size={16} className={styles.icon} />{" "}
                {contractData.room.area}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.contractStatus}>
          <div className={styles.contractId}>
            <FileText size={20} />
            <span>Mã HĐ: {contractData.id}</span>
          </div>
          <div className={`${styles.status} ${styles[contractData.status]}`}>
            {contractData.status === "pending" ? (
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
                    {formatDate(contractData.startDate)}
                  </span>
                </div>
                <div className={styles.periodItem}>
                  <span className={styles.label}>Ngày kết thúc</span>
                  <span className={styles.value}>
                    {formatDate(contractData.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Parties Information */}
            <div className={styles.partiesGrid}>
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
                        {contractData.tenant.name}
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
                        {contractData.tenant.id}
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
                        {contractData.tenant.phone}
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
                        {contractData.tenant.email}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <div className={styles.editActions}>
                      <button
                        className={styles.saveBtn}
                        onClick={handleUpdateInfo}
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => {
                          setEditedInfo({
                            name: contractData.tenant.name,
                            id: contractData.tenant.id,
                            phone: contractData.tenant.phone,
                            email: contractData.tenant.email,
                          });
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
                      {contractData.landlord.name}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>CMND/CCCD:</span>
                    <span className={styles.value}>
                      {contractData.landlord.id}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Số điện thoại:</span>
                    <span className={styles.value}>
                      {contractData.landlord.phone}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>
                      {contractData.landlord.email}
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
              {contractData.terms &&
                contractData.terms.map((term) => (
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
                    {formatCurrency(contractData.payment.rent)}
                    <span className={styles.discountNote}>
                      (Tháng đầu giảm 10%:{" "}
                      {formatCurrency(contractData.payment.rent * 0.9)})
                    </span>
                  </span>
                </div>
                <div className={styles.paymentItem}>
                  <span className={styles.label}>Tiền đặt cọc</span>
                  <span className={styles.value}>
                    {formatCurrency(contractData.payment.deposit)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.serviceCharges}>
              <h2>Phí dịch vụ</h2>
              <div className={styles.serviceList}>
                {serviceUsages.length > 0 ? (
                  serviceUsages.map((service) => (
                    <div key={service.id} className={styles.serviceItem}>
                      <span className={styles.serviceName}>
                        {service.name}
                        {service.previous_reading &&
                          service.current_reading && (
                            <span className={styles.usageDetails}>
                              ({service.previous_reading} -{" "}
                              {service.current_reading})
                            </span>
                          )}
                      </span>
                      <span className={styles.serviceAmount}>
                        {formatCurrency(service.total_amount)}
                        <span className={styles.priceUnit}>
                          /{service.price_unit}
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={styles.noServiceData}>
                    Không có dữ liệu dịch vụ cho kỳ này
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.downloadBtn}>
          <Download size={20} />
          Tải hợp đồng PDF
        </button>
        {contractData.status === "pending" && (
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
