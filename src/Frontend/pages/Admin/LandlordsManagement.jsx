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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const LandlordsManagement = () => {
  // State quản lý danh sách chủ trọ
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [landlordsPerPage] = useState(8);

  // State cho modal thêm/sửa chủ trọ
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'
  const [currentLandlord, setCurrentLandlord] = useState(null);

  // State cho detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLandlord, setDetailLandlord] = useState(null);

  // State cho form thêm/sửa chủ trọ
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    id_card_number: "",
    business_license: "",
    address: "",
    status: "pending",
  });

  // Giả lập dữ liệu
  useEffect(() => {
    // Mô phỏng API call
    setTimeout(() => {
      const mockLandlords = Array(30)
        .fill()
        .map((_, index) => {
          const createDate = new Date();
          createDate.setMonth(createDate.getMonth() - (index % 12));

          return {
            id: `landlord_${index + 1}`,
            full_name:
              ["Nguyễn Văn", "Trần Thị", "Lê Văn", "Phạm Thị", "Hoàng Văn"][
                index % 5
              ] + ` ${index + 1}`,
            email: `landlord${index + 1}@example.com`,
            phone: `098${index}${index + 1}${index + 2}${index + 3}${
              index + 4
            }`,
            id_card_number: `0${index + 1}${index + 2}${index + 3}${index + 4}${
              index + 5
            }${index + 6}${index + 7}${index + 8}${index + 9}`,
            business_license:
              index % 3 === 0 ? null : `BL${index + 1}${index + 2}${index + 3}`,
            status:
              index % 7 === 0
                ? "rejected"
                : index % 3 === 0
                ? "pending"
                : "approved",
            created_at: createDate.toISOString(),
            address: `Số ${index + 1} Đường ABC, Quận ${
              (index % 5) + 1
            }, TP.HCM`,
          };
        });

      setLandlords(mockLandlords);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc chủ trọ theo điều kiện search và filter
  const filteredLandlords = landlords.filter((landlord) => {
    const matchesSearch =
      landlord.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landlord.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landlord.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landlord.id_card_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || landlord.status === filters.status;

    let matchesDateRange = true;
    const landlordDate = new Date(landlord.created_at);
    const today = new Date();

    if (filters.dateRange === "lastMonth") {
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      matchesDateRange = landlordDate >= lastMonth && landlordDate <= today;
    } else if (filters.dateRange === "last3Months") {
      const last3Months = new Date();
      last3Months.setMonth(today.getMonth() - 3);
      matchesDateRange = landlordDate >= last3Months && landlordDate <= today;
    } else if (filters.dateRange === "thisYear") {
      matchesDateRange = landlordDate.getFullYear() === today.getFullYear();
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Pagination logic
  const indexOfLastLandlord = currentPage * landlordsPerPage;
  const indexOfFirstLandlord = indexOfLastLandlord - landlordsPerPage;
  const currentLandlords = filteredLandlords.slice(
    indexOfFirstLandlord,
    indexOfLastLandlord
  );
  const totalPages = Math.ceil(filteredLandlords.length / landlordsPerPage);

  // Handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Handlers cho modal
  const handleAddLandlord = () => {
    setModalMode("add");
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      id_card_number: "",
      business_license: "",
      address: "",
      status: "pending",
    });
    setShowModal(true);
  };

  const handleEditLandlord = (landlord) => {
    setModalMode("edit");
    setCurrentLandlord(landlord);
    setFormData({
      full_name: landlord.full_name,
      email: landlord.email,
      phone: landlord.phone,
      id_card_number: landlord.id_card_number,
      business_license: landlord.business_license || "",
      address: landlord.address,
      status: landlord.status,
    });
    setShowModal(true);
  };

  const handleViewLandlord = (landlord) => {
    setDetailLandlord(landlord);
    setShowDetailModal(true);
  };

  const handleDeleteLandlord = (landlordId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chủ trọ này?")) {
      setLandlords(landlords.filter((landlord) => landlord.id !== landlordId));
    }
  };

  const handleExportLandlords = () => {
    console.log("Xuất danh sách chủ trọ");
    alert("Đã xuất danh sách chủ trọ!");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveLandlord = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.full_name || !formData.email || !formData.phone) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (modalMode === "add") {
      // Tạo chủ trọ mới
      const newLandlord = {
        id: `landlord_${landlords.length + 1}`,
        ...formData,
        created_at: new Date().toISOString(),
      };

      setLandlords([newLandlord, ...landlords]);
    } else {
      // Cập nhật chủ trọ hiện có
      setLandlords(
        landlords.map((landlord) => {
          if (landlord.id === currentLandlord.id) {
            return {
              ...landlord,
              ...formData,
              updated_at: new Date().toISOString(),
            };
          }
          return landlord;
        })
      );
    }

    setShowModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý chủ trọ</h1>
        <p className="text-gray-600">
          Quản lý danh sách chủ trọ và thông tin chi tiết
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-row justify-between items-center space-x-4">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm chủ trọ..."
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Trạng thái:</label>
              <select
                name="status"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Thời gian:</label>
              <select
                name="dateRange"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.dateRange}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="lastMonth">Tháng gần đây</option>
                <option value="last3Months">3 tháng gần đây</option>
                <option value="thisYear">Năm nay</option>
              </select>
            </div>

            {/* Nút thêm chủ trọ và xuất */}
            <div className="flex space-x-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
                onClick={handleAddLandlord}
              >
                <Plus size={16} className="mr-2" />
                Thêm chủ trọ
              </button>
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 flex items-center text-sm hover:bg-gray-50"
                onClick={handleExportLandlords}
              >
                <Download size={16} className="mr-2" />
                Xuất DS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách chủ trọ */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredLandlords.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            Không tìm thấy chủ trọ nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã Chủ Trọ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Điện Thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Tham Gia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentLandlords.map((landlord) => (
                  <tr key={landlord.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {landlord.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {landlord.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {landlord.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {landlord.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(landlord.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {landlord.status === "approved" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Đã duyệt
                        </span>
                      ) : landlord.status === "pending" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Chờ duyệt
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Từ chối
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewLandlord(landlord)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditLandlord(landlord)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteLandlord(landlord.id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          /* Xuất PDF chủ trọ */
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Download size={18} />
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
                  <span className="font-medium">
                    {indexOfFirstLandlord + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastLandlord, filteredLandlords.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">
                    {filteredLandlords.length}
                  </span>{" "}
                  chủ trọ
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

      {/* Modal chi tiết chủ trọ */}
      {showDetailModal && detailLandlord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết chủ trọ
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin cơ bản */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Thông tin chủ trọ
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Mã chủ trọ:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailLandlord.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Tên chủ trọ:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailLandlord.full_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Email:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailLandlord.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Số điện thoại:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailLandlord.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          CMND/CCCD:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailLandlord.id_card_number}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mt-4 mb-3">
                    Thông tin kinh doanh
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Giấy phép kinh doanh:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailLandlord.business_license || "Chưa cung cấp"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Ngày tham gia:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(
                            detailLandlord.created_at
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Trạng thái:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            detailLandlord.status === "approved"
                              ? "text-green-600"
                              : detailLandlord.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {detailLandlord.status === "approved"
                            ? "Đã duyệt"
                            : detailLandlord.status === "pending"
                            ? "Chờ duyệt"
                            : "Từ chối"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin bổ sung */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Thông tin bổ sung
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md h-full">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">
                          Địa chỉ:
                        </span>
                        <p className="text-sm text-gray-900">
                          {detailLandlord.address || "Chưa cung cấp"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    /* Xuất PDF */
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Xuất PDF
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditLandlord(detailLandlord);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Edit size={16} className="mr-2" />
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm/sửa chủ trọ */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === "add"
                  ? "Thêm chủ trọ mới"
                  : "Sửa thông tin chủ trọ"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveLandlord} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Họ tên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    pattern="[0-9]{10}"
                    title="Số điện thoại phải có 10 chữ số"
                  />
                </div>

                {/* CMND/CCCD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CMND/CCCD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="id_card_number"
                    value={formData.id_card_number}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    pattern="\d{9}|\d{12}"
                    title="CMND/CCCD phải có 9 hoặc 12 chữ số"
                  />
                </div>

                {/* Giấy phép kinh doanh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giấy phép kinh doanh
                  </label>
                  <input
                    type="text"
                    name="business_license"
                    value={formData.business_license}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số giấy phép (nếu có)"
                  />
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Từ chối</option>
                  </select>
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
                  {modalMode === "add" ? "Thêm chủ trọ" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordsManagement;
