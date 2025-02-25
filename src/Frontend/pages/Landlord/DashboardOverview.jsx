import React from "react";
import {
  Home,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Filter,
} from "lucide-react";

const DashboardOverview = () => {
  // Dữ liệu mẫu cho các thẻ thống kê
  const stats = [
    {
      title: "Tổng số phòng",
      value: 24,
      icon: <Home size={24} className="text-blue-500" />,
      change: "+2 so với tháng trước",
      changeType: "positive",
    },
    {
      title: "Phòng đã thuê",
      value: 18,
      icon: <Users size={24} className="text-green-500" />,
      change: "+3 so với tháng trước",
      changeType: "positive",
    },
    {
      title: "Hợp đồng đang hoạt động",
      value: 18,
      icon: <FileText size={24} className="text-purple-500" />,
      change: "+3 so với tháng trước",
      changeType: "positive",
    },
    {
      title: "Doanh thu tháng này",
      value: "42,500,000",
      icon: <DollarSign size={24} className="text-amber-500" />,
      change: "+12% so với tháng trước",
      changeType: "positive",
      isAmount: true,
    },
  ];

  // Dữ liệu mẫu cho hoạt động gần đây
  const recentActivities = [
    {
      id: 1,
      title: "Hợp đồng mới được ký",
      detail: "Nguyễn Văn B đã ký hợp đồng phòng 103",
      time: "1 giờ trước",
      icon: <CheckCircle size={16} className="text-green-500" />,
    },
    {
      id: 2,
      title: "Thanh toán tiền phòng",
      detail: "Lê Thị C đã thanh toán hóa đơn tháng 2/2025",
      time: "3 giờ trước",
      icon: <DollarSign size={16} className="text-blue-500" />,
    },
    {
      id: 3,
      title: "Hóa đơn quá hạn",
      detail: "Phòng 205 chưa thanh toán hóa đơn tháng 2/2025",
      time: "1 ngày trước",
      icon: <AlertTriangle size={16} className="text-red-500" />,
    },
    {
      id: 4,
      title: "Hợp đồng sắp hết hạn",
      detail: "Hợp đồng phòng 302 sẽ hết hạn trong 15 ngày",
      time: "2 ngày trước",
      icon: <FileText size={16} className="text-amber-500" />,
    },
  ];

  // Dữ liệu mẫu cho danh sách phòng trống
  const availableRooms = [
    {
      id: 1,
      room: "101",
      floor: 1,
      area: 25,
      price: "3,500,000",
      status: "available",
    },
    {
      id: 2,
      room: "203",
      floor: 2,
      area: 30,
      price: "4,200,000",
      status: "available",
    },
    {
      id: 3,
      room: "305",
      floor: 3,
      area: 20,
      price: "2,800,000",
      status: "maintenance",
    },
    {
      id: 4,
      room: "401",
      floor: 4,
      area: 35,
      price: "5,000,000",
      status: "available",
    },
    {
      id: 5,
      room: "502",
      floor: 5,
      area: 28,
      price: "3,800,000",
      status: "available",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
        <p className="text-gray-600">
          Chào mừng trở lại! Đây là tổng quan về tình hình hoạt động.
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

        {/* Occupancy Rate Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="font-bold text-gray-800 text-lg">Tỷ lệ lấp đầy</h2>
            <p className="text-sm text-gray-500">
              Thống kê phòng đã thuê/còn trống
            </p>
          </div>

          {/* Simple Donut Chart */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              {/* Đây là một donut chart đơn giản */}
              <svg viewBox="0 0 36 36" className="w-full h-full">
                {/* Background circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#D1D5DB"
                  strokeWidth="3"
                ></circle>

                {/* Foreground circle representing occupancy rate (75%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray="75 25"
                  strokeDashoffset="25"
                  transform="rotate(-90 18 18)"
                ></circle>

                {/* Percentage text in the middle */}
                <text
                  x="18"
                  y="18"
                  textAnchor="middle"
                  dy=".3em"
                  fontSize="8"
                  fill="#374151"
                  fontWeight="bold"
                >
                  75%
                </text>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center"></div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-600">Đã thuê (18 phòng)</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
              <span className="text-gray-600">Còn trống (6 phòng)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rooms Table */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-gray-800 text-lg">
            Phòng trống/bảo trì
          </h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md flex items-center hover:bg-gray-50">
              <Filter size={16} className="mr-2" />
              Lọc
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              + Thêm phòng
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tầng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diện tích (m²)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá thuê (đ/tháng)
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
              {availableRooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium text-gray-800">
                      Phòng {room.room}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {room.floor}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {room.area}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {room.price}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {room.status === "available" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Trống
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Bảo trì
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Chi tiết
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Chỉnh sửa
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
            Doanh thu theo tháng
          </h2>
          <p className="text-sm text-gray-500">
            Tổng doanh thu 6 tháng gần nhất
          </p>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64">
          <div className="h-full flex items-end justify-between">
            {/* Tháng 9/2024 */}
            <div className="w-1/6 px-2 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t-md"
                style={{ height: "50%" }}
              ></div>
              <p className="text-xs mt-2 text-gray-600">T9/24</p>
              <p className="text-xs font-medium">35tr</p>
            </div>

            {/* Tháng 10/2024 */}
            <div className="w-1/6 px-2 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t-md"
                style={{ height: "65%" }}
              ></div>
              <p className="text-xs mt-2 text-gray-600">T10/24</p>
              <p className="text-xs font-medium">38tr</p>
            </div>

            {/* Tháng 11/2024 */}
            <div className="w-1/6 px-2 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t-md"
                style={{ height: "60%" }}
              ></div>
              <p className="text-xs mt-2 text-gray-600">T11/24</p>
              <p className="text-xs font-medium">36tr</p>
            </div>

            {/* Tháng 12/2024 */}
            <div className="w-1/6 px-2 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t-md"
                style={{ height: "75%" }}
              ></div>
              <p className="text-xs mt-2 text-gray-600">T12/24</p>
              <p className="text-xs font-medium">40tr</p>
            </div>

            {/* Tháng 1/2025 */}
            <div className="w-1/6 px-2 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t-md"
                style={{ height: "80%" }}
              ></div>
              <p className="text-xs mt-2 text-gray-600">T1/25</p>
              <p className="text-xs font-medium">41tr</p>
            </div>

            {/* Tháng 2/2025 (Hiện tại) */}
            <div className="w-1/6 px-2 flex flex-col items-center">
              <div
                className="w-full bg-green-500 rounded-t-md"
                style={{ height: "85%" }}
              ></div>
              <p className="text-xs mt-2 text-gray-600">T2/25</p>
              <p className="text-xs font-medium">42.5tr</p>
            </div>
          </div>
        </div>
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
                  Phòng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người thuê
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
                  <span className="font-medium text-gray-800">Phòng 102</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-gray-600">Trần Văn D</span>
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
                  <span className="font-medium text-gray-800">Phòng 205</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-gray-600">Lê Thị H</span>
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
                  <span className="font-medium text-gray-800">Phòng 301</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-gray-600">Nguyễn Văn T</span>
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
    </div>
  );
};

export default DashboardOverview;
