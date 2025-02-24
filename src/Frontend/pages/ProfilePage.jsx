import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  CreditCard,
  AlertCircle,
  Home,
  Bell, // Thêm icon mới
  Wrench, // Icon cho yêu cầu bảo trì
} from "lucide-react";
import styles from "../../Style/ProfilePage.module.scss";
import RoomDetailModal from "../Contexts/RoomDetailModal";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [scrolled, setScrolled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tempData, setTempData] = useState({});
  const [userData, setUserData] = useState({
    fullName: "Lê Văn A",
    email: "tenant1@example.com",
    phone: "0901234569",
    idCard: "001301000001",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    emergencyContact: "Lê Văn B - 0909123456",
    role: "người thuê",
    avatar:
      "https://i.pinimg.com/736x/57/33/5b/57335bd4e9e9c0358952aafb375aea8a.jpg",
    memberSince: "2023",
    totalStay: "14 tháng",
    rating: 4.8,
    paymentHistory: {
      onTime: 85,
      late: 15,
      total: 100,
    },
  });

  // Xử lý scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Các hàm xử lý sự kiện
  const handleEdit = () => {
    setIsEditing(true);
    setTempData(userData);
  };

  const handleSave = () => {
    setUserData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý chọn phòng
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  // Hàm đóng modal chi tiết phòng
  const handleCloseRoomDetail = () => {
    setSelectedRoom(null);
  };

  // Màu sắc cho biểu đồ
  const COLORS = ["#4f46e5", "#ef4444"];

  const [rentalHistory] = useState([
    {
      id: 1,
      roomNumber: "102",
      period: "Tháng 1/2024 - Hiện tại",
      status: "current",
      monthlyRent: "3.500.000đ",
      floor: 1,
      area: "30,0m²",
    },
    {
      id: 2,
      roomNumber: "301",
      period: "Tháng 1/2023 - Tháng 12/2023",
      status: "past",
      monthlyRent: "3.400.000đ",
      floor: 3,
      area: "25,5m²",
    },
  ]);

  const [invoices] = useState(
    [
      {
        id: 1,
        month: "Tháng 1/2024",
        total: "4.125.000đ",
        status: "paid",
        dueDate: "05/01/2024",
        paymentDate: "03/01/2024",
        breakdown: {
          rent: "3.500.000đ",
          electricity: "350.000đ",
          water: "75.000đ",
          internet: "200.000đ",
        },
      },
      {
        id: 2,
        month: "Tháng 2/2024",
        total: "4.225.000đ",
        status: "pending",
        dueDate: "05/02/2024",
        breakdown: {
          rent: "3.500.000đ",
          electricity: "420.000đ",
          water: "105.000đ",
          internet: "200.000đ",
        },
      },
    ].sort((a, b) => {
      // Define the order of statuses
      const statusOrder = {
        pending: 1,
        late: 2,
        paid: 3,
      };

      // Sort based on the predefined order
      return statusOrder[a.status] - statusOrder[b.status];
    })
  );

  // Navigation items
  const navItems = [
    { id: "profile", icon: User, label: "Hồ sơ" },
    { id: "rental", icon: Home, label: "Phòng thuê" },
    { id: "payments", icon: CreditCard, label: "Thanh toán" },
    { id: "maintenance", icon: Wrench, label: "Bảo trì" },
    { id: "notifications", icon: Bell, label: "Thông báo" },
  ];

  const statusLabels = {
    current: "Hiện tại",
    past: "Đã kết thúc",
    paid: "Đã thanh toán",
    pending: "Chờ thanh toán",
  };

  const breakdownLabels = {
    rent: "Tiền thuê",
    electricity: "Tiền điện",
    water: "Tiền nước",
    internet: "Tiền mạng",
  };

  // Payment data for chart
  const paymentData = [
    { name: "Đúng hạn", value: userData.paymentHistory.onTime },
    { name: "Trễ hạn", value: userData.paymentHistory.late },
  ];

  const ActionButtons = ({ currentTab }) => {
    const navigate = useNavigate();

    const getButtons = () => {
      switch (currentTab) {
        case "payments":
          return (
            <div className={styles.actionButtonsContainer}>
              <button
                onClick={() => navigate("/BillPayment")}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                <CreditCard className={styles.buttonIcon} />
                Xem chi tiết hóa đơn
              </button>
            </div>
          );

        case "maintenance":
          return (
            <div className={styles.actionButtonsContainer}>
              <button
                onClick={() => navigate("/MaintenanceRequest")}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                <Wrench className={styles.buttonIcon} />
                Tạo yêu cầu bảo trì
              </button>
            </div>
          );

        case "notifications":
          return (
            <div className={styles.actionButtonsContainer}>
              <button
                onClick={() => navigate("/NotificationPage")}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                <Bell className={styles.buttonIcon} />
                Xem tất cả thông báo
              </button>
            </div>
          );

        default:
          return null;
      }
    };

    return getButtons();
  };

  return (
    <div className={styles.profileContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.avatarSection}>
            <img
              src={userData.avatar}
              alt="Ảnh đại diện"
              className={styles.avatar}
            />
            <button className={styles.changePhotoButton}>Đổi ảnh</button>
          </div>

          <div className={styles.userInfo}>
            <h1 className={styles.userName}>{userData.fullName}</h1>
            <p className={styles.userRole}>{userData.role}</p>
            <div className={styles.quickStats}>
              <div className={styles.statItem}>
                <Calendar />
                <span>Thành viên từ {userData.memberSince}</span>
              </div>
              <div className={styles.statItem}>
                <Clock />
                <span>Thời gian thuê: {userData.totalStay}</span>
              </div>
            </div>
          </div>

          <div className={styles.statsCards}>
            <div className={`${styles.statCard} ${styles.primary}`}>
              <div className={styles.statValue}>
                {userData.paymentHistory.total}
              </div>
              <div className={styles.statLabel}>Lần thanh toán</div>
            </div>
            <div className={`${styles.statCard} ${styles.secondary}`}>
              <div className={styles.statValue}>2</div>
              <div className={styles.statLabel}>Phòng</div>
            </div>
            <div className={`${styles.statCard} ${styles.primary}`}>
              <div className={styles.statValue}>{userData.rating}</div>
              <div className={styles.statLabel}>Đánh giá</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <div className={styles.navContainer}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${styles.navItem} ${
                  activeTab === item.id ? styles.activeNav : ""
                }`}
              >
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
                {activeTab === item.id && (
                  <div className={styles.activeIndicator} />
                )}
              </div>
            );
          })}
        </div>

        {activeTab === "profile" && (
          <button
            onClick={isEditing ? handleCancel : handleEdit}
            className={`${styles.editButton} ${isEditing ? styles.cancel : ""}`}
          >
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {activeTab === "profile" && (
          <div className={styles.profileGrid}>
            <div className={styles.fieldGroup}>
              <User className={styles.fieldIcon} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={tempData.fullName}
                    onChange={handleChange}
                    className={styles.fieldInput}
                  />
                ) : (
                  <div className={styles.fieldValue}>{userData.fullName}</div>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <Mail className={styles.fieldIcon} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={tempData.email}
                    onChange={handleChange}
                    className={styles.fieldInput}
                  />
                ) : (
                  <div className={styles.fieldValue}>{userData.email}</div>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <Phone className={styles.fieldIcon} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={tempData.phone}
                    onChange={handleChange}
                    className={styles.fieldInput}
                  />
                ) : (
                  <div className={styles.fieldValue}>{userData.phone}</div>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <CreditCard className={styles.fieldIcon} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>CCCD/CMND</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="idCard"
                    value={tempData.idCard}
                    onChange={handleChange}
                    className={styles.fieldInput}
                  />
                ) : (
                  <div className={styles.fieldValue}>{userData.idCard}</div>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <MapPin className={styles.fieldIcon} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Địa chỉ</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={tempData.address}
                    onChange={handleChange}
                    className={styles.fieldInput}
                  />
                ) : (
                  <div className={styles.fieldValue}>{userData.address}</div>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <AlertCircle className={styles.fieldIcon} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Liên hệ khẩn cấp</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergencyContact"
                    value={tempData.emergencyContact}
                    onChange={handleChange}
                    className={styles.fieldInput}
                  />
                ) : (
                  <div className={styles.fieldValue}>
                    {userData.emergencyContact}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className={styles.actionButtons}>
                <button
                  onClick={handleSave}
                  className={`${styles.button} ${styles.saveButton}`}
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "rental" && (
          <div className={styles.rentalList}>
            {rentalHistory.map((room) => (
              <div
                key={room.id}
                className={styles.rentalCard}
                onClick={() => handleRoomSelect(room)}
              >
                <div className={styles.rentalContent}>
                  <div
                    className={`${styles.roomNumber} ${styles[room.status]}`}
                  >
                    {room.roomNumber}
                  </div>
                  <div className={styles.rentalInfo}>
                    <div className={styles.rentalHeader}>
                      <div>
                        <h3 className={styles.rentalTitle}>
                          Phòng {room.roomNumber}
                        </h3>
                        <p className={styles.rentalPeriod}>{room.period}</p>
                      </div>
                      <span
                        className={`${styles.rentalStatus} ${
                          styles[room.status]
                        }`}
                      >
                        {statusLabels[room.status]}
                      </span>
                    </div>
                    <div className={styles.rentalDetails}>
                      <div className={styles.detailItem}>
                        <span>Giá thuê hàng tháng</span>
                        <span>{room.monthlyRent}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Tầng</span>
                        <span>{room.floor}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Diện tích</span>
                        <span>{room.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "payments" && (
          <div className={styles.paymentsGrid}>
            <div className={styles.paymentChart}>
              <h3 className={styles.chartTitle}>Lịch sử thanh toán</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendDot} ${styles.onTime}`} />
                  <span>Đúng hạn ({userData.paymentHistory.onTime}%)</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendDot} ${styles.late}`} />
                  <span>Trễ hạn ({userData.paymentHistory.late}%)</span>
                </div>
              </div>
            </div>

            <div className={styles.invoiceList}>
              {invoices.map((invoice) => (
                <div key={invoice.id} className={styles.invoiceCard}>
                  <div className={styles.invoiceHeader}>
                    <h4 className={styles.invoiceMonth}>{invoice.month}</h4>
                    <span
                      className={`${styles.invoiceStatus} ${
                        styles[invoice.status]
                      }`}
                    >
                      {statusLabels[invoice.status]}
                    </span>
                  </div>
                  <div className={styles.invoiceAmount}>{invoice.total}</div>
                  <div className={styles.invoiceBreakdown}>
                    {Object.entries(invoice.breakdown).map(([key, value]) => (
                      <div key={key} className={styles.breakdownItem}>
                        <span>{breakdownLabels[key]}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.invoiceDates}>
                    <div>
                      <span>Hạn thanh toán: </span>
                      <span>{invoice.dueDate}</span>
                    </div>
                    {invoice.paymentDate && (
                      <div>
                        <span>Ngày thanh toán: </span>
                        <span>{invoice.paymentDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <ActionButtons currentTab={activeTab} />
          </div>
        )}
        {activeTab === "maintenance" && (
          <div className={styles.maintenanceSection}>
            <div className="space-y-6">
              {/* Thống kê yêu cầu bảo trì */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-600 text-lg font-semibold">2</div>
                  <div className="text-sm text-gray-600">Đã hoàn thành</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-yellow-600 text-lg font-semibold">1</div>
                  <div className="text-sm text-gray-600">Đang xử lý</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 text-lg font-semibold">3</div>
                  <div className="text-sm text-gray-600">Tổng yêu cầu</div>
                </div>
              </div>

              {/* Yêu cầu gần đây */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">Yêu cầu gần đây</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Sửa vòi nước bồn rửa</div>
                      <div className="text-sm text-gray-500">20/02/2024</div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Đã xử lý
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        Thay bóng đèn phòng khách
                      </div>
                      <div className="text-sm text-gray-500">18/02/2024</div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Đang xử lý
                    </span>
                  </div>
                </div>
              </div>

              <ActionButtons currentTab={activeTab} />
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className={styles.notificationsSection}>
            <div className="space-y-6">
              {/* Thống kê thông báo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-red-600 text-lg font-semibold">1</div>
                  <div className="text-sm text-gray-600">
                    Thông báo khẩn cấp
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 text-lg font-semibold">2</div>
                  <div className="text-sm text-gray-600">Chưa đọc</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-lg font-semibold">5</div>
                  <div className="text-sm text-gray-600">Tổng thông báo</div>
                </div>
              </div>

              {/* Thông báo gần đây */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Thông báo gần đây
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg">
                    <div className="font-medium">Thanh Toán Quá Hạn</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Hóa đơn tiền phòng tháng này chưa được thanh toán
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Hôm nay</div>
                  </div>
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
                    <div className="font-medium">Hợp Đồng Mới</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Bạn có một hợp đồng thuê phòng mới cần ký kết ngay
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Hôm qua</div>
                  </div>
                </div>
              </div>

              <ActionButtons currentTab={activeTab} />
            </div>
          </div>
        )}
      </div>

      {selectedRoom && (
        <RoomDetailModal room={selectedRoom} onClose={handleCloseRoomDetail} />
      )}
    </div>
  );
};

export default ProfilePage;
