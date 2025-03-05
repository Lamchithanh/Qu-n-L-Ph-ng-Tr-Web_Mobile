import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  AlertTriangle,
  Droplet,
  ThermometerSun,
  Activity,
  Clock,
  TrendingUp,
  PieChart as PieChartIcon,
  Calendar,
  Zap,
  Settings,
  Bell,
  User,
  LogOut,
  Search,
} from "lucide-react";

// Dữ liệu giả định về chất lượng nước
const mockData = {
  hourlyReadings: [
    { time: "00:00", pH: 7.8, temperature: 28, oxygen: 5.8, salinity: 15 },
    { time: "03:00", pH: 7.7, temperature: 27.8, oxygen: 5.6, salinity: 15 },
    { time: "06:00", pH: 7.8, temperature: 27.9, oxygen: 5.7, salinity: 15 },
    { time: "09:00", pH: 8.0, temperature: 28.5, oxygen: 6.2, salinity: 15 },
    { time: "12:00", pH: 8.2, temperature: 29.1, oxygen: 6.5, salinity: 15 },
    { time: "15:00", pH: 8.3, temperature: 29.4, oxygen: 6.3, salinity: 15 },
    { time: "18:00", pH: 8.1, temperature: 29.0, oxygen: 6.0, salinity: 15 },
    { time: "21:00", pH: 7.9, temperature: 28.5, oxygen: 5.9, salinity: 15 },
  ],
  pondStatus: [
    { id: "pond-01", name: "Ao số 1", status: "normal", alertCount: 0 },
    { id: "pond-02", name: "Ao số 2", status: "warning", alertCount: 2 },
    { id: "pond-03", name: "Ao số 3", status: "critical", alertCount: 4 },
    { id: "pond-04", name: "Ao số 4", status: "normal", alertCount: 0 },
    { id: "pond-05", name: "Ao số 5", status: "normal", alertCount: 0 },
    { id: "pond-06", name: "Ao số 6", status: "warning", alertCount: 1 },
  ],
  weeklyTrends: [
    { day: "T2", pH: 7.8, temperature: 28.3, oxygen: 5.9, salinity: 15 },
    { day: "T3", pH: 7.9, temperature: 28.5, oxygen: 6.0, salinity: 15 },
    { day: "T4", pH: 8.0, temperature: 28.8, oxygen: 6.1, salinity: 15 },
    { day: "T5", pH: 8.1, temperature: 29.0, oxygen: 6.0, salinity: 15 },
    { day: "T6", pH: 8.0, temperature: 28.9, oxygen: 5.9, salinity: 15 },
    { day: "T7", pH: 7.9, temperature: 28.6, oxygen: 5.8, salinity: 15 },
    { day: "CN", pH: 7.8, temperature: 28.4, oxygen: 5.7, salinity: 15 },
  ],
  alerts: [
    {
      id: 1,
      pond: "Ao số 2",
      type: "Oxy hòa tan thấp",
      time: "09:45",
      severity: "warning",
    },
    {
      id: 2,
      pond: "Ao số 2",
      type: "Nhiệt độ cao",
      time: "14:30",
      severity: "warning",
    },
    {
      id: 3,
      pond: "Ao số 3",
      type: "pH cao",
      time: "10:15",
      severity: "critical",
    },
    {
      id: 4,
      pond: "Ao số 3",
      type: "Oxy hòa tan thấp",
      time: "11:00",
      severity: "critical",
    },
    {
      id: 5,
      pond: "Ao số 3",
      type: "Độ mặn thay đổi nhanh",
      time: "11:30",
      severity: "warning",
    },
    {
      id: 6,
      pond: "Ao số 6",
      type: "Oxy hòa tan thấp",
      time: "15:20",
      severity: "warning",
    },
    {
      id: 7,
      pond: "Ao số 3",
      type: "Nhiệt độ cao",
      time: "16:45",
      severity: "critical",
    },
  ],
  parameterDistribution: [
    { name: "pH > 8.5", value: 15 },
    { name: "pH 7.5-8.5", value: 65 },
    { name: "pH < 7.5", value: 20 },
  ],
};

const AquacultureDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPond, setSelectedPond] = useState("all");
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Giả lập nhận thông báo mới
    const timer = setTimeout(() => {
      setNotifications([
        {
          id: 1,
          message: "Cảnh báo: Oxy hòa tan giảm trong Ao số 2",
          time: "Vừa xong",
        },
        {
          id: 2,
          message: "Báo cáo hàng ngày đã sẵn sàng",
          time: "10 phút trước",
        },
        {
          id: 3,
          message: "Nhiệt độ Ao số 3 tăng nhanh",
          time: "25 phút trước",
        },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const parameterInfo = {
    temperature: {
      name: "Nhiệt độ",
      unit: "°C",
      icon: <ThermometerSun />,
      color: "#ff7300",
      ideal: "28-31°C",
    },
    oxygen: {
      name: "Oxy hòa tan",
      unit: "mg/L",
      icon: <Droplet />,
      color: "#0088fe",
      ideal: ">5 mg/L",
    },
    pH: {
      name: "pH",
      unit: "",
      icon: <Activity />,
      color: "#00c49f",
      ideal: "7.5-8.5",
    },
    salinity: {
      name: "Độ mặn",
      unit: "‰",
      icon: <TrendingUp />,
      color: "#8884d8",
      ideal: "10-15‰",
    },
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 flex flex-col">
        <div className="text-xl font-bold text-blue-600 mb-8 flex items-center">
          <Droplet className="mr-2" />
          AQUASENSE
        </div>

        <nav className="flex-1">
          <ul>
            <li
              className={`mb-2 rounded ${
                activeTab === "dashboard" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              <button
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center p-3 w-full text-left"
              >
                <Activity className="mr-3" size={18} />
                Dashboard
              </button>
            </li>
            <li
              className={`mb-2 rounded ${
                activeTab === "ponds" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              <button
                onClick={() => setActiveTab("ponds")}
                className="flex items-center p-3 w-full text-left"
              >
                <Droplet className="mr-3" size={18} />
                Quản lý ao
              </button>
            </li>
            <li
              className={`mb-2 rounded ${
                activeTab === "reports" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              <button
                onClick={() => setActiveTab("reports")}
                className="flex items-center p-3 w-full text-left"
              >
                <PieChartIcon className="mr-3" size={18} />
                Báo cáo
              </button>
            </li>
            <li
              className={`mb-2 rounded ${
                activeTab === "alerts" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              <button
                onClick={() => setActiveTab("alerts")}
                className="flex items-center p-3 w-full text-left"
              >
                <AlertTriangle className="mr-3" size={18} />
                Cảnh báo
              </button>
            </li>
            <li
              className={`mb-2 rounded ${
                activeTab === "settings" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              <button
                onClick={() => setActiveTab("settings")}
                className="flex items-center p-3 w-full text-left"
              >
                <Settings className="mr-3" size={18} />
                Cài đặt
              </button>
            </li>
          </ul>
        </nav>

        <div className="border-t pt-4 mt-auto">
          <div className="flex items-center p-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div className="ml-3">
              <div className="font-medium">Nguyễn Văn A</div>
              <div className="text-sm text-gray-500">Quản lý</div>
            </div>
          </div>
          <button className="mt-2 flex items-center p-2 text-gray-600 hover:text-red-500 w-full">
            <LogOut size={18} className="mr-2" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Dashboard Quản Lý Chất Lượng Nước
          </h1>

          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="border rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            <div className="relative">
              <button className="relative p-2">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6">
          {/* Date and overview */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Tổng quan hệ thống</h2>
              <div className="flex items-center text-gray-500">
                <Calendar size={16} className="mr-2" />
                <span>Ngày 04 tháng 03, 2025</span>
                <Clock size={16} className="ml-4 mr-2" />
                <span>Cập nhật gần nhất: 5 phút trước</span>
              </div>
            </div>

            <div className="flex">
              <select
                value={selectedPond}
                onChange={(e) => setSelectedPond(e.target.value)}
                className="mr-2 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả các ao</option>
                {mockData.pondStatus.map((pond) => (
                  <option key={pond.id} value={pond.id}>
                    {pond.name}
                  </option>
                ))}
              </select>

              <button className="bg-blue-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-600">
                Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {Object.keys(parameterInfo).map((param) => (
              <div
                key={param}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 mb-1">
                      {parameterInfo[param].name}
                    </p>
                    <h3 className="text-2xl font-bold">
                      {
                        mockData.hourlyReadings[
                          mockData.hourlyReadings.length - 1
                        ][param]
                      }
                      <span className="text-sm font-normal ml-1">
                        {parameterInfo[param].unit}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Lý tưởng: {parameterInfo[param].ideal}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      param === selectedParameter
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {parameterInfo[param].icon}
                  </div>
                </div>
                <div className="mt-4 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData.hourlyReadings.slice(-4)}>
                      <Line
                        type="monotone"
                        dataKey={param}
                        stroke={parameterInfo[param].color}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          {/* Main charts */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6 col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">
                  Biểu đồ {parameterInfo[selectedParameter].name} theo thời gian
                </h3>
                <div>
                  <select
                    value={selectedParameter}
                    onChange={(e) => setSelectedParameter(e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    {Object.keys(parameterInfo).map((param) => (
                      <option key={param} value={param}>
                        {parameterInfo[param].name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData.weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey={selectedParameter}
                      stroke={parameterInfo[selectedParameter].color}
                      fill={parameterInfo[selectedParameter].color}
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Phân bố pH trong ngày</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockData.parameterDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mockData.parameterDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === 0
                              ? "#ff8042"
                              : index === 1
                              ? "#00C49F"
                              : "#0088FE"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Ponds and alerts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Trạng thái các ao nuôi</h3>
              <div className="space-y-3">
                {mockData.pondStatus.map((pond) => (
                  <div
                    key={pond.id}
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          pond.status
                        )} mr-3`}
                      ></div>
                      <span className="font-medium">{pond.name}</span>
                    </div>
                    <div className="flex items-center">
                      {pond.alertCount > 0 && (
                        <span className="text-sm bg-red-100 text-red-600 rounded-full px-2 py-0.5 mr-2">
                          {pond.alertCount} cảnh báo
                        </span>
                      )}
                      <button className="text-blue-500 text-sm hover:underline">
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Cảnh báo gần đây</h3>
                <button className="text-blue-500 text-sm hover:underline">
                  Xem tất cả
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockData.alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`border-l-4 ${
                      alert.severity === "critical"
                        ? "border-red-500 bg-red-50"
                        : "border-yellow-500 bg-yellow-50"
                    } rounded p-3`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{alert.type}</span>
                      <span className="text-gray-500 text-sm">
                        {alert.time}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{alert.pond}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AquacultureDashboard;
