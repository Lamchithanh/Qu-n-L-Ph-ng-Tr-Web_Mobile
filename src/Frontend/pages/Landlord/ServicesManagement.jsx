import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  //   Toggle,
} from "lucide-react";

const ServicesManagement = () => {
  // State quản lý danh sách dịch vụ
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priceRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(8);

  // State cho modal thêm/sửa dịch vụ
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'
  const [currentService, setCurrentService] = useState(null);

  // State cho form thêm/sửa dịch vụ
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    price_unit: "",
    description: "",
    status: true,
  });

  // Danh sách các đơn vị tính phổ biến
  const commonPriceUnits = [
    "kWh",
    "m³",
    "tháng",
    "người",
    "giờ",
    "ngày",
    "lần",
    "gói",
  ];

  // Giả lập dữ liệu dịch vụ
  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: "Điện",
          price: 3500,
          price_unit: "kWh",
          description: "Giá điện sinh hoạt cho phòng trọ theo đơn giá EVN",
          status: true,
          created_at: "2023-01-15",
          usage_count: 20,
        },
        {
          id: 2,
          name: "Nước",
          price: 15000,
          price_unit: "m³",
          description: "Giá nước sinh hoạt theo đơn giá công ty cấp nước",
          status: true,
          created_at: "2023-01-15",
          usage_count: 20,
        },
        {
          id: 3,
          name: "Internet",
          price: 100000,
          price_unit: "tháng",
          description: "Dịch vụ Internet tốc độ cao, không giới hạn dung lượng",
          status: true,
          created_at: "2023-01-20",
          usage_count: 18,
        },
        {
          id: 4,
          name: "Gửi xe máy",
          price: 100000,
          price_unit: "tháng",
          description: "Phí giữ xe máy tại bãi xe của tòa nhà",
          status: true,
          created_at: "2023-01-25",
          usage_count: 15,
        },
        {
          id: 5,
          name: "Gửi xe đạp",
          price: 50000,
          price_unit: "tháng",
          description: "Phí giữ xe đạp tại bãi xe của tòa nhà",
          status: true,
          created_at: "2023-02-01",
          usage_count: 5,
        },
        {
          id: 6,
          name: "Dọn phòng",
          price: 150000,
          price_unit: "lần",
          description: "Dịch vụ dọn phòng theo yêu cầu",
          status: false,
          created_at: "2023-02-10",
          usage_count: 8,
        },
        {
          id: 7,
          name: "Giặt ủi",
          price: 50000,
          price_unit: "kg",
          description: "Dịch vụ giặt ủi quần áo",
          status: true,
          created_at: "2023-02-15",
          usage_count: 12,
        },
        {
          id: 8,
          name: "Nước uống",
          price: 40000,
          price_unit: "bình",
          description: "Nước uống tinh khiết, bình 20L",
          status: true,
          created_at: "2023-03-01",
          usage_count: 10,
        },
        {
          id: 9,
          name: "Vệ sinh máy lạnh",
          price: 200000,
          price_unit: "lần",
          description: "Dịch vụ vệ sinh máy lạnh định kỳ",
          status: false,
          created_at: "2023-03-15",
          usage_count: 4,
        },
        {
          id: 10,
          name: "Bảo vệ 24/7",
          price: 50000,
          price_unit: "tháng",
          description: "Phí dịch vụ bảo vệ an ninh 24/7",
          status: true,
          created_at: "2023-03-20",
          usage_count: 20,
        },
      ];

      setServices(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc dịch vụ theo điều kiện search và filter
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && service.status) ||
      (filters.status === "inactive" && !service.status);

    let matchesPrice = true;
    if (filters.priceRange !== "all") {
      if (filters.priceRange === "under50k") {
        matchesPrice = service.price < 50000;
      } else if (filters.priceRange === "50k-100k") {
        matchesPrice = service.price >= 50000 && service.price <= 100000;
      } else if (filters.priceRange === "over100k") {
        matchesPrice = service.price > 100000;
      }
    }

    return matchesSearch && matchesStatus && matchesPrice;
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

  // Handler mở modal thêm dịch vụ mới
  const handleAddService = () => {
    setModalMode("add");
    setFormData({
      name: "",
      price: "",
      price_unit: "",
      description: "",
      status: true,
    });
    setShowModal(true);
  };

  // Handler mở modal sửa dịch vụ
  const handleEditService = (service) => {
    setModalMode("edit");
    setCurrentService(service);
    setFormData({
      name: service.name,
      price: service.price,
      price_unit: service.price_unit,
      description: service.description,
      status: service.status,
    });
    setShowModal(true);
  };

  // Handler xóa dịch vụ
  const handleDeleteService = (serviceId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      setServices(services.filter((service) => service.id !== serviceId));
    }
  };

  // Handler toggle trạng thái dịch vụ
  const handleToggleStatus = (serviceId) => {
    setServices(
      services.map((service) =>
        service.id === serviceId
          ? { ...service, status: !service.status }
          : service
      )
    );
  };

  // Handler cho việc thay đổi form
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handler lưu thông tin dịch vụ
  const handleSaveService = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.price || !formData.price_unit) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (modalMode === "add") {
      // Tạo dịch vụ mới
      const newService = {
        id: services.length + 1,
        ...formData,
        created_at: new Date().toISOString().split("T")[0],
        usage_count: 0,
      };

      setServices([newService, ...services]);
    } else {
      // Cập nhật dịch vụ hiện có
      setServices(
        services.map((service) => {
          if (service.id === currentService.id) {
            return {
              ...service,
              ...formData,
            };
          }
          return service;
        })
      );
    }

    setShowModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h1>
        <p className="text-gray-600">
          Quản lý danh sách dịch vụ cung cấp cho người thuê
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
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
          <div className="flex flex-wrap items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0 w-full md:w-auto">
            <div className="w-full md:w-auto flex items-center space-x-4">
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
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Giá:</label>
                <select
                  name="priceRange"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tất cả</option>
                  <option value="under50k">Dưới 50,000đ</option>
                  <option value="50k-100k">50,000đ - 100,000đ</option>
                  <option value="over100k">Trên 100,000đ</option>
                </select>
              </div>
            </div>

            {/* Nút thêm dịch vụ */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 ml-auto"
              onClick={handleAddService}
            >
              <Plus size={16} className="mr-2" />
              Thêm dịch vụ
            </button>
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
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên dịch vụ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn vị tính
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số phòng sử dụng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {service.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Ngày tạo: {service.created_at}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-800">
                      {service.price.toLocaleString()} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {service.price_unit}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {service.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {service.usage_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleStatus(service.id)}
                          className={`${
                            service.status
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          } px-3 py-1 inline-flex items-center rounded-full text-xs font-medium`}
                        >
                          {service.status ? (
                            <>
                              <Check size={12} className="mr-1" />
                              Hoạt động
                            </>
                          ) : (
                            <>
                              <X size={12} className="mr-1" />
                              Tạm ngưng
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-900"
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
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
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
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm/sửa dịch vụ */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === "add"
                  ? "Thêm dịch vụ mới"
                  : "Sửa thông tin dịch vụ"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tên dịch vụ */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên dịch vụ"
                    required
                  />
                </div>

                {/* Đơn giá và đơn vị tính */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn giá (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập đơn giá"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị tính <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="price_unit"
                      list="price-units"
                      value={formData.price_unit}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập đơn vị tính"
                      required
                    />
                    <datalist id="price-units">
                      {commonPriceUnits.map((unit) => (
                        <option key={unit} value={unit} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Mô tả */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả chi tiết về dịch vụ"
                  ></textarea>
                </div>

                {/* Trạng thái */}
                <div className="col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleFormChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                    />
                    Dịch vụ đang hoạt động
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {modalMode === "add" ? "Thêm dịch vụ" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
