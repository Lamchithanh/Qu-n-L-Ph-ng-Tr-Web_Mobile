import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Home,
  ArrowDownToLine,
  Shield,
  AlignJustify,
  BarChart2,
  Zap,
  DollarSign,
  Check,
  Info,
  Activity,
  Droplet,
  Wifi,
  Trash,
} from "lucide-react";

const AdminServicesManagement = () => {
  // State quản lý danh sách dịch vụ
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    landlord: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(10);

  // State cho modal xem chi tiết dịch vụ
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailService, setDetailService] = useState(null);

  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // State cho danh sách chủ trọ
  const [landlords, setLandlords] = useState([]);

  // State cho biểu đồ sử dụng dịch vụ
  const [usageChartData, setUsageChartData] = useState([]);

  // Giả lập dữ liệu
  useEffect(() => {
    // Giả lập API call cho chủ trọ
    setTimeout(() => {
      const mockLandlords = Array(10)
        .fill()
        .map((_, index) => ({
          id: `landlord_${index + 1}`,
          name:
            [
              "Nguyễn Văn Chủ",
              "Trần Thị Sở Hữu",
              "Lê Văn Cho Thuê",
              "Phạm Thị Đầu Tư",
              "Hoàng Văn Nhà",
            ][index % 5] + ` ${index + 1}`,
          phone: `098${index}${index + 1}${index + 2}${index + 3}${index + 4}`,
          email: `landlord${index + 1}@example.com`,
          property_count: Math.floor(Math.random() * 10) + 1,
        }));
      setLandlords(mockLandlords);

      // Giả lập danh sách dịch vụ
      const serviceIcons = [
        <Droplet size={16} className="text-blue-500" />, // Nước
        <Zap size={16} className="text-yellow-500" />, // Điện
        <Wifi size={16} className="text-green-500" />, // Internet
        <Trash size={16} className="text-gray-500" />, // Rác
      ];

      const serviceTypes = [
        {
          name: "Điện",
          price_unit: "kWh",
          base_price: 3500,
          max_price: 4000,
          icon: 1,
        },
        {
          name: "Nước",
          price_unit: "m³",
          base_price: 15000,
          max_price: 25000,
          icon: 0,
        },
        {
          name: "Internet",
          price_unit: "tháng",
          base_price: 100000,
          max_price: 200000,
          icon: 2,
        },
        {
          name: "Rác",
          price_unit: "tháng",
          base_price: 20000,
          max_price: 50000,
          icon: 3,
        },
      ];

      const mockServices = [];

      // Tạo các dịch vụ cho mỗi chủ trọ
      mockLandlords.forEach((landlord) => {
        // Mỗi chủ trọ có 3-4 dịch vụ ngẫu nhiên
        const serviceCount = Math.floor(Math.random() * 2) + 3;
        const shuffledServices = [...serviceTypes].sort(
          () => 0.5 - Math.random()
        );

        for (let i = 0; i < serviceCount; i++) {
          const serviceType = shuffledServices[i];
          const price =
            serviceType.base_price +
            Math.floor(
              (Math.random() *
                (serviceType.max_price - serviceType.base_price)) /
                100
            ) *
              100;
          const status = Math.random() > 0.1; // 10% dịch vụ không hoạt động

          mockServices.push({
            id: `service_${mockServices.length + 1}`,
            landlord_id: landlord.id,
            landlord_name: landlord.name,
            name: serviceType.name,
            price_unit: serviceType.price_unit,
            price: price,
            description: `Dịch vụ ${serviceType.name} của ${landlord.name}. Áp dụng cho tất cả các phòng trọ.`,
            status: status,
            created_at: new Date(
              Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
            ).toISOString(),
            updated_at: new Date(
              Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
            ).toISOString(),
            usage_count: Math.floor(Math.random() * 100) + 20,
            icon: serviceType.icon,
            pending_review: Math.random() < 0.15, // 15% dịch vụ đang chờ duyệt
            property_count: Math.floor(Math.random() * 5) + 1,
          });
        }
      });

      setServices(mockServices);
      setLoading(false);

      // Giả lập dữ liệu biểu đồ sử dụng
      const mockChartData = [
        { month: "T1", usage: Math.floor(Math.random() * 100) + 50 },
        { month: "T2", usage: Math.floor(Math.random() * 100) + 50 },
        { month: "T3", usage: Math.floor(Math.random() * 100) + 50 },
        { month: "T4", usage: Math.floor(Math.random() * 100) + 50 },
        { month: "T5", usage: Math.floor(Math.random() * 100) + 50 },
        { month: "T6", usage: Math.floor(Math.random() * 100) + 50 },
      ];
      setUsageChartData(mockChartData);
    }, 1000);
  }, []);

  // Lọc dịch vụ theo điều kiện search và filter
  const filteredServices = services.filter((service) => {
    // Tìm kiếm theo tên dịch vụ, tên chủ trọ
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.landlord_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái
    let matchesStatus = true;
    if (filters.status === "active") {
      matchesStatus = service.status === true;
    } else if (filters.status === "inactive") {
      matchesStatus = service.status === false;
    } else if (filters.status === "pending") {
      matchesStatus = service.pending_review === true;
    }

    // Lọc theo chủ trọ
    const matchesLandlord =
      filters.landlord === "all" || service.landlord_id === filters.landlord;

    return matchesSearch && matchesStatus && matchesLandlord;
  });

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

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

  // Handler xem chi tiết dịch vụ
  const handleViewService = (service) => {
    setDetailService(service);
    setShowDetailModal(true);
  };

  // Handler mở modal xác nhận xóa dịch vụ
  const handleDeletePrompt = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  // Handler xóa dịch vụ
  const handleDeleteService = () => {
    setServices(
      services.filter((service) => service.id !== serviceToDelete.id)
    );
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  // Handler duyệt dịch vụ
  const handleApproveService = (serviceId) => {
    setServices(
      services.map((service) =>
        service.id === serviceId
          ? { ...service, pending_review: false, status: true }
          : service
      )
    );
  };

  // Handler tạo file Excel báo cáo
  const handleExportExcel = () => {
    console.log(`Xuất báo cáo Excel`);
    // Trong thực tế, sẽ gọi API để tạo và tải file Excel
    alert("Đã tạo và tải xuống file Excel báo cáo dịch vụ!");
  };

  // Handler tạo file PDF báo cáo
  const handleExportPDF = () => {
    console.log(`Xuất báo cáo PDF`);
    // Trong thực tế, sẽ gọi API để tạo và tải file PDF
    alert("Đã tạo và tải xuống file PDF báo cáo dịch vụ!");
  };

  // Helper function để render icon dịch vụ
  const renderServiceIcon = (iconIndex) => {
    const icons = [
      <Droplet size={16} className="text-blue-500" />,
      <Zap size={16} className="text-yellow-500" />,
      <Wifi size={16} className="text-green-500" />,
      <Trash size={16} className="text-gray-500" />,
    ];
    return icons[iconIndex] || <Info size={16} className="text-gray-400" />;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h1>
        <p className="text-gray-600">
          Quản lý và giám sát tất cả dịch vụ trong hệ thống
        </p>
      </div>

      {/* Thanh công cụ và bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ, chủ trọ..."
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
              <label className="text-sm text-gray-600">Trạng thái:</label>
              <select
                name="status"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Chủ trọ:</label>
              <select
                name="landlord"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.landlord}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả chủ trọ</option>
                {landlords.map((landlord) => (
                  <option key={landlord.id} value={landlord.id}>
                    {landlord.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút xuất báo cáo */}
            <div className="flex space-x-2 ml-auto">
              <button
                className="bg-green-600 text-white px-3 py-1.5 rounded-md flex items-center hover:bg-green-700 text-sm"
                onClick={handleExportExcel}
              >
                <ArrowDownToLine size={16} className="mr-1" />
                Excel
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1.5 rounded-md flex items-center hover:bg-red-700 text-sm"
                onClick={handleExportPDF}
              >
                <FileText size={16} className="mr-1" />
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách dịch vụ */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            Không tìm thấy dịch vụ nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ trọ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt sử dụng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {renderServiceIcon(service.icon)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {service.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {service.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {service.landlord_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.property_count} nhà trọ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {service.price.toLocaleString()} đ/{service.price_unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.usage_count} lượt/tháng
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.pending_review ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Chờ duyệt
                        </span>
                      ) : service.status ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Không hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewService(service)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      {service.pending_review && (
                        <button
                          onClick={() => handleApproveService(service.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Duyệt dịch vụ"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePrompt(service)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa dịch vụ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstService + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastService, filteredServices.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{filteredServices.length}</span>{" "}
                  dịch vụ
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
                        ? "text-gray-300 cursor-not-allowed"
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
                        ? "text-gray-300 cursor-not-allowed"
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

      {/* Modal chi tiết dịch vụ */}
      {showDetailModal && detailService && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {renderServiceIcon(detailService.icon)}
                <span className="ml-2">
                  Chi tiết dịch vụ {detailService.name}
                </span>
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
                {/* Cột 1: Thông tin cơ bản và chủ trọ */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Thông tin dịch vụ
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Mã dịch vụ:</span>{" "}
                        {detailService.id}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Tên dịch vụ:</span>{" "}
                        {detailService.name}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Đơn giá:</span>{" "}
                        {detailService.price.toLocaleString()} đ/
                        {detailService.price_unit}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Trạng thái:</span>{" "}
                        {detailService.pending_review ? (
                          <span className="text-yellow-600">Chờ duyệt</span>
                        ) : detailService.status ? (
                          <span className="text-green-600">Đang hoạt động</span>
                        ) : (
                          <span className="text-red-600">Không hoạt động</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ngày tạo:</span>{" "}
                        {new Date(detailService.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Thông tin chủ trọ
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <Home size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {detailService.landlord_name}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          Số lượng nhà trọ áp dụng:
                        </span>{" "}
                        {detailService.property_count}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Tỉ lệ sử dụng:</span>{" "}
                        {Math.floor(Math.random() * 40) + 60}%
                      </p>
                      <button
                        className="text-blue-600 hover:underline text-sm flex items-center"
                        onClick={() =>
                          alert(
                            "Chức năng xem hồ sơ chủ trọ đang được phát triển"
                          )
                        }
                      >
                        <Eye size={16} className="mr-1" /> Xem hồ sơ chủ trọ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cột 2: Mô tả và thống kê */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Mô tả dịch vụ
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {detailService.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Thống kê sử dụng
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="h-40 flex flex-col justify-center items-center">
                        <div className="w-full h-32 relative">
                          <div className="absolute inset-0 flex items-end">
                            {usageChartData.map((data, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center mx-1 flex-1"
                              >
                                <div
                                  className="w-full bg-blue-500"
                                  style={{
                                    height: `${(data.usage / 100) * 100}%`,
                                    maxHeight: "100%",
                                    minHeight: "10%",
                                  }}
                                ></div>
                                <span className="text-xs mt-1">
                                  {data.month}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Lượt sử dụng 6 tháng gần nhất
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cột 3: Phê duyệt và cài đặt */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Shield size={20} className="text-blue-500 mr-2" /> Phê
                      duyệt dịch vụ
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {detailService.pending_review ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-4">
                            Dịch vụ này đang chờ được phê duyệt để sử dụng trong
                            hệ thống.
                          </p>
                          <div className="flex space-x-2">
                            <button
                              className="bg-green-600 text-white px-3 py-1.5 rounded-md flex items-center hover:bg-green-700 text-sm"
                              onClick={() => {
                                handleApproveService(detailService.id);
                                setShowDetailModal(false);
                              }}
                            >
                              <Check size={16} className="mr-1" />
                              Phê duyệt
                            </button>
                            <button
                              className="bg-red-600 text-white px-3 py-1.5 rounded-md flex items-center hover:bg-red-700 text-sm"
                              onClick={() => {
                                handleDeletePrompt(detailService);
                                setShowDetailModal(false);
                              }}
                            >
                              <Trash2 size={16} className="mr-1" />
                              Từ chối
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">
                              Trạng thái kiểm duyệt:
                            </span>{" "}
                            <span className="text-green-600">Đã phê duyệt</span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Ngày phê duyệt:</span>{" "}
                            {new Date(
                              detailService.updated_at
                            ).toLocaleDateString("vi-VN")}
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            <span className="font-medium">
                              Tình trạng hiện tại:
                            </span>{" "}
                            {detailService.status ? (
                              <span className="text-green-600">
                                Đang hoạt động
                              </span>
                            ) : (
                              <span className="text-red-600">
                                Đã vô hiệu hóa
                              </span>
                            )}
                          </p>
                          <div>
                            <button
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md text-sm flex items-center"
                              onClick={() =>
                                alert(
                                  "Chức năng thay đổi trạng thái đang được phát triển"
                                )
                              }
                            >
                              {detailService.status ? (
                                <>
                                  <AlertCircle size={16} className="mr-1" />
                                  Vô hiệu hóa
                                </>
                              ) : (
                                <>
                                  <Check size={16} className="mr-1" />
                                  Kích hoạt lại
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Kiểm tra hợp lệ
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <CheckCircle
                            size={16}
                            className="text-green-500 mr-2"
                          />
                          <span>Giá dịch vụ nằm trong khung quy định</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle
                            size={16}
                            className="text-green-500 mr-2"
                          />
                          <span>Đơn vị tính phù hợp với loại dịch vụ</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle
                            size={16}
                            className="text-green-500 mr-2"
                          />
                          <span>Mô tả dịch vụ đầy đủ thông tin</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle
                            size={16}
                            className="text-green-500 mr-2"
                          />
                          <span>Không có báo cáo vi phạm từ người dùng</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                {detailService.pending_review ? (
                  <>
                    <button
                      onClick={() => {
                        handleApproveService(detailService.id);
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                    >
                      <Check size={16} className="mr-2" />
                      Phê duyệt
                    </button>
                    <button
                      onClick={() => {
                        handleDeletePrompt(detailService);
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Từ chối
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleDeletePrompt(detailService);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Xóa dịch vụ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa dịch vụ */}
      {showDeleteModal && serviceToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xác nhận xóa dịch vụ
              </h3>
              <p className="text-gray-500 mb-4">
                Bạn có chắc chắn muốn xóa dịch vụ{" "}
                <span className="font-medium">{serviceToDelete.name}</span> của
                chủ trọ{" "}
                <span className="font-medium">
                  {serviceToDelete.landlord_name}
                </span>{" "}
                không? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={handleDeleteService}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicesManagement;
