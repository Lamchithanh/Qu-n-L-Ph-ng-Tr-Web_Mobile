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
} from "lucide-react";

const AdminContractsManagement = () => {
  // State quản lý danh sách hợp đồng
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    landlord: "all",
    dateRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(10);

  // State cho modal xem chi tiết hợp đồng
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailContract, setDetailContract] = useState(null);

  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  // State cho danh sách chủ trọ và người thuê
  const [landlords, setLandlords] = useState([]);

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

      // Giả lập danh sách phòng trọ
      const mockRooms = Array(30)
        .fill()
        .map((_, index) => ({
          id: `room_${index + 1}`,
          title: `Phòng trọ ${(index % 5) + 1}0${(index % 10) + 1}`,
          room_number: `${(index % 5) + 1}0${(index % 10) + 1}`,
          address: `${index + 100} Đường ${(index % 5) + 1}, Phường ${
            (index % 10) + 1
          }, Quận ${(index % 5) + 1}, TP. Hồ Chí Minh`,
          landlord_id: mockLandlords[index % mockLandlords.length].id,
          landlord_name: mockLandlords[index % mockLandlords.length].name,
          price: 2500000 + (index % 15) * 300000,
          status:
            index % 3 === 0
              ? "occupied"
              : index % 4 === 0
              ? "maintenance"
              : "available",
          area: 20 + (index % 15),
        }));

      // Giả lập danh sách người thuê
      const mockTenants = Array(20)
        .fill()
        .map((_, index) => ({
          id: `tenant_${index + 1}`,
          user_id: `user_${index + 100}`,
          full_name:
            [
              "Nguyễn Văn A",
              "Trần Thị B",
              "Lê Văn C",
              "Phạm Thị D",
              "Hoàng Văn E",
            ][index % 5] + ` ${index + 1}`,
          phone: `097${index}${index + 1}${index + 2}${index + 3}${index + 4}`,
          email: `tenant${index + 1}@example.com`,
          id_card_number: `0${index + 1}${index + 2}${index + 3}${index + 4}${
            index + 5
          }${index + 6}${index + 7}${index + 8}${index + 9}`,
          permanent_address: `${index + 200} Đường ${(index % 8) + 1}, Phường ${
            (index % 12) + 1
          }, Quận ${(index % 7) + 1}, TP. Hồ Chí Minh`,
        }));

      // Giả lập API call cho hợp đồng
      const today = new Date();
      const mockContracts = Array(40)
        .fill()
        .map((_, index) => {
          const startDate = new Date(today);
          startDate.setMonth(today.getMonth() - Math.floor(Math.random() * 12));

          const endDate = new Date(startDate);
          endDate.setFullYear(endDate.getFullYear() + 1);

          // Xác định trạng thái dựa trên ngày bắt đầu và kết thúc
          let status;
          const currentDate = new Date();

          if (endDate < currentDate) {
            status = "expired";
          } else if (index % 10 === 0) {
            status = "terminated";
          } else {
            status = "active";
          }

          const roomIndex = index % mockRooms.length;
          const tenantIndex = index % mockTenants.length;
          const room = mockRooms[roomIndex];
          const tenant = mockTenants[tenantIndex];

          return {
            id: `contract_${index + 1}`,
            room_id: room.id,
            room_number: room.room_number,
            room_title: room.title,
            room_address: room.address,
            landlord_id: room.landlord_id,
            landlord_name: room.landlord_name,
            tenant_id: tenant.id,
            tenant_name: tenant.full_name,
            tenant_phone: tenant.phone,
            tenant_id_card: tenant.id_card_number,
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
            deposit_amount: (room.price * 1.2).toFixed(0),
            monthly_rent: room.price,
            payment_date: (index % 28) + 1, // Ngày thanh toán từ 1-28
            terms_conditions: `Điều khoản hợp đồng cho phòng ${
              room.room_number
            }. Các quy định về việc sử dụng phòng, thanh toán, và quy định chung của nhà trọ.
            
1. Thời hạn hợp đồng: 12 tháng kể từ ngày ký.
2. Thanh toán: Tiền thuê phải được thanh toán đúng hạn vào ngày ${
              (index % 28) + 1
            } hàng tháng.
3. Tiền cọc: Sẽ được hoàn trả khi kết thúc hợp đồng nếu không có hư hại và các khoản phải thanh toán.
4. Trách nhiệm: Người thuê phải giữ phòng sạch sẽ và tuân thủ nội quy nhà trọ.
5. Điều kiện chấm dứt hợp đồng: Thông báo trước ít nhất 30 ngày.`,
            status: status,
            rating:
              status === "expired" || status === "terminated"
                ? Math.floor(Math.random() * 5) + 1
                : null,
            review:
              status === "expired" || status === "terminated"
                ? [
                    "Người thuê tốt, thanh toán đúng hạn",
                    "Giữ phòng sạch sẽ",
                    "Tuân thủ nội quy",
                    "Có vấn đề về thanh toán đôi khi chậm",
                    "Người thuê ổn",
                  ][index % 5]
                : null,
            created_at: new Date(
              startDate.getTime() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          };
        });

      setContracts(mockContracts);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc hợp đồng theo điều kiện search và filter
  const filteredContracts = contracts.filter((contract) => {
    // Tìm kiếm theo mã hợp đồng, tên phòng, tên người thuê, tên chủ trọ
    const matchesSearch =
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.room_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.landlord_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái
    const matchesStatus =
      filters.status === "all" || contract.status === filters.status;

    // Lọc theo chủ trọ
    const matchesLandlord =
      filters.landlord === "all" || contract.landlord_id === filters.landlord;

    // Lọc theo khoảng thời gian
    let matchesDateRange = true;
    const contractStartDate = new Date(contract.start_date);
    const today = new Date();

    if (filters.dateRange === "lastMonth") {
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      matchesDateRange =
        contractStartDate >= lastMonth && contractStartDate <= today;
    } else if (filters.dateRange === "last3Months") {
      const last3Months = new Date();
      last3Months.setMonth(today.getMonth() - 3);
      matchesDateRange =
        contractStartDate >= last3Months && contractStartDate <= today;
    } else if (filters.dateRange === "last6Months") {
      const last6Months = new Date();
      last6Months.setMonth(today.getMonth() - 6);
      matchesDateRange =
        contractStartDate >= last6Months && contractStartDate <= today;
    }

    return (
      matchesSearch && matchesStatus && matchesLandlord && matchesDateRange
    );
  });

  // Pagination logic
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstContract,
    indexOfLastContract
  );
  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

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

  // Handler xem chi tiết hợp đồng
  const handleViewContract = (contract) => {
    setDetailContract(contract);
    setShowDetailModal(true);
  };

  // Handler mở modal xác nhận xóa hợp đồng
  const handleDeletePrompt = (contract) => {
    setContractToDelete(contract);
    setShowDeleteModal(true);
  };

  // Handler xóa hợp đồng
  const handleDeleteContract = () => {
    setContracts(
      contracts.filter((contract) => contract.id !== contractToDelete.id)
    );
    setShowDeleteModal(false);
    setContractToDelete(null);
  };

  // Handler tạo file Excel báo cáo
  const handleExportExcel = () => {
    console.log(`Xuất báo cáo Excel`);
    // Trong thực tế, sẽ gọi API để tạo và tải file Excel
    alert("Đã tạo và tải xuống file Excel báo cáo hợp đồng!");
  };

  // Handler tạo file PDF báo cáo
  const handleExportPDF = () => {
    console.log(`Xuất báo cáo PDF`);
    // Trong thực tế, sẽ gọi API để tạo và tải file PDF
    alert("Đã tạo và tải xuống file PDF báo cáo hợp đồng!");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý hợp đồng</h1>
        <p className="text-gray-600">
          Quản lý và giám sát tất cả hợp đồng trong hệ thống
        </p>
      </div>

      {/* Thanh công cụ và bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm hợp đồng, phòng, người thuê..."
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
                <option value="expired">Đã hết hạn</option>
                <option value="terminated">Đã chấm dứt</option>
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
                <option value="last6Months">6 tháng gần đây</option>
              </select>
            </div>

            {/* Nút xuất báo cáo */}
            <div className="flex space-x-2 ml-auto">
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 flex items-center text-sm hover:bg-gray-50"
                onClick={handleExportExcel}
              >
                <ArrowDownToLine size={16} className="mr-1" />
                Xuất Excel
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

      {/* Danh sách hợp đồng */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            Không tìm thấy hợp đồng nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã hợp đồng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ trọ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng trọ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiền thuê
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
                {currentContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {contract.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(contract.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contract.landlord_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contract.room_title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contract.tenant_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contract.tenant_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(contract.start_date).toLocaleDateString(
                          "vi-VN"
                        )}{" "}
                        - <br />
                        {new Date(contract.end_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium text-gray-900">
                        {contract.monthly_rent.toLocaleString()} đ/tháng
                      </div>
                      <div className="text-xs text-gray-500">
                        Cọc:{" "}
                        {parseInt(contract.deposit_amount).toLocaleString()} đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contract.status === "active" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Đang hoạt động
                        </span>
                      ) : contract.status === "expired" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Đã hết hạn
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Đã chấm dứt
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewContract(contract)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePrompt(contract)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa hợp đồng"
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
                  <span className="font-medium">
                    {indexOfFirstContract + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastContract, filteredContracts.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">
                    {filteredContracts.length}
                  </span>{" "}
                  hợp đồng
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

      {/* Modal chi tiết hợp đồng */}
      {showDetailModal && detailContract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết hợp đồng
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
                      Thông tin hợp đồng
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Mã hợp đồng:</span>{" "}
                        {detailContract.id}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Ngày tạo:</span>{" "}
                        {new Date(detailContract.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Trạng thái:</span>{" "}
                        {detailContract.status === "active" ? (
                          <span className="text-green-600">Đang hoạt động</span>
                        ) : detailContract.status === "expired" ? (
                          <span className="text-gray-600">Đã hết hạn</span>
                        ) : (
                          <span className="text-red-600">Đã chấm dứt</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Ngày bắt đầu:</span>{" "}
                        {new Date(detailContract.start_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ngày kết thúc:</span>{" "}
                        {new Date(detailContract.end_date).toLocaleDateString(
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
                            {detailContract.landlord_name}
                          </p>
                        </div>
                      </div>
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

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Thông tin người thuê
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {detailContract.tenant_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {detailContract.tenant_phone}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">CMND/CCCD:</span>{" "}
                        {detailContract.tenant_id_card}
                      </p>
                      <button
                        className="text-blue-600 hover:underline text-sm flex items-center"
                        onClick={() =>
                          alert(
                            "Chức năng xem hồ sơ người thuê đang được phát triển"
                          )
                        }
                      >
                        <Eye size={16} className="mr-1" /> Xem hồ sơ người thuê
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cột 2: Thông tin phòng và thanh toán */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Thông tin phòng trọ
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Tên phòng:</span>{" "}
                        {detailContract.room_title}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Mã phòng:</span>{" "}
                        {detailContract.room_number}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Địa chỉ:</span>{" "}
                        {detailContract.room_address}
                      </p>
                      <button
                        className="text-blue-600 hover:underline text-sm flex items-center"
                        onClick={() =>
                          alert(
                            "Chức năng xem chi tiết phòng đang được phát triển"
                          )
                        }
                      >
                        <Home size={16} className="mr-1" /> Xem chi tiết phòng
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Thông tin thanh toán
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          Tiền thuê hàng tháng:
                        </span>{" "}
                        {detailContract.monthly_rent.toLocaleString()} đ
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Tiền cọc:</span>{" "}
                        {parseInt(
                          detailContract.deposit_amount
                        ).toLocaleString()}{" "}
                        đ
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          Ngày thanh toán hàng tháng:
                        </span>{" "}
                        Ngày {detailContract.payment_date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cột 3: Điều khoản, đánh giá và cảnh báo vi phạm */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Điều khoản hợp đồng
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md h-56 overflow-y-auto">
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {detailContract.terms_conditions}
                      </p>
                    </div>
                  </div>

                  {(detailContract.status === "expired" ||
                    detailContract.status === "terminated") && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Đánh giá người thuê
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {detailContract.rating ? (
                          <>
                            <div className="flex items-center mb-2">
                              <div className="flex mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < detailContract.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-gray-700">
                                {detailContract.rating}/5
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {detailContract.review || "Không có nhận xét"}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Chưa có đánh giá
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Shield size={20} className="text-red-500 mr-2" /> Quản lý
                      vi phạm
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cảnh báo vi phạm
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">-- Chọn loại vi phạm --</option>
                          <option value="terms">
                            Vi phạm điều khoản hợp đồng
                          </option>
                          <option value="payment">Vi phạm thanh toán</option>
                          <option value="property">Hư hỏng tài sản</option>
                          <option value="rules">Vi phạm nội quy</option>
                          <option value="illegal">Hoạt động phi pháp</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ghi chú
                        </label>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                          placeholder="Nhập mô tả chi tiết vi phạm..."
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm flex items-center"
                          onClick={() =>
                            alert(
                              "Chức năng cảnh báo vi phạm đang được phát triển"
                            )
                          }
                        >
                          <AlertCircle size={16} className="mr-1" />
                          Gửi cảnh báo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => handleExportPDF()}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 flex items-center text-sm hover:bg-gray-50"
                >
                  <Download size={16} className="mr-2" />
                  Xuất PDF
                </button>
                <button
                  onClick={() => handleDeletePrompt(detailContract)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Xóa hợp đồng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa hợp đồng */}
      {showDeleteModal && contractToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xác nhận xóa hợp đồng
              </h3>
              <p className="text-gray-500 mb-4">
                Bạn có chắc chắn muốn xóa hợp đồng{" "}
                <span className="font-medium">{contractToDelete.id}</span>{" "}
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
                  onClick={handleDeleteContract}
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

export default AdminContractsManagement;
