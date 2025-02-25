// DashboardLayout.jsx - Layout chính cho dashboard chủ trọ
import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
  Search,
  Filter,
} from "lucide-react";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Thông tin người dùng (giả lập)
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "https://via.placeholder.com/40",
    role: "Chủ trọ",
    unreadNotifications: 3,
  };

  // Menu điều hướng
  const navigationMenu = [
    { title: "Tổng quan", path: "/dashboard", icon: <PieChart size={20} /> },
    // {
    //   title: "Thông tin chủ trọ",
    //   path: "/dashboard/LandlordProfile",
    //   icon: <User size={20} />,
    // },
    {
      title: "Quản lý phòng trọ",
      path: "/dashboard/RoomsManagement",
      icon: <Home size={20} />,
    },
    {
      title: "Quản lý hợp đồng",
      path: "/dashboard/contracts",
      icon: <FileText size={20} />,
    },
    {
      title: "Quản lý dịch vụ",
      path: "/dashboard/services",
      icon: <Grid size={20} />,
    },
    {
      title: "Quản lý hóa đơn",
      path: "/dashboard/invoices",
      icon: <DollarSign size={20} />,
    },
    {
      title: "Quản lý thanh toán",
      path: "/dashboard/payments",
      icon: <DollarSign size={20} />,
    },
    {
      title: "Đánh giá & Phản hồi",
      path: "/dashboard/reviews",
      icon: <Bell size={20} />,
    },
    // {
    //   title: "Cài đặt",
    //   path: "/dashboard/settings",
    //   icon: <Settings size={20} />,
    // },
  ];

  // Mẫu thông báo
  const notifications = [
    {
      id: 1,
      text: "Hợp đồng mới đang chờ xác nhận",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      text: "Hóa đơn tháng 2 đã được thanh toán",
      time: "2 giờ trước",
      read: false,
    },
    {
      id: 3,
      text: "Yêu cầu sửa chữa mới từ phòng 101",
      time: "1 ngày trước",
      read: false,
    },
    {
      id: 4,
      text: "Nguyễn Văn B đã gia hạn hợp đồng",
      time: "3 ngày trước",
      read: true,
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
                <Link
                  to="/dashboard"
                  className="font-bold text-xl text-blue-600"
                >
                  Thuê dễ dàng
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="font-bold text-xl text-blue-600"
                >
                  Thuê
                </Link>
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
                    <Link
                      to={item.path}
                      className={`flex items-center py-3 px-3 rounded-md transition duration-200 ${
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {sidebarOpen && <span>{item.title}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* User info at bottom */}
          {/* <div className="p-4 border-t">
            <button
              onClick={logoutHandler}
              className="flex items-center w-full py-2 px-3 text-red-500 hover:bg-red-50 rounded-md transition duration-200"
            >
              <LogOut size={20} className="mr-3" />
              {sidebarOpen && <span>Đăng xuất</span>}
            </button>
          </div> */}
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
            {/* Page title can go here */}
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

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
                      <Link
                        to="/dashboard/notifications"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Xem tất cả
                      </Link>
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
                      <Link
                        to="/dashboard/LandlordProfile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Thông tin tài khoản
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cài đặt
                      </Link>
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

export default DashboardLayout;
