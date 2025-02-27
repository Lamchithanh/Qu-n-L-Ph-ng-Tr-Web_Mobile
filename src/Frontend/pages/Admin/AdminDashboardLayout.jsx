import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  FileText,
  Grid,
  DollarSign,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PieChart,
  UserCheck,
  CreditCard,
} from "lucide-react";

const AdminDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Thông tin người dùng admin (giả lập)
  const user = {
    name: "Super Admin",
    email: "superadmin@thuededay.com",
    avatar: "/api/placeholder/40/40",
    role: "Quản Trị Viên Cao Cấp",
    unreadNotifications: 5,
  };

  // Menu điều hướng cho super admin
  const navigationMenu = [
    {
      title: "Tổng quan",
      path: "/admin",
      icon: <PieChart size={20} />,
    },
    {
      title: "Quản lý chủ trọ",
      path: "/admin/landlords",
      icon: <UserCheck size={20} />,
    },
    {
      title: "Quản lý phòng trọ",
      path: "/admin/rooms",
      icon: <Home size={20} />,
    },
    {
      title: "Quản lý hợp đồng",
      path: "/admin/contracts",
      icon: <FileText size={20} />,
    },
    {
      title: "Quản lý dịch vụ",
      path: "/admin/services",
      icon: <Grid size={20} />,
    },
    {
      title: "Quản lý hóa đơn",
      path: "/admin/invoices",
      icon: <DollarSign size={20} />,
    },
    {
      title: "Quản lý thanh toán",
      path: "/admin/payments",
      icon: <CreditCard size={20} />,
    },
    {
      title: "Đánh giá & Phản hồi",
      path: "/admin/reviews",
      icon: <Bell size={20} />,
    },
    {
      title: "Quản lý người dùng",
      path: "/admin/users",
      icon: <User size={20} />,
    },
  ];

  // Mẫu thông báo
  const notifications = [
    {
      id: 1,
      text: "Chủ trọ mới đăng ký chờ phê duyệt",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      text: "Hệ thống có phòng trọ mới được thêm",
      time: "2 giờ trước",
      read: false,
    },
    {
      id: 3,
      text: "Có hợp đồng sắp hết hạn",
      time: "1 ngày trước",
      read: false,
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
  };

  const toggleNotifications = () => {
    setNotificationOpen(!notificationOpen);
  };

  const logoutHandler = () => {
    // Xử lý logout
    console.log("Logging out");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-white shadow-lg h-full fixed left-0 z-10`}
      >
        <div className="h-full flex flex-col justify-between">
          {/* Logo và toggle sidebar */}
          <div>
            <div className="flex items-center justify-between p-4 border-b">
              {sidebarOpen ? (
                <div className="font-bold text-xl text-blue-600">
                  Quản Trị Hệ Thống
                </div>
              ) : (
                <div className="font-bold text-xl text-blue-600">QT</div>
              )}
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Navigation menu */}
            <nav className="mt-6">
              <ul className="space-y-1 px-2">
                {navigationMenu.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center py-3 px-3 rounded-md transition duration-200 ${
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {sidebarOpen && <span>{item.title}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Top navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          <div className="flex-1 flex justify-between items-center">
            {/* Page title */}
            <h1 className="text-xl font-semibold text-gray-800">
              {navigationMenu.find((item) => item.path === location.pathname)
                ?.title || "Tổng Quan"}
            </h1>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-1 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none relative"
                >
                  <Bell size={20} />
                  {user.unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Dropdown notifications */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border overflow-hidden z-20">
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Thông báo</h3>
                        <span className="text-xs text-blue-500">
                          Đánh dấu tất cả đã đọc
                        </span>
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b hover:bg-gray-50 ${
                            notification.read ? "" : "bg-blue-50"
                          }`}
                        >
                          <p className="text-sm">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center border-t">
                      <button className="text-sm text-blue-500 hover:underline">
                        Xem tất cả
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User profile */}
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {sidebarOpen && (
                    <>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-700">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                      <ChevronDown size={16} className="text-gray-500" />
                    </>
                  )}
                </button>

                {/* Dropdown menu */}
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border overflow-hidden z-20">
                    <div className="p-3 border-b">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => navigate("/admin/profile")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Thông tin tài khoản
                      </button>
                      <button
                        onClick={() => navigate("/admin/settings")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cài đặt
                      </button>
                      <button
                        onClick={logoutHandler}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 border-t"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
