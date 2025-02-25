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
} from "lucide-react";

const ContractsManagement = () => {
  // State quản lý danh sách hợp đồng
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    room: "all",
    dateRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(8);

  // State cho modal thêm/sửa hợp đồng
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'
  const [currentContract, setCurrentContract] = useState(null);

  // State cho detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailContract, setDetailContract] = useState(null);

  // State cho form thêm/sửa hợp đồng
  const [formData, setFormData] = useState({
    room_id: "",
    tenant_id: "",
    start_date: "",
    end_date: "",
    deposit_amount: "",
    monthly_rent: "",
    payment_date: 5, // Mặc định là ngày 5 hàng tháng
    terms_conditions: "",
    status: "active",
  });

  // Danh sách phòng trọ (giả lập)
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);

  // Giả lập dữ liệu
  useEffect(() => {
    // Giả lập API call cho phòng trọ
    setTimeout(() => {
      const mockRooms = Array(20)
        .fill()
        .map((_, index) => ({
          id: `room_${index + 1}`,
          room_number: `${(index % 5) + 1}0${(index % 10) + 1}`,
          floor: (index % 5) + 1,
          status:
            index % 3 === 0
              ? "occupied"
              : index % 4 === 0
              ? "maintenance"
              : "available",
        }));
      setRooms(mockRooms);

      // Giả lập API call cho người thuê
      const mockTenants = Array(15)
        .fill()
        .map((_, index) => ({
          id: `tenant_${index + 1}`,
          full_name:
            [
              "Nguyễn Văn A",
              "Trần Thị B",
              "Lê Văn C",
              "Phạm Thị D",
              "Hoàng Văn E",
            ][index % 5] + ` ${index + 1}`,
          phone: `098${index}${index + 1}${index + 2}${index + 3}${index + 4}`,
          email: `tenant${index + 1}@example.com`,
          id_card_number: `0${index + 1}${index + 2}${index + 3}${index + 4}${
            index + 5
          }${index + 6}${index + 7}${index + 8}${index + 9}`,
        }));
      setTenants(mockTenants);

      // Giả lập API call cho hợp đồng
      const today = new Date();
      const mockContracts = Array(25)
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

          return {
            id: `contract_${index + 1}`,
            room_id: mockRooms[index % mockRooms.length].id,
            room_number: mockRooms[index % mockRooms.length].room_number,
            tenant_id: mockTenants[index % mockTenants.length].id,
            tenant_name: mockTenants[index % mockTenants.length].full_name,
            tenant_phone: mockTenants[index % mockTenants.length].phone,
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
            deposit_amount: 3000000 + (index % 10) * 500000,
            monthly_rent: 2500000 + (index % 15) * 300000,
            payment_date: (index % 8) + 1, // Ngày thanh toán từ 1-8
            terms_conditions: `Điều khoản hợp đồng cho phòng ${
              mockRooms[index % mockRooms.length].room_number
            }. Các quy định về việc sử dụng phòng, thanh toán, và quy định chung của nhà trọ.`,
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
          };
        });

      setContracts(mockContracts);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc hợp đồng theo điều kiện search và filter
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || contract.status === filters.status;
    const matchesRoom =
      filters.room === "all" || contract.room_id === filters.room;

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

    return matchesSearch && matchesStatus && matchesRoom && matchesDateRange;
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

  // Handler mở modal thêm hợp đồng mới
  const handleAddContract = () => {
    setModalMode("add");
    setFormData({
      room_id: "",
      tenant_id: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      deposit_amount: "",
      monthly_rent: "",
      payment_date: 5,
      terms_conditions:
        "Các điều khoản hợp đồng căn bản:\n\n1. Thời hạn hợp đồng: 12 tháng kể từ ngày ký.\n2. Thanh toán: Tiền thuê phải được thanh toán đúng hạn vào ngày thanh toán đã thỏa thuận hàng tháng.\n3. Tiền cọc: Sẽ được hoàn trả khi kết thúc hợp đồng nếu không có hư hại và các khoản phải thanh toán.\n4. Trách nhiệm: Người thuê phải giữ phòng sạch sẽ và tuân thủ nội quy nhà trọ.",
      status: "active",
    });
    setShowModal(true);
  };

  // Handler mở modal sửa hợp đồng
  const handleEditContract = (contract) => {
    setModalMode("edit");
    setCurrentContract(contract);
    setFormData({
      room_id: contract.room_id,
      tenant_id: contract.tenant_id,
      start_date: contract.start_date,
      end_date: contract.end_date,
      deposit_amount: contract.deposit_amount,
      monthly_rent: contract.monthly_rent,
      payment_date: contract.payment_date,
      terms_conditions: contract.terms_conditions,
      status: contract.status,
      rating: contract.rating || "",
      review: contract.review || "",
    });
    setShowModal(true);
  };

  // Handler xem chi tiết hợp đồng
  const handleViewContract = (contract) => {
    setDetailContract(contract);
    setShowDetailModal(true);
  };

  // Handler xóa hợp đồng
  const handleDeleteContract = (contractId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này?")) {
      setContracts(contracts.filter((contract) => contract.id !== contractId));
    }
  };

  // Handler cho việc thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler tính toán tiền thuê khi chọn phòng
  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      room_id: roomId,
    }));

    // Trong thực tế, bạn có thể call API để lấy giá phòng
    // Ở đây giả lập với giá cố định cho các phòng
    if (roomId) {
      const selectedRoom = rooms.find((room) => room.id === roomId);
      if (selectedRoom) {
        const roomNumber = parseInt(selectedRoom.room_number);
        const estimatedRent = 2500000 + (roomNumber % 10) * 200000;
        setFormData((prev) => ({
          ...prev,
          monthly_rent: estimatedRent,
          deposit_amount: estimatedRent,
        }));
      }
    }
  };

  // Handler lưu thông tin hợp đồng
  const handleSaveContract = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.room_id ||
      !formData.tenant_id ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.deposit_amount ||
      !formData.monthly_rent
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Kiểm tra ngày bắt đầu và kết thúc
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (startDate >= endDate) {
      alert("Ngày kết thúc hợp đồng phải sau ngày bắt đầu!");
      return;
    }

    // Lấy thông tin phòng và người thuê
    const selectedRoom = rooms.find((room) => room.id === formData.room_id);
    const selectedTenant = tenants.find(
      (tenant) => tenant.id === formData.tenant_id
    );

    if (modalMode === "add") {
      // Tạo hợp đồng mới
      const newContract = {
        id: `contract_${contracts.length + 1}`,
        ...formData,
        room_number: selectedRoom.room_number,
        tenant_name: selectedTenant.full_name,
        tenant_phone: selectedTenant.phone,
        created_at: new Date().toISOString(),
      };

      setContracts([newContract, ...contracts]);
    } else {
      // Cập nhật hợp đồng hiện có
      setContracts(
        contracts.map((contract) => {
          if (contract.id === currentContract.id) {
            return {
              ...contract,
              ...formData,
              room_number: selectedRoom.room_number,
              tenant_name: selectedTenant.full_name,
              tenant_phone: selectedTenant.phone,
              updated_at: new Date().toISOString(),
            };
          }
          return contract;
        })
      );
    }

    setShowModal(false);
  };

  // Handler tạo file PDF hợp đồng
  const handleExportContract = (contractId) => {
    console.log(`Xuất hợp đồng ${contractId} dưới dạng PDF`);
    // Trong thực tế, sẽ gọi API để tạo và tải file PDF
    alert("Đã tạo và tải xuống file PDF hợp đồng!");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý hợp đồng</h1>
        <p className="text-gray-600">
          Quản lý danh sách hợp đồng thuê phòng và thông tin chi tiết
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm hợp đồng..."
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
                  <option value="expired">Đã hết hạn</option>
                  <option value="terminated">Đã chấm dứt</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Phòng:</label>
                <select
                  name="room"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.room}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tất cả phòng</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Phòng {room.room_number}
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
            </div>

            {/* Nút thêm hợp đồng */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 ml-auto"
              onClick={handleAddContract}
            >
              <Plus size={16} className="mr-2" />
              Thêm hợp đồng
            </button>
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
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã hợp đồng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {contract.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Phòng {contract.room_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contract.tenant_name}
                      </div>
                      <div className="text-sm text-gray-500">
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
                      <div className="text-sm text-gray-500">
                        Cọc: {contract.deposit_amount.toLocaleString()} đ
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
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditContract(contract)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteContract(contract.id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleExportContract(contract.id)}
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

      {/* Modal thêm/sửa hợp đồng */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === "add"
                  ? "Thêm hợp đồng mới"
                  : "Sửa thông tin hợp đồng"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveContract} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phòng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="room_id"
                    value={formData.room_id}
                    onChange={handleRoomChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Chọn phòng --</option>
                    {rooms
                      .filter(
                        (room) =>
                          room.status !== "occupied" ||
                          (currentContract &&
                            currentContract.room_id === room.id)
                      )
                      .map((room) => (
                        <option key={room.id} value={room.id}>
                          Phòng {room.room_number} (Tầng {room.floor})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Người thuê */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người thuê <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tenant_id"
                    value={formData.tenant_id}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Chọn người thuê --</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.full_name} - {tenant.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ngày bắt đầu hợp đồng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <Calendar
                        className="absolute right-3 top-2.5 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                {/* Ngày kết thúc hợp đồng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <Calendar
                        className="absolute right-3 top-2.5 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                {/* Tiền cọc */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiền cọc (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="deposit_amount"
                    value={formData.deposit_amount}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số tiền cọc"
                    min="0"
                    step="100000"
                    required
                  />
                </div>

                {/* Tiền thuê hàng tháng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiền thuê hàng tháng (VNĐ){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="monthly_rent"
                    value={formData.monthly_rent}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiền thuê hàng tháng"
                    min="0"
                    step="100000"
                    required
                  />
                </div>

                {/* Ngày thanh toán và Trạng thái hợp đồng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày thanh toán hàng tháng{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {[...Array(28)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        Ngày {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái hợp đồng <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="expired">Đã hết hạn</option>
                    <option value="terminated">Đã chấm dứt</option>
                  </select>
                </div>

                {/* Điều khoản hợp đồng */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Điều khoản hợp đồng <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="terms_conditions"
                    value={formData.terms_conditions}
                    onChange={handleFormChange}
                    rows="6"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập các điều khoản của hợp đồng"
                    required
                  ></textarea>
                </div>

                {/* Đánh giá (nếu hợp đồng đã kết thúc) */}
                {modalMode === "edit" &&
                  (formData.status === "expired" ||
                    formData.status === "terminated") && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Đánh giá của chủ trọ (1-5 sao)
                        </label>
                        <select
                          name="rating"
                          value={formData.rating}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Chọn đánh giá --</option>
                          <option value="1">1 sao (Không tốt)</option>
                          <option value="2">2 sao (Bình thường)</option>
                          <option value="3">3 sao (Khá)</option>
                          <option value="4">4 sao (Tốt)</option>
                          <option value="5">5 sao (Rất tốt)</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nhận xét về người thuê
                        </label>
                        <textarea
                          name="review"
                          value={formData.review}
                          onChange={handleFormChange}
                          rows="3"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập nhận xét về người thuê phòng"
                        ></textarea>
                      </div>
                    </>
                  )}
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
                  {modalMode === "add" ? "Thêm hợp đồng" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
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
                {/* Cột 1: Thông tin cơ bản */}
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
                        <span className="font-medium">Phòng:</span> Phòng{" "}
                        {detailContract.room_number}
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
                      <button className="text-blue-600 hover:underline text-sm flex items-center">
                        <Eye size={16} className="mr-1" /> Xem hồ sơ người thuê
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cột 2: Thông tin thanh toán */}
                <div className="space-y-6">
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
                        {detailContract.deposit_amount.toLocaleString()} đ
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          Ngày thanh toán hàng tháng:
                        </span>{" "}
                        Ngày {detailContract.payment_date}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Lịch sử thanh toán
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium">Tháng 2/2025</p>
                            <p className="text-xs text-gray-500">
                              Thanh toán ngày 04/02/2025
                            </p>
                          </div>
                          <span className="text-green-600 flex items-center">
                            <CheckCircle size={14} className="mr-1" /> Đã thanh
                            toán
                          </span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium">Tháng 1/2025</p>
                            <p className="text-xs text-gray-500">
                              Thanh toán ngày 03/01/2025
                            </p>
                          </div>
                          <span className="text-green-600 flex items-center">
                            <CheckCircle size={14} className="mr-1" /> Đã thanh
                            toán
                          </span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium">Tháng 12/2024</p>
                            <p className="text-xs text-gray-500">
                              Thanh toán ngày 07/12/2024
                            </p>
                          </div>
                          <span className="text-amber-600 flex items-center">
                            <Clock size={14} className="mr-1" /> Trễ hạn 2 ngày
                          </span>
                        </li>
                      </ul>
                      <button className="mt-3 text-blue-600 hover:underline text-sm">
                        Xem tất cả lịch sử thanh toán
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cột 3: Điều khoản và đánh giá */}
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
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => handleExportContract(detailContract.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Xuất PDF
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditContract(detailContract);
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
    </div>
  );
};

export default ContractsManagement;
