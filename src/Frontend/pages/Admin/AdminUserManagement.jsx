import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  User,
  Shield,
  Lock,
  Unlock,
  LogOut,
  Key,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Home,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  FileText,
} from "lucide-react";

const AdminUserManagement = () => {
  // State quản lý danh sách tài khoản
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    verified: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // State cho modal chi tiết người dùng
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  // State cho modal xác nhận khóa/mở khóa
  const [showLockModal, setShowLockModal] = useState(false);
  const [userToLock, setUserToLock] = useState(null);
  const [lockReason, setLockReason] = useState("");

  // State cho modal xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // State cho modal phân quyền
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showError, setShowError] = useState(false);

  // State cho modal lịch sử hoạt động
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [userActivity, setUserActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Các loại vai trò
  const roles = [
    {
      id: "admin",
      name: "Admin",
      description: "Quản trị viên hệ thống - toàn quyền",
    },
    {
      id: "staff",
      name: "Nhân viên",
      description: "Nhân viên quản lý - quyền hạn chế",
    },
    {
      id: "landlord",
      name: "Chủ trọ",
      description: "Chủ nhà trọ - quản lý phòng & hợp đồng",
    },
    {
      id: "tenant",
      name: "Người thuê",
      description: "Người thuê phòng - quyền hạn cơ bản",
    },
    {
      id: "landlord_pending",
      name: "Chủ trọ đang chờ",
      description: "Chủ trọ đang chờ xác minh",
    },
  ];

  // Quyền hạn cho từng vai trò
  const permissions = {
    admin: [
      "Quản lý tài khoản",
      "Quản lý phân quyền",
      "Quản lý phòng trọ",
      "Quản lý hợp đồng",
      "Quản lý hóa đơn",
      "Quản lý thanh toán",
      "Xuất báo cáo",
      "Cấu hình hệ thống",
      "Quản lý nội dung",
      "Gửi thông báo",
    ],
    staff: [
      "Xem tài khoản",
      "Quản lý phòng trọ",
      "Quản lý hợp đồng",
      "Quản lý hóa đơn",
      "Quản lý thanh toán",
      "Xuất báo cáo",
    ],
    landlord: [
      "Quản lý phòng trọ (của mình)",
      "Quản lý hợp đồng (của mình)",
      "Quản lý hóa đơn (của mình)",
      "Quản lý thanh toán (của mình)",
      "Xem báo cáo (của mình)",
    ],
    tenant: [
      "Xem phòng trọ",
      "Xem hợp đồng (của mình)",
      "Xem & thanh toán hóa đơn (của mình)",
      "Đánh giá phòng trọ",
    ],
    landlord_pending: ["Xem phòng trọ", "Cập nhật hồ sơ xác minh"],
  };

  // Giả lập dữ liệu
  useEffect(() => {
    setTimeout(() => {
      const mockUsers = Array(50)
        .fill()
        .map((_, index) => {
          // Xác định vai trò dựa trên index để phân bố đều
          let role;
          if (index < 5) {
            role = "admin";
          } else if (index < 10) {
            role = "staff";
          } else if (index < 30) {
            role = "landlord";
          } else if (index < 35) {
            role = "landlord_pending";
          } else {
            role = "tenant";
          }

          // Tạo ngày đăng ký ngẫu nhiên trong 1 năm gần đây
          const registrationDate = new Date();
          registrationDate.setDate(
            registrationDate.getDate() - Math.floor(Math.random() * 365)
          );

          // Tên người dùng ngẫu nhiên
          const firstNames = [
            "Nguyễn",
            "Trần",
            "Lê",
            "Phạm",
            "Hoàng",
            "Huỳnh",
            "Phan",
            "Vũ",
            "Võ",
            "Đặng",
            "Bùi",
            "Đỗ",
            "Hồ",
            "Ngô",
            "Dương",
            "Lý",
          ];
          const lastNames = [
            "Văn",
            "Thị",
            "Đức",
            "Quang",
            "Minh",
            "Thanh",
            "Hồng",
            "Tuấn",
            "Hải",
            "Anh",
            "Ngọc",
            "Đình",
            "Kim",
            "Hà",
            "Huy",
            "Thành",
          ];
          const endNames = [
            "An",
            "Bình",
            "Cường",
            "Dũng",
            "Em",
            "Phúc",
            "Giang",
            "Hùng",
            "Ích",
            "Khang",
            "Long",
            "Mạnh",
            "Nam",
            "Oanh",
            "Phương",
            "Quân",
            "Sơn",
            "Tuấn",
            "Uyên",
            "Vinh",
          ];

          const firstName =
            firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName =
            lastNames[Math.floor(Math.random() * lastNames.length)];
          const endName = endNames[Math.floor(Math.random() * endNames.length)];
          const fullName = `${firstName} ${lastName} ${endName}`;

          const username = `${endName.toLowerCase()}${firstName
            .charAt(0)
            .toLowerCase()}${lastName.charAt(0).toLowerCase()}${index}`;

          // Email ngẫu nhiên
          const email = `${username}@example.com`;

          // Số điện thoại ngẫu nhiên
          const phone = `09${Math.floor(Math.random() * 10)}${Math.floor(
            Math.random() * 10
          )}${Math.floor(Math.random() * 10)}${Math.floor(
            Math.random() * 10
          )}${Math.floor(Math.random() * 10)}${Math.floor(
            Math.random() * 10
          )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;

          // Trạng thái ngẫu nhiên
          const status = Math.random() > 0.9 ? false : true;

          // Trạng thái xác minh ngẫu nhiên
          const verified = Math.random() > 0.2 ? true : false;

          // Thống kê ngẫu nhiên cho landlord và tenant
          let stats = null;
          if (role === "landlord" || role === "landlord_pending") {
            stats = {
              totalProperties: Math.floor(Math.random() * 5) + 1,
              totalRooms: Math.floor(Math.random() * 20) + 1,
              occupiedRooms: Math.floor(Math.random() * 15),
              totalContracts: Math.floor(Math.random() * 15),
              totalRevenue: Math.floor(Math.random() * 100000000) + 5000000,
              averageRating: (3 + Math.random() * 2).toFixed(1),
            };
          } else if (role === "tenant") {
            stats = {
              currentContract: Math.random() > 0.3,
              rentHistory: Math.floor(Math.random() * 5),
              paymentOnTime: Math.floor(Math.random() * 100),
              totalReviews: Math.floor(Math.random() * 5),
              reportCount: Math.floor(Math.random() * 2),
            };
          }

          // Xác định nếu có ghi chú đặc biệt
          const hasNote = Math.random() > 0.8;
          const note = hasNote
            ? "Người dùng có một số vấn đề trong thanh toán gần đây. Cần theo dõi thêm."
            : "";

          // Ngày khóa tài khoản (nếu bị khóa)
          const lockDate = !status
            ? new Date(
                new Date().setDate(
                  new Date().getDate() - Math.floor(Math.random() * 30)
                )
              )
            : null;
          const lockReason = !status
            ? "Vi phạm điều khoản sử dụng dịch vụ - đăng tải nội dung không phù hợp"
            : null;

          return {
            id: `user_${index + 1}`,
            username,
            email,
            phone,
            full_name: fullName,
            role,
            status,
            verified,
            registration_date: registrationDate.toISOString().split("T")[0],
            last_login: status
              ? new Date(
                  new Date().setDate(
                    new Date().getDate() - Math.floor(Math.random() * 10)
                  )
                ).toISOString()
              : null,
            avatar: `https://i.pravatar.cc/150?u=${index}`,
            stats,
            note,
            lock_date: lockDate ? lockDate.toISOString().split("T")[0] : null,
            lock_reason: lockReason,
            created_by: "system",
            created_at: registrationDate.toISOString().split("T")[0],
            updated_at: registrationDate.toISOString().split("T")[0],
          };
        });

      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc người dùng theo điều kiện search và filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filters.role === "all" || user.role === filters.role;

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && user.status) ||
      (filters.status === "locked" && !user.status);

    const matchesVerified =
      filters.verified === "all" ||
      (filters.verified === "yes" && user.verified) ||
      (filters.verified === "no" && !user.verified);

    return matchesSearch && matchesRole && matchesStatus && matchesVerified;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handler cho việc tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handler cho việc lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Handler xem chi tiết người dùng
  const handleViewUser = (user) => {
    setDetailUser(user);
    setShowDetailModal(true);
  };

  // Handler mở modal khóa/mở khóa tài khoản
  const handleOpenLockModal = (user) => {
    setUserToLock(user);
    setLockReason(user.lock_reason || "");
    setShowLockModal(true);
  };

  // Handler khóa/mở khóa tài khoản
  const handleToggleLockUser = () => {
    setUsers(
      users.map((user) => {
        if (user.id === userToLock.id) {
          const newStatus = !user.status;
          return {
            ...user,
            status: newStatus,
            lock_date: !newStatus
              ? new Date().toISOString().split("T")[0]
              : null,
            lock_reason: !newStatus ? lockReason : null,
            updated_at: new Date().toISOString().split("T")[0],
          };
        }
        return user;
      })
    );
    setShowLockModal(false);

    // Nếu đang xem chi tiết người dùng đó, cập nhật thông tin chi tiết
    if (detailUser && detailUser.id === userToLock.id) {
      const newStatus = !detailUser.status;
      setDetailUser({
        ...detailUser,
        status: newStatus,
        lock_date: !newStatus ? new Date().toISOString().split("T")[0] : null,
        lock_reason: !newStatus ? lockReason : null,
        updated_at: new Date().toISOString().split("T")[0],
      });
    }
  };

  // Handler mở modal xóa tài khoản
  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Handler xóa tài khoản
  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    setShowDeleteModal(false);

    // Nếu đang xem chi tiết người dùng đó, đóng modal chi tiết
    if (detailUser && detailUser.id === userToDelete.id) {
      setShowDetailModal(false);
    }
  };

  // Handler mở modal phân quyền
  const handleOpenRoleModal = (user) => {
    setUserToChangeRole(user);
    setSelectedRole(user.role);
    setAdminPassword("");
    setShowError(false);
    setShowRoleModal(true);
  };

  // Handler thay đổi quyền
  const handleChangeRole = () => {
    // Kiểm tra mật khẩu admin
    if (adminPassword !== "admin123") {
      setShowError(true);
      return;
    }

    setUsers(
      users.map((user) => {
        if (user.id === userToChangeRole.id) {
          return {
            ...user,
            role: selectedRole,
            updated_at: new Date().toISOString().split("T")[0],
          };
        }
        return user;
      })
    );
    setShowRoleModal(false);

    // Nếu đang xem chi tiết người dùng đó, cập nhật thông tin chi tiết
    if (detailUser && detailUser.id === userToChangeRole.id) {
      setDetailUser({
        ...detailUser,
        role: selectedRole,
        updated_at: new Date().toISOString().split("T")[0],
      });
    }
  };

  // Handler xem lịch sử hoạt động
  const handleViewActivity = (user) => {
    setLoadingActivity(true);
    // Giả lập gọi API lấy lịch sử hoạt động
    setTimeout(() => {
      const mockActivity = Array(20)
        .fill()
        .map((_, index) => {
          // Tạo ngày hoạt động ngẫu nhiên trong 30 ngày gần đây
          const activityDate = new Date();
          activityDate.setDate(
            activityDate.getDate() - Math.floor(Math.random() * 30)
          );

          // Loại hoạt động ngẫu nhiên
          const activityTypes = [
            {
              type: "login",
              description: "Đăng nhập vào hệ thống",
              icon: "LogIn",
            },
            {
              type: "logout",
              description: "Đăng xuất khỏi hệ thống",
              icon: "LogOut",
            },
            {
              type: "create_listing",
              description: "Tạo phòng trọ mới",
              icon: "Home",
            },
            {
              type: "update_listing",
              description: "Cập nhật thông tin phòng trọ",
              icon: "Edit",
            },
            {
              type: "create_contract",
              description: "Tạo hợp đồng mới",
              icon: "FileText",
            },
            {
              type: "payment",
              description: "Thanh toán hóa đơn",
              icon: "DollarSign",
            },
            { type: "review", description: "Đánh giá phòng trọ", icon: "Star" },
            {
              type: "profile_update",
              description: "Cập nhật thông tin cá nhân",
              icon: "User",
            },
            {
              type: "password_change",
              description: "Thay đổi mật khẩu",
              icon: "Key",
            },
            {
              type: "notification",
              description: "Đọc thông báo",
              icon: "Bell",
            },
          ];

          const activity =
            activityTypes[Math.floor(Math.random() * activityTypes.length)];
          const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
            Math.random() * 255
          )}`;
          const device = [
            "Desktop Chrome",
            "Mobile Safari",
            "Desktop Firefox",
            "Mobile Chrome",
            "Desktop Edge",
          ][Math.floor(Math.random() * 5)];

          return {
            id: `activity_${index + 1}`,
            user_id: user.id,
            type: activity.type,
            description: activity.description,
            details:
              activity.type === "login"
                ? `Đăng nhập từ ${device}`
                : activity.type === "payment"
                ? `Thanh toán hóa đơn #INV-${
                    1000 + Math.floor(Math.random() * 1000)
                  }`
                : activity.type === "create_listing"
                ? `Tạo phòng trọ mới: Phòng ${
                    101 + Math.floor(Math.random() * 100)
                  }`
                : "",
            ip_address: ip,
            device: device,
            created_at: activityDate.toISOString(),
            icon: activity.icon,
          };
        });

      // Sắp xếp theo thời gian giảm dần
      mockActivity.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setUserActivity(mockActivity);
      setLoadingActivity(false);
    }, 500);

    setShowActivityModal(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý tài khoản & Phân quyền
        </h1>
        <p className="text-gray-600">
          Quản lý tài khoản người dùng, phân quyền và giám sát hoạt động
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Bộ lọc */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Vai trò:</label>
              <select
                name="role"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Trạng thái:</label>
              <select
                name="status"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="locked">Đã khóa</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Xác minh:</label>
              <select
                name="verified"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.verified}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="yes">Đã xác minh</option>
                <option value="no">Chưa xác minh</option>
              </select>
            </div>

            {/* Nút thêm người dùng */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
              onClick={() =>
                alert("Chức năng thêm người dùng sẽ được phát triển sau")
              }
            >
              <UserPlus size={16} className="mr-2" />
              Thêm người dùng
            </button>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số tài khoản</p>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Hoạt động: {users.filter((user) => user.status).length} | Khóa:{" "}
            {users.filter((user) => !user.status).length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chủ trọ</p>
              <p className="text-2xl font-bold text-indigo-600">
                {users.filter((user) => user.role === "landlord").length}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Home className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Đang chờ duyệt:{" "}
            {users.filter((user) => user.role === "landlord_pending").length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Người thuê</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter((user) => user.role === "tenant").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <User className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Đã xác minh:{" "}
            {
              users.filter((user) => user.role === "tenant" && user.verified)
                .length
            }
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quản trị viên</p>
              <p className="text-2xl font-bold text-red-600">
                {
                  users.filter(
                    (user) => user.role === "admin" || user.role === "staff"
                  ).length
                }
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Shield className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Admin: {users.filter((user) => user.role === "admin").length} | Nhân
            viên: {users.filter((user) => user.role === "staff").length}
          </div>
        </div>
      </div>

      {/* Danh sách người dùng */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            Không tìm thấy người dùng nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xác minh
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((user) => {
                  // Xác định màu và văn bản cho vai trò
                  let roleColor;
                  switch (user.role) {
                    case "admin":
                      roleColor = "bg-red-100 text-red-800";
                      break;
                    case "staff":
                      roleColor = "bg-purple-100 text-purple-800";
                      break;
                    case "landlord":
                      roleColor = "bg-indigo-100 text-indigo-800";
                      break;
                    case "landlord_pending":
                      roleColor = "bg-blue-100 text-blue-800";
                      break;
                    default:
                      roleColor = "bg-green-100 text-green-800";
                  }

                  const roleName =
                    roles.find((r) => r.id === user.role)?.name || user.role;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="h-10 w-10 rounded-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail size={14} className="mr-1 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone size={14} className="mr-1 text-gray-400" />
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColor}`}
                        >
                          {roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.status ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <Lock size={14} className="mr-1" />
                            Đã khóa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.verified ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" />
                            Đã xác minh
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <AlertCircle size={14} className="mr-1" />
                            Chưa xác minh
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {new Date(user.registration_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenRoleModal(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Phân quyền"
                          >
                            <Shield size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenLockModal(user)}
                            className="text-orange-600 hover:text-orange-900"
                            title={
                              user.status
                                ? "Khóa tài khoản"
                                : "Mở khóa tài khoản"
                            }
                          >
                            {user.status ? (
                              <Lock size={18} />
                            ) : (
                              <Unlock size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleViewActivity(user)}
                            className="text-green-600 hover:text-green-900"
                            title="Xem hoạt động"
                          >
                            <Activity size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa tài khoản"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{filteredUsers.length}</span>{" "}
                  người dùng
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === i + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      } text-sm font-medium`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết người dùng */}
      {showDetailModal && detailUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết người dùng
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Thông tin cơ bản */}
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center mb-4">
                    <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                      <img
                        src={detailUser.avatar}
                        alt={detailUser.username}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {detailUser.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      @{detailUser.username}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          detailUser.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : detailUser.role === "staff"
                            ? "bg-purple-100 text-purple-800"
                            : detailUser.role === "landlord"
                            ? "bg-indigo-100 text-indigo-800"
                            : detailUser.role === "landlord_pending"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {roles.find((r) => r.id === detailUser.role)?.name ||
                          detailUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Thông tin cá nhân
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-3 h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">
                          {detailUser.email}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-3 h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">
                          {detailUser.phone}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">
                          Đăng ký:{" "}
                          {new Date(
                            detailUser.registration_date
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {detailUser.last_login && (
                        <div className="flex items-center text-sm">
                          <Clock className="mr-3 h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">
                            Truy cập gần nhất:{" "}
                            {new Date(detailUser.last_login).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Trạng thái tài khoản
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Trạng thái:
                        </span>
                        {detailUser.status ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" /> Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <Lock size={14} className="mr-1" /> Đã khóa
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Xác minh:</span>
                        {detailUser.verified ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" /> Đã xác
                            minh
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <AlertCircle size={14} className="mr-1" /> Chưa xác
                            minh
                          </span>
                        )}
                      </div>
                      {!detailUser.status && detailUser.lock_date && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-600">
                            Ngày khóa:{" "}
                            {new Date(detailUser.lock_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                          {detailUser.lock_reason && (
                            <span className="text-sm text-red-600 mt-1">
                              Lý do: {detailUser.lock_reason}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="md:col-span-2">
                  {/* Quyền hạn */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Quyền hạn
                      </h4>
                      <button
                        onClick={() => handleOpenRoleModal(detailUser)}
                        className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 flex items-center"
                      >
                        <Shield size={14} className="mr-1" />
                        Thay đổi quyền
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions[detailUser.role]?.map(
                        (permission, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm"
                          >
                            <Check size={16} className="mr-2 text-green-500" />
                            <span>{permission}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Thống kê */}
                  {detailUser.stats && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Thống kê
                      </h4>

                      {detailUser.role === "landlord" ||
                      detailUser.role === "landlord_pending" ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">Tổng số nhà</p>
                            <p className="text-xl font-bold text-indigo-600">
                              {detailUser.stats.totalProperties}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">
                              Tổng số phòng
                            </p>
                            <p className="text-xl font-bold text-indigo-600">
                              {detailUser.stats.totalRooms}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">
                              Phòng đã thuê
                            </p>
                            <p className="text-xl font-bold text-indigo-600">
                              {detailUser.stats.occupiedRooms}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">Hợp đồng</p>
                            <p className="text-xl font-bold text-indigo-600">
                              {detailUser.stats.totalContracts}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">
                              Tổng doanh thu
                            </p>
                            <p className="text-xl font-bold text-indigo-600">
                              {detailUser.stats.totalRevenue.toLocaleString()} đ
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">
                              Đánh giá trung bình
                            </p>
                            <div className="flex items-center">
                              <p className="text-xl font-bold text-yellow-500 mr-1">
                                {detailUser.stats.averageRating}
                              </p>
                              <Star
                                size={16}
                                className="text-yellow-500 fill-yellow-500"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        detailUser.role === "tenant" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <p className="text-xs text-gray-500">
                                Hợp đồng hiện tại
                              </p>
                              <p className="text-xl font-bold text-green-600">
                                {detailUser.stats.currentContract
                                  ? "Có"
                                  : "Không"}
                              </p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <p className="text-xs text-gray-500">
                                Lịch sử thuê
                              </p>
                              <p className="text-xl font-bold text-green-600">
                                {detailUser.stats.rentHistory} phòng
                              </p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <p className="text-xs text-gray-500">
                                Thanh toán đúng hạn
                              </p>
                              <p className="text-xl font-bold text-green-600">
                                {detailUser.stats.paymentOnTime}%
                              </p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <p className="text-xs text-gray-500">
                                Số lượng đánh giá
                              </p>
                              <p className="text-xl font-bold text-green-600">
                                {detailUser.stats.totalReviews}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Ghi chú */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Ghi chú
                    </h4>
                    <textarea
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Thêm ghi chú về người dùng này..."
                      defaultValue={detailUser.note}
                    ></textarea>
                  </div>

                  {/* Nút tác vụ */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleViewActivity(detailUser)}
                      className="px-4 py-2 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 flex items-center"
                    >
                      <Activity size={16} className="mr-2" />
                      Xem hoạt động
                    </button>
                    <button
                      onClick={() => handleOpenLockModal(detailUser)}
                      className={`px-4 py-2 ${
                        detailUser.status
                          ? "text-red-600 bg-red-100 hover:bg-red-200"
                          : "text-green-600 bg-green-100 hover:bg-green-200"
                      } rounded-md flex items-center`}
                    >
                      {detailUser.status ? (
                        <>
                          <Lock size={16} className="mr-2" />
                          Khóa tài khoản
                        </>
                      ) : (
                        <>
                          <Unlock size={16} className="mr-2" />
                          Mở khóa tài khoản
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(detailUser)}
                      className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal khóa/mở khóa tài khoản */}
      {showLockModal && userToLock && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {userToLock.status ? "Khóa tài khoản" : "Mở khóa tài khoản"}
              </h2>
              <button
                onClick={() => setShowLockModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
                    <img
                      src={userToLock.avatar}
                      alt={userToLock.username}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {userToLock.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{userToLock.username}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  {userToLock.status ? (
                    <p>
                      Bạn đang chuẩn bị khóa tài khoản này. Người dùng sẽ không
                      thể đăng nhập hoặc sử dụng hệ thống cho đến khi được mở
                      khóa.
                    </p>
                  ) : (
                    <p>
                      Bạn đang chuẩn bị mở khóa tài khoản này. Người dùng sẽ có
                      thể đăng nhập và sử dụng hệ thống trở lại.
                    </p>
                  )}
                </div>
              </div>

              {userToLock.status && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do khóa tài khoản
                  </label>
                  <textarea
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nhập lý do khóa tài khoản..."
                    value={lockReason}
                    onChange={(e) => setLockReason(e.target.value)}
                  ></textarea>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLockModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleToggleLockUser}
                  className={`px-4 py-2 ${
                    userToLock.status
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded-md flex items-center`}
                >
                  {userToLock.status ? (
                    <>
                      <Lock size={16} className="mr-2" />
                      Khóa tài khoản
                    </>
                  ) : (
                    <>
                      <Unlock size={16} className="mr-2" />
                      Mở khóa tài khoản
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa tài khoản */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Xác nhận xóa tài khoản
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <AlertCircle size={20} className="text-red-600 mr-3" />
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Cảnh báo:</span> Hành động này
                    không thể hoàn tác. Tất cả dữ liệu người dùng sẽ bị xóa vĩnh
                    viễn.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
                    <img
                      src={userToDelete.avatar}
                      alt={userToDelete.username}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {userToDelete.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{userToDelete.username}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <p>Email: {userToDelete.email}</p>
                  <p>
                    Vai trò:{" "}
                    {roles.find((r) => r.id === userToDelete.role)?.name ||
                      userToDelete.role}
                  </p>
                  <p>
                    Đăng ký:{" "}
                    {new Date(
                      userToDelete.registration_date
                    ).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    id="confirm-delete"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="confirm-delete"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Tôi xác nhận muốn xóa tài khoản này và hiểu rằng hành động
                    này không thể hoàn tác.
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal phân quyền */}
      {showRoleModal && userToChangeRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Phân quyền người dùng
              </h2>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <Shield size={20} className="text-blue-600 mr-3" />
                  <p className="text-sm text-blue-700">
                    Thay đổi quyền cho người dùng{" "}
                    <span className="font-medium">
                      {userToChangeRole.full_name}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò hiện tại
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      userToChangeRole.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : userToChangeRole.role === "staff"
                        ? "bg-purple-100 text-purple-800"
                        : userToChangeRole.role === "landlord"
                        ? "bg-indigo-100 text-indigo-800"
                        : userToChangeRole.role === "landlord_pending"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {roles.find((r) => r.id === userToChangeRole.role)?.name ||
                      userToChangeRole.role}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò mới
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác thực Admin
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu admin của bạn"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setShowError(false);
                  }}
                  className={`w-full p-2 border ${
                    showError ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                />
                {showError && (
                  <p className="mt-1 text-xs text-red-600">
                    Mật khẩu không chính xác. Vui lòng thử lại.
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  * Chỉ Admin cấp cao mới có thể thay đổi quyền người dùng.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleChangeRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Shield size={16} className="mr-2" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal lịch sử hoạt động */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Lịch sử hoạt động
              </h2>
              <button
                onClick={() => setShowActivityModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {loadingActivity ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : userActivity.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  Không có hoạt động nào được ghi nhận.
                </div>
              ) : (
                <div className="space-y-6">
                  {userActivity.map((activity) => {
                    let icon;
                    switch (activity.icon) {
                      case "LogIn":
                        icon = <LogOut size={16} className="text-green-500" />;
                        break;
                      case "LogOut":
                        icon = <LogOut size={16} className="text-red-500" />;
                        break;
                      case "FileText":
                        icon = <FileText size={16} className="text-blue-500" />;
                        break;
                      case "Home":
                        icon = <Home size={16} className="text-indigo-500" />;
                        break;
                      case "Edit":
                        icon = <Edit size={16} className="text-purple-500" />;
                        break;
                      case "User":
                        icon = <User size={16} className="text-gray-500" />;
                        break;
                      case "Key":
                        icon = <Key size={16} className="text-yellow-500" />;
                        break;
                      default:
                        icon = <Activity size={16} className="text-blue-500" />;
                    }

                    return (
                      <div
                        key={activity.id}
                        className="border-l-2 border-gray-200 pl-4 hover:border-blue-500"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-white rounded-full p-1 -ml-6 border-2 border-gray-200">
                            {icon}
                          </div>
                          <div className="ml-3">
                            <div className="flex items-center">
                              <h4 className="text-sm font-medium text-gray-900">
                                {activity.description}
                              </h4>
                              <span className="ml-2 text-xs font-medium text-gray-500">
                                {new Date(
                                  activity.created_at
                                ).toLocaleDateString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {activity.details && (
                              <p className="mt-1 text-sm text-gray-600">
                                {activity.details}
                              </p>
                            )}
                            <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
                              <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                                IP: {activity.ip_address}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                                {activity.device}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
