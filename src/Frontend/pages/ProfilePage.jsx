import { useEffect, useState } from "react";
import axios from "axios"; // Đảm bảo đã cài đặt axios
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
  Bell,
  Wrench,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import styles from "../../Style/ProfilePage.module.scss";
import RoomDetailModal from "../Contexts/RoomDetailModal";
import { useNavigate } from "react-router-dom";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";
import defaultAvatar from "../../assets/cabipara.jpg";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [scrolled, setScrolled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tempData, setTempData] = useState({});
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    idCard: "",
    address: "",
    emergencyContact: "",
    role: "",
    avatar: "",
    memberSince: "",
    totalStay: "",
    rating: 0,
    paymentHistory: {
      onTime: 0,
      late: 0,
      total: 0,
    },
  });
  const [rentalHistory, setRentalHistory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("userToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${CONFIG.API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = response.data;

        // Log để debug dữ liệu profile
        console.log(
          "Profile data received:",
          JSON.stringify(profileData, null, 2)
        );
        console.log("CCCD from profile:", profileData.cccd);
        console.log(
          "ID card from tenant_info:",
          profileData.tenant_info?.id_card_number
        );
        console.log(
          "Tenant info from profile:",
          JSON.stringify(profileData.tenant_info, null, 2)
        );

        // Cập nhật state với dữ liệu từ API, ưu tiên lấy cccd từ user trước
        setUserData({
          fullName: profileData.full_name || "Chưa cập nhật",
          email: profileData.email || "Chưa cập nhật",
          phone: profileData.phone || "Chưa cập nhật",
          idCard:
            profileData.cccd ||
            profileData.tenant_info?.id_card_number ||
            "Chưa cập nhật",
          address:
            profileData.tenant_info?.permanent_address || "Chưa cập nhật",
          emergencyContact:
            profileData.tenant_info?.emergency_contact || "Chưa cập nhật",
          role: profileData.role || "Người dùng",
          avatar: profileData.avatar || "/path/to/default-avatar.png",
          memberSince: profileData.member_since
            ? new Date(profileData.member_since).getFullYear().toString()
            : "Chưa xác định",
          totalStay: `${profileData.stats?.total_stay_months || 0} tháng`,
          rating: profileData.rating || 0,
          paymentHistory: profileData.stats?.payment_history || {
            onTime: 0,
            late: 0,
            total: 0,
          },
        });

        // Cập nhật lịch sử thuê phòng
        setRentalHistory(
          profileData.rental_history?.map((room) => ({
            id: room.id,
            roomNumber: room.room_number || "Chưa xác định",
            period:
              room.start_date && room.end_date
                ? `${new Date(
                    room.start_date
                  ).toLocaleDateString()} - ${new Date(
                    room.end_date
                  ).toLocaleDateString()}`
                : "Chưa xác định",
            status: room.status || "unknown",
            monthlyRent: room.price
              ? `${room.price.toLocaleString()}đ`
              : "Chưa xác định",
            floor: room.floor || "Chưa xác định",
            area: room.area ? `${room.area}m²` : "Chưa xác định",
          })) || []
        );

        // Cập nhật hóa đơn
        setInvoices(
          profileData.invoices
            ?.sort((a, b) => {
              const statusOrder = { pending: 1, late: 2, paid: 3 };
              return statusOrder[a.status] - statusOrder[b.status];
            })
            .map((invoice) => ({
              id: invoice.id,
              month:
                invoice.month && invoice.year
                  ? `Tháng ${invoice.month}/${invoice.year}`
                  : "Chưa xác định",
              total: invoice.total_amount
                ? `${invoice.total_amount.toLocaleString()}đ`
                : "Chưa xác định",
              status: invoice.status || "pending",
              dueDate: invoice.due_date
                ? new Date(invoice.due_date).toLocaleDateString()
                : "Chưa xác định",
              paymentDate: invoice.payment_date
                ? new Date(invoice.payment_date).toLocaleDateString()
                : null,
              breakdown: invoice.services_fee
                ? JSON.parse(invoice.services_fee)
                : {},
            })) || []
        );

        // Cập nhật yêu cầu bảo trì
        setMaintenanceRequests(profileData.maintenance_requests || []);

        // Cập nhật thông báo
        setNotifications(profileData.notifications || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);

        // Xử lý lỗi token
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          localStorage.removeItem("userToken");
          navigate("/login");
          return;
        }

        setError(err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Xử lý scroll (giữ nguyên)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Các hàm xử lý sự kiện (giữ nguyên như cũ)
  const handleEdit = () => {
    setIsEditing(true);
    setTempData({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      idCard: userData.idCard,
      address: userData.address, // Địa chỉ thường trú (permanent_address)
      // Các trường khác nếu cần
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("userToken");

      // Kiểm tra token
      if (!token) {
        showToast("Phiên đăng nhập đã hết hạn", "error");
        navigate("/login");
        return;
      }

      // Chuẩn bị dữ liệu cần cập nhật
      const updateData = {
        full_name: tempData.fullName,
        phone: tempData.phone,
        cccd: tempData.idCard,
        address: tempData.address, // Địa chỉ thường trú
      };

      // Debug: Log dữ liệu trước khi gửi
      console.log("updateData:", updateData);

      // Gọi API cập nhật
      const response = await axios.put(
        `${CONFIG.API_URL}/users/profile-updateUser`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Debug: Log response để kiểm tra
      console.log("API response:", response.data);

      // Trong hàm handleSave
      if (response.data.user) {
        // Kiểm tra xem address có nằm trong updatedFields không
        const addressUpdated = response.data.updatedFields?.includes("address");

        const newUserData = {
          ...userData,
          fullName: response.data.user.full_name || userData.fullName,
          phone: response.data.user.phone || userData.phone,
          idCard: response.data.user.cccd || userData.idCard,
          // Sử dụng giá trị từ tempData nếu đã cập nhật address
          address: addressUpdated ? tempData.address : userData.address,
        };

        console.log("Setting new user data:", newUserData);
        setUserData(newUserData);
      }
      // Hiển thị thông báo thành công
      showToast("Cập nhật thông tin thành công", "success");

      // Thoát chế độ chỉnh sửa
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);

      // Kiểm tra và log chi tiết lỗi
      if (error.response) {
        console.error(
          "Error response:",
          JSON.stringify(error.response.data, null, 2)
        );
        showToast(
          error.response.data?.message || "Lỗi cập nhật thông tin",
          "error"
        );
      } else {
        console.error("Error details:", error.message);
        showToast("Lỗi kết nối. Vui lòng thử lại.", "error");
      }
    }
  };

  const handleAvatarUpload = async (event) => {
    // Thêm input file ẩn để kích hoạt chọn ảnh
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Lấy token từ localStorage
      const token = localStorage.getItem("userToken");
      if (!token) {
        showToast("Phiên đăng nhập đã hết hạn", "error");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await axios.post(
          `${CONFIG.API_URL}/users/upload-avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Cập nhật state hoặc UI với avatar mới
        setUserData((prev) => ({
          ...prev,
          avatar: response.data.avatar,
        }));

        showToast("Cập nhật avatar thành công", "success");
      } catch (error) {
        console.error("Lỗi upload avatar:", error);
        showToast("Lỗi upload avatar", "error");
      }
    };

    // Kích hoạt chọn file
    fileInput.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ánh xạ tên trường để phù hợp với API
    const fieldMappings = {
      fullName: "full_name",
      email: "email",
      phone: "phone",
    };

    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    // Reset các thông báo
    setPasswordError("");
    setPasswordSuccess("");

    // Kiểm tra mật khẩu
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        showToast("Phiên đăng nhập đã hết hạn", "error");
        navigate("/login");
        return;
      }

      // Gọi API đổi mật khẩu
      const response = await axios.put(
        `${CONFIG.API_URL}/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Xử lý kết quả thành công
      showToast("Đổi mật khẩu thành công", "success");

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordSuccess("Mật khẩu đã được thay đổi thành công");
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setPasswordError(error.response.data.message);
        showToast(error.response.data.message, "error");
      } else {
        setPasswordError("Đã xảy ra lỗi khi đổi mật khẩu");
        showToast("Đã xảy ra lỗi khi đổi mật khẩu", "error");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData(userData);
  };

  // Các hàm khác giữ nguyên như ban đầu
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseRoomDetail = () => {
    setSelectedRoom(null);
  };

  // Màu sắc cho biểu đồ
  const COLORS = ["#4f46e5", "#ef4444"];

  // Navigation items
  const navItems = [
    { id: "profile", icon: User, label: "Hồ sơ" },
    { id: "rental", icon: Home, label: "Phòng thuê" },
    { id: "payments", icon: CreditCard, label: "Thanh toán" },
    { id: "maintenance", icon: Wrench, label: "Bảo trì" },
    { id: "notifications", icon: Bell, label: "Thông báo" },
    { id: "password", icon: Lock, label: "Đổi mật khẩu" },
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
              src={userData.avatar || defaultAvatar}
              alt="Ảnh đại diện"
              className={styles.avatar}
            />
            <button
              className={styles.changePhotoButton}
              onClick={handleAvatarUpload}
            >
              Đổi ảnh
            </button>
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
            {/* Họ và tên */}
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
                    maxLength={100} // Giới hạn độ dài
                  />
                ) : (
                  <div className={styles.fieldValue}>{userData.fullName}</div>
                )}
              </div>
            </div>

            {/* Email - Hạn chế chỉnh sửa */}
            <div className={styles.fieldGroup}>
              <Mail className={styles.fieldIcon} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Email</label>
                <div className={styles.fieldValue}>{userData.email}</div>
              </div>
            </div>

            {/* Số điện thoại */}
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
                    pattern="[0-9]{10,11}" // Validate số điện thoại
                    title="Số điện thoại phải có 10-11 chữ số"
                  />
                ) : (
                  <div className={styles.fieldValue}>{userData.phone}</div>
                )}
              </div>
            </div>

            {/* CCCD/CMND */}
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
                    pattern="\d{9}(\d{3})?" // Validate CCCD (9 hoặc 12 số)
                    title="Số CCCD phải có 9 hoặc 12 chữ số"
                  />
                ) : (
                  <div className={styles.fieldValue}>{userData.idCard}</div>
                )}
              </div>
            </div>

            {/* Địa chỉ - Không cho phép chỉnh sửa trực tiếp tại đây */}
            <div className={styles.fieldGroup}>
              <MapPin className={styles.fieldIcon} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Địa chỉ thường trú</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={tempData.address}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    placeholder="Địa chỉ thường trú trên CCCD"
                    maxLength={255}
                  />
                ) : (
                  <div className={styles.fieldValue}>{userData.address}</div>
                )}
              </div>
            </div>

            {/* Liên hệ khẩn cấp - Có thể cần một form riêng để cập nhật */}
            <div className={styles.fieldGroup}>
              <AlertCircle className={styles.fieldIcon} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Liên hệ khẩn cấp</label>
                <div className={styles.fieldValue}>
                  {userData.emergencyContact}
                </div>
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
                  <div className="text-green-600 text-lg font-semibold">
                    {
                      maintenanceRequests.filter(
                        (req) => req.status === "completed"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Đã hoàn thành</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-yellow-600 text-lg font-semibold">
                    {
                      maintenanceRequests.filter(
                        (req) => req.status === "in_progress"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Đang xử lý</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 text-lg font-semibold">
                    {maintenanceRequests.length}
                  </div>
                  <div className="text-sm text-gray-600">Tổng yêu cầu</div>
                </div>
              </div>

              {/* Yêu cầu gần đây */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">Yêu cầu gần đây</h3>
                <div className="space-y-4">
                  {maintenanceRequests.slice(0, 2).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{request.description}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          request.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : request.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status === "completed"
                          ? "Đã xử lý"
                          : request.status === "in_progress"
                          ? "Đang xử lý"
                          : "Chờ xử lý"}
                      </span>
                    </div>
                  ))}
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
                  <div className="text-red-600 text-lg font-semibold">
                    {
                      notifications.filter((n) => n.severity === "urgent")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    Thông báo khẩn cấp
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 text-lg font-semibold">
                    {notifications.filter((n) => !n.is_read).length}
                  </div>
                  <div className="text-sm text-gray-600">Chưa đọc</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-lg font-semibold">
                    {notifications.length}
                  </div>
                  <div className="text-sm text-gray-600">Tổng thông báo</div>
                </div>
              </div>

              {/* Thông báo gần đây */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Thông báo gần đây
                </h3>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-l-4 p-4 rounded-lg ${
                        notification.severity === "urgent"
                          ? "border-red-500 bg-red-50"
                          : notification.severity === "high"
                          ? "border-orange-500 bg-orange-50"
                          : notification.severity === "medium"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-500 bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {notification.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                        {!notification.is_read && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Chưa đọc
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <ActionButtons currentTab={activeTab} />
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className={styles.passwordSection}>
            <div className={styles.formContainer}>
              <h3 className={styles.sectionTitle}>Đổi mật khẩu</h3>

              <div className={styles.formGroup}>
                <label htmlFor="currentPassword" className={styles.formLabel}>
                  Mật khẩu hiện tại
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    className={styles.formInput}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={styles.showPasswordButton}
                  >
                    {showCurrentPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.formLabel}>
                  Mật khẩu mới
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    className={styles.formInput}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={styles.showPasswordButton}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.formLabel}>
                  Xác nhận mật khẩu mới
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className={styles.formInput}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.showPasswordButton}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {passwordData.newPassword !== passwordData.confirmPassword &&
                  passwordData.confirmPassword && (
                    <p className={styles.errorText}>
                      Mật khẩu xác nhận không khớp
                    </p>
                  )}
              </div>

              {passwordError && (
                <div className={styles.errorMessage}>{passwordError}</div>
              )}

              <div className={styles.formActions}>
                <button
                  className={styles.saveButton}
                  onClick={handleChangePassword}
                  disabled={
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                >
                  Lưu thay đổi
                </button>
              </div>
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
