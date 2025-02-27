import React, { useState } from "react";
import {
  Home,
  Users,
  FileText,
  DollarSign,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Filter,
} from "lucide-react";
import LandlordDetailModal from "../../Contexts/LandlordDetailModal";

const AdminDashboardOverview = () => {
  const [selectedLandlord, setSelectedLandlord] = useState(null);

  const openLandlordDetail = (landlord) => {
    setSelectedLandlord(landlord);
  };

  const closeLandlordDetail = () => {
    setSelectedLandlord(null);
  };

  // Dữ liệu mẫu cho các thẻ thống kê
  const stats = [
    {
      title: "Tổng số chủ trọ",
      value: 50,
      icon: <UserCheck size={24} className="text-blue-500" />,
      change: "+5 so với tháng trước",
      changeType: "positive",
    },
    {
      title: "Tổng số phòng trọ",
      value: 250,
      icon: <Home size={24} className="text-green-500" />,
      change: "+20 so với tháng trước",
      changeType: "positive",
    },
    {
      title: "Hợp đồng đang hoạt động",
      value: 180,
      icon: <FileText size={24} className="text-purple-500" />,
      change: "+15 so với tháng trước",
      changeType: "positive",
    },
    {
      title: "Tổng doanh thu",
      value: "500,000,000",
      icon: <DollarSign size={24} className="text-amber-500" />,
      change: "+18% so với tháng trước",
      changeType: "positive",
      isAmount: true,
    },
  ];

  // Dữ liệu mẫu cho hoạt động gần đây
  const recentActivities = [
    {
      id: 1,
      title: "Chủ trọ mới",
      detail: "Nguyễn Văn A đăng ký tài khoản mới",
      time: "1 giờ trước",
      icon: <UserCheck size={16} className="text-green-500" />,
    },
    {
      id: 2,
      title: "Phê duyệt hồ sơ",
      detail: "Đã phê duyệt hồ sơ chủ trọ Lê Thị B",
      time: "3 giờ trước",
      icon: <CheckCircle size={16} className="text-blue-500" />,
    },
    {
      id: 3,
      title: "Cảnh báo vi phạm",
      detail: "Phát hiện tài khoản có dấu hiệu không phù hợp",
      time: "1 ngày trước",
      icon: <AlertTriangle size={16} className="text-red-500" />,
    },
    {
      id: 4,
      title: "Gia hạn gói dịch vụ",
      detail: "Chủ trọ Trần Văn C gia hạn gói Premium",
      time: "2 ngày trước",
      icon: <FileText size={16} className="text-amber-500" />,
    },
  ];

  // Dữ liệu mẫu cho danh sách chủ trọ mới
  const newLandlords = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      rooms: 3,
      status: "pending",
    },
    {
      id: 2,
      name: "Lê Thị B",
      email: "lethib@example.com",
      rooms: 5,
      status: "approved",
    },
    {
      id: 3,
      name: "Trần Văn C",
      email: "tranvanc@example.com",
      rooms: 2,
      status: "pending",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      rooms: 4,
      status: "approved",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      rooms: 1,
      status: "pending",
    },
  ];

  const RevenueChart = () => {
    const revenueData = [
      { month: "T9/24", revenue: 35, color: "bg-blue-500" },
      { month: "T10/24", revenue: 38, color: "bg-blue-500" },
      { month: "T11/24", revenue: 36, color: "bg-blue-500" },
      { month: "T12/24", revenue: 40, color: "bg-blue-500" },
      { month: "T1/25", revenue: 41, color: "bg-blue-500" },
      { month: "T2/25", revenue: 42.5, color: "bg-green-500" },
    ];

    return (
      <div className="h-64">
        <div className="h-full flex items-end justify-between">
          {revenueData.map((item, index) => (
            <div key={index} className="w-1/6 px-2 flex flex-col items-center">
              <div
                className={`w-full ${item.color} rounded-t-md`}
                style={{ height: `${(item.revenue / 50) * 100}%` }}
              ></div>
              <p className="text-xs mt-2 text-gray-600">{item.month}</p>
              <p className="text-xs font-medium">{item.revenue}tr</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <p className="text-gray-600">
          Chào mừng! Đây là tổng quan về tình hình hoạt động toàn hệ thống.
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">
                {stat.title}
              </h3>
              <div className="p-2 rounded-full bg-gray-50">{stat.icon}</div>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-gray-800">
                {stat.isAmount ? stat.value + " đ" : stat.value}
              </p>
              <p
                className={`text-sm mt-1 ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-800 text-lg">
              Hoạt động gần đây
            </h2>
            <button className="text-sm text-blue-600 hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start p-3 rounded-md hover:bg-gray-50"
              >
                <div className="mr-4 mt-1">{activity.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-gray-600 text-sm">{activity.detail}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Landlord Registration Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="font-bold text-gray-800 text-lg">Đăng ký chủ trọ</h2>
            <p className="text-sm text-gray-500">
              Thống kê đăng ký mới và phê duyệt
            </p>
          </div>

          {/* Simple Donut Chart */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#D1D5DB"
                  strokeWidth="3"
                ></circle>

                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray="70 30"
                  strokeDashoffset="25"
                  transform="rotate(-90 18 18)"
                ></circle>

                <text
                  x="18"
                  y="18"
                  textAnchor="middle"
                  dy=".3em"
                  fontSize="8"
                  fill="#374151"
                  fontWeight="bold"
                >
                  70%
                </text>
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-600">Đã phê duyệt (35)</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
              <span className="text-gray-600">Chờ phê duyệt (15)</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Landlords Table */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-gray-800 text-lg">
            Chủ trọ mới đăng ký
          </h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md flex items-center hover:bg-gray-50">
              <Filter size={16} className="mr-2" />
              Lọc
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              + Thêm chủ trọ
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên chủ trọ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số phòng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newLandlords.map((landlord) => (
                <tr key={landlord.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium text-gray-800">
                      {landlord.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {landlord.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {landlord.rooms}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {landlord.status === "approved" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Đã Duyệt
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Chờ Duyệt
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openLandlordDetail(landlord)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Chi tiết
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      Duyệt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="font-bold text-gray-800 text-lg">
            Doanh thu hệ thống
          </h2>
          <p className="text-sm text-gray-500">
            Tổng doanh thu 6 tháng gần nhất từ phí dịch vụ
          </p>
        </div>

        {/* Sử dụng RevenueChart */}
        <RevenueChart />
      </div>

      {/* Upcoming Payments */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-800 text-lg">
            Hóa đơn sắp đến hạn
          </h2>
          <button className="text-sm text-blue-600 hover:underline">
            Xem tất cả
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ Trọ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại hóa đơn
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạn thanh toán
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium text-gray-800">
                    Nguyễn Văn A
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-gray-600">Phòng 102</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-gray-600">Tiền thuê tháng 3</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium text-gray-800">3,500,000 đ</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-red-600">3 ngày nữa</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <button className="text-blue-600 hover:text-blue-900">
                    Nhắc nhở
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium text-gray-800">Lê Thị B</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-gray-600">Phòng 205</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-gray-600">Tiền điện tháng 2</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium text-gray-800">450,000 đ</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-amber-600">5 ngày nữa</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <button className="text-blue-600 hover:text-blue-900">
                    Nhắc nhở
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium text-gray-800">Trần Văn C</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-gray-600">Phòng 301</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-gray-600">Tiền thuê tháng 3</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium text-gray-800">4,200,000 đ</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-amber-600">1 tuần nữa</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <button className="text-blue-600 hover:text-blue-900">
                    Nhắc nhở
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal chi tiết chủ trọ */}
      {selectedLandlord && (
        <LandlordDetailModal
          landlord={selectedLandlord}
          onClose={closeLandlordDetail}
        />
      )}
    </div>
  );
};

export default AdminDashboardOverview;
