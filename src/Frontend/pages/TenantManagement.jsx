import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  FileText,
  CreditCard,
  Clock,
  MoreVertical,
  X,
} from "lucide-react";
import TenantServiceDetailModal from "../components/TenantServiceDetailModal";

// Định nghĩa trạng thái người thuê
const TENANT_STATUS = {
  ACTIVE: {
    value: "active",
    label: "Đang Thuê",
    color: "bg-green-500",
  },
  PENDING: {
    value: "pending",
    label: "Chờ Xác Nhận",
    color: "bg-yellow-500",
  },
  EXPIRED: {
    value: "expired",
    label: "Hết Hạn",
    color: "bg-red-500",
  },
};

// Trang Quản Lý Người Thuê
const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mô phỏng dữ liệu người thuê từ backend
  useEffect(() => {
    const mockTenants = [
      {
        id: 1,
        fullName: "Nguyễn Văn A",
        phoneNumber: "0912345678",
        email: "nguyenvana@example.com",
        roomNumber: "P101",
        startDate: "01/01/2024",
        status: "active",
      },
      {
        id: 2,
        fullName: "Trần Thị B",
        phoneNumber: "0987654321",
        email: "tranthib@example.com",
        roomNumber: "P203",
        startDate: "15/02/2024",
        status: "pending",
      },
      {
        id: 3,
        fullName: "Lê Văn C",
        phoneNumber: "0909090909",
        email: "levanc@example.com",
        roomNumber: "P305",
        startDate: "01/12/2023",
        status: "expired",
      },
    ];

    setTenants(mockTenants);
  }, []);

  // Lọc và tìm kiếm người thuê
  useEffect(() => {
    let result = tenants;

    if (statusFilter !== "all") {
      result = result.filter((tenant) => tenant.status === statusFilter);
    }

    if (searchTerm) {
      result = result.filter(
        (tenant) =>
          tenant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenant.phoneNumber.includes(searchTerm) ||
          tenant.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTenants(result);
  }, [tenants, statusFilter, searchTerm]);

  // Xử lý các hành động
  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedTenant(null);
  };

  const handleEditTenant = (tenant) => {
    // Logic chỉnh sửa người thuê
    console.log("Chỉnh sửa:", tenant);
  };

  const handleDeleteTenant = (tenantId) => {
    // Logic xóa người thuê
    setTenants((prev) => prev.filter((tenant) => tenant.id !== tenantId));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Tiêu Đề và Công Cụ */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Users className="mr-3 text-indigo-600" size={32} />
          Quản Lý Người Thuê
        </h1>

        <div className="flex items-center space-x-4">
          {/* Ô Tìm Kiếm */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm người thuê..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full w-full md:w-64 focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>

          {/* Bộ Lọc Trạng Thái */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tất Cả Trạng Thái</option>
              {Object.values(TENANT_STATUS).map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>

          {/* Nút Thêm Mới */}
          <button
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            title="Thêm Người Thuê Mới"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Danh Sách Người Thuê */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ Và Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Điện Thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phòng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTenants.map((tenant) => (
              <tr
                key={tenant.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {tenant.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {tenant.phoneNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {tenant.roomNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`
                      inline-block px-3 py-1 rounded-full text-xs text-white 
                      ${TENANT_STATUS[tenant.status.toUpperCase()].color}
                    `}
                  >
                    {TENANT_STATUS[tenant.status.toUpperCase()].label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewTenant(tenant)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Xem Chi Tiết"
                    >
                      <FileText size={20} />
                    </button>
                    <button
                      onClick={() => handleEditTenant(tenant)}
                      className="text-green-600 hover:text-green-900"
                      title="Chỉnh Sửa"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteTenant(tenant.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Thông Báo Khi Không Có Dữ Liệu */}
        {filteredTenants.length === 0 && (
          <div className="text-center py-10 bg-gray-50">
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">
              Không có người thuê nào được tìm thấy
            </p>
          </div>
        )}
      </div>

      {/* Modal Chi Tiết Người Thuê */}
      {showDetailModal && selectedTenant && (
        <TenantServiceDetailModal
          tenant={selectedTenant}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
};

export default TenantManagement;
