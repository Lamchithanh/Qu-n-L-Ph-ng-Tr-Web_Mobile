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
  DollarSign,
  FileText,
} from "lucide-react";

const InvoicesManagement = () => {
  // State quản lý danh sách hóa đơn
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    contract: "all",
    dateRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(8);

  // State cho modal thêm/sửa hóa đơn
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'
  const [currentInvoice, setCurrentInvoice] = useState(null);

  // State cho detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState(null);

  // State cho form thêm/sửa hóa đơn
  const [formData, setFormData] = useState({
    contract_id: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    room_fee: 0,
    services_fee: [],
    total_amount: 0,
    due_date: "",
    status: "pending",
    note: "",
  });

  // State cho dịch vụ mới
  const [newService, setNewService] = useState({
    name: "",
    amount: "",
  });

  // Danh sách hợp đồng (giả lập)
  const [contracts, setContracts] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([
    { id: "service_1", name: "Điện" },
    { id: "service_2", name: "Nước" },
    { id: "service_3", name: "Internet" },
    { id: "service_4", name: "Dịch vụ vệ sinh" },
    { id: "service_5", name: "Phí gửi xe" },
    { id: "service_6", name: "Phí an ninh" },
  ]);

  // Giả lập dữ liệu
  useEffect(() => {
    // Giả lập API call cho hợp đồng
    setTimeout(() => {
      const mockContracts = Array(20)
        .fill()
        .map((_, index) => ({
          id: `contract_${index + 1}`,
          room_number: `${(index % 5) + 1}0${(index % 10) + 1}`,
          tenant_name:
            [
              "Nguyễn Văn A",
              "Trần Thị B",
              "Lê Văn C",
              "Phạm Thị D",
              "Hoàng Văn E",
            ][index % 5] + ` ${index + 1}`,
          tenant_phone: `098${index}${index + 1}${index + 2}${index + 3}${
            index + 4
          }`,
          monthly_rent: 2500000 + (index % 15) * 300000,
          status: index % 10 !== 0 ? "active" : "terminated",
        }));
      setContracts(mockContracts);

      // Giả lập API call cho hóa đơn
      const today = new Date();
      const mockInvoices = Array(30)
        .fill()
        .map((_, index) => {
          const invoiceDate = new Date(today);
          invoiceDate.setMonth(today.getMonth() - (index % 12));
          invoiceDate.setDate(1);

          const dueDate = new Date(invoiceDate);
          dueDate.setDate(10); // Hạn thanh toán là ngày 10 hàng tháng

          // Xác định trạng thái dựa trên ngày
          let status;
          const currentDate = new Date();

          if (index % 7 === 0) {
            status = "overdue";
          } else if (index % 3 === 0) {
            status = "pending";
          } else {
            status = "paid";
          }

          const selectedContract = mockContracts[index % mockContracts.length];
          const roomFee = selectedContract.monthly_rent;

          // Tạo danh sách dịch vụ ngẫu nhiên
          const services = [];
          const usedServices = new Set();
          const numServices = Math.floor(Math.random() * 4) + 1; // 1-4 dịch vụ

          for (let i = 0; i < numServices; i++) {
            let serviceIndex;
            do {
              serviceIndex = Math.floor(Math.random() * serviceOptions.length);
            } while (usedServices.has(serviceIndex));

            usedServices.add(serviceIndex);

            const service = {
              id: serviceOptions[serviceIndex].id,
              name: serviceOptions[serviceIndex].name,
              amount: Math.floor(Math.random() * 500000) + 100000,
            };

            services.push(service);
          }

          // Tính tổng tiền
          const serviceTotal = services.reduce(
            (sum, service) => sum + service.amount,
            0
          );
          const totalAmount = roomFee + serviceTotal;

          return {
            id: `invoice_${index + 1}`,
            contract_id: selectedContract.id,
            contract_room: selectedContract.room_number,
            contract_tenant: selectedContract.tenant_name,
            month: invoiceDate.getMonth() + 1,
            year: invoiceDate.getFullYear(),
            month_year: `${
              invoiceDate.getMonth() + 1
            }/${invoiceDate.getFullYear()}`,
            room_fee: roomFee,
            services_fee: services,
            total_amount: totalAmount,
            due_date: dueDate.toISOString().split("T")[0],
            created_date: invoiceDate.toISOString().split("T")[0],
            status: status,
            payment_date:
              status === "paid"
                ? new Date(dueDate.getTime() - Math.random() * 5 * 86400000)
                    .toISOString()
                    .split("T")[0]
                : null,
            note:
              index % 5 === 0 ? "Thanh toán trễ sẽ phát sinh phí phạt 5%" : "",
          };
        });

      setInvoices(mockInvoices);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc hóa đơn theo điều kiện search và filter
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.contract_room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.contract_tenant
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || invoice.status === filters.status;
    const matchesContract =
      filters.contract === "all" || invoice.contract_id === filters.contract;

    let matchesDateRange = true;
    const invoiceDate = new Date(invoice.year, invoice.month - 1, 1);
    const today = new Date();

    if (filters.dateRange === "current") {
      matchesDateRange =
        invoiceDate.getMonth() === today.getMonth() &&
        invoiceDate.getFullYear() === today.getFullYear();
    } else if (filters.dateRange === "last3Months") {
      const last3Months = new Date();
      last3Months.setMonth(today.getMonth() - 3);
      matchesDateRange = invoiceDate >= last3Months;
    } else if (filters.dateRange === "thisYear") {
      matchesDateRange = invoiceDate.getFullYear() === today.getFullYear();
    }

    return (
      matchesSearch && matchesStatus && matchesContract && matchesDateRange
    );
  });

  // Pagination logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

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

  // Handler mở modal thêm hóa đơn mới
  const handleAddInvoice = () => {
    const currentDate = new Date();
    const dueDate = new Date(currentDate);
    dueDate.setDate(10); // Mặc định ngày 10 hàng tháng

    setModalMode("add");
    setFormData({
      contract_id: "",
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      room_fee: 0,
      services_fee: [],
      total_amount: 0,
      due_date: dueDate.toISOString().split("T")[0],
      status: "pending",
      note: "",
    });
    setShowModal(true);
  };

  // Handler mở modal sửa hóa đơn
  const handleEditInvoice = (invoice) => {
    setModalMode("edit");
    setCurrentInvoice(invoice);
    setFormData({
      contract_id: invoice.contract_id,
      month: invoice.month,
      year: invoice.year,
      room_fee: invoice.room_fee,
      services_fee: [...invoice.services_fee],
      total_amount: invoice.total_amount,
      due_date: invoice.due_date,
      status: invoice.status,
      payment_date: invoice.payment_date || "",
      note: invoice.note || "",
    });
    setShowModal(true);
  };

  // Handler xem chi tiết hóa đơn
  const handleViewInvoice = (invoice) => {
    setDetailInvoice(invoice);
    setShowDetailModal(true);
  };

  // Handler xóa hóa đơn
  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) {
      setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId));
    }
  };

  // Handler cho việc thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Nếu thay đổi hợp đồng, cập nhật tiền phòng
    if (name === "contract_id" && value) {
      const selectedContract = contracts.find(
        (contract) => contract.id === value
      );
      if (selectedContract) {
        setFormData((prev) => ({
          ...prev,
          room_fee: selectedContract.monthly_rent,
          total_amount:
            selectedContract.monthly_rent +
            prev.services_fee.reduce(
              (sum, service) => sum + parseInt(service.amount),
              0
            ),
        }));
      }
    }
  };

  // Handler thêm dịch vụ
  const handleAddService = () => {
    if (!newService.name || !newService.amount) {
      alert("Vui lòng nhập đầy đủ thông tin dịch vụ!");
      return;
    }

    const amount = parseInt(newService.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Giá dịch vụ phải là số dương!");
      return;
    }

    const serviceToAdd = {
      id: `temp_service_${Date.now()}`,
      name: newService.name,
      amount: amount,
    };

    const updatedServices = [...formData.services_fee, serviceToAdd];
    const newTotal =
      formData.room_fee +
      updatedServices.reduce((sum, service) => sum + service.amount, 0);

    setFormData((prev) => ({
      ...prev,
      services_fee: updatedServices,
      total_amount: newTotal,
    }));

    // Reset form dịch vụ
    setNewService({
      name: "",
      amount: "",
    });
  };

  // Handler xóa dịch vụ
  const handleRemoveService = (serviceId) => {
    const updatedServices = formData.services_fee.filter(
      (service) => service.id !== serviceId
    );
    const newTotal =
      formData.room_fee +
      updatedServices.reduce((sum, service) => sum + service.amount, 0);

    setFormData((prev) => ({
      ...prev,
      services_fee: updatedServices,
      total_amount: newTotal,
    }));
  };

  // Handler lưu thông tin hóa đơn
  const handleSaveInvoice = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.contract_id || !formData.due_date) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Lấy thông tin hợp đồng
    const selectedContract = contracts.find(
      (contract) => contract.id === formData.contract_id
    );

    if (modalMode === "add") {
      // Tạo hóa đơn mới
      const newInvoice = {
        id: `invoice_${invoices.length + 1}`,
        ...formData,
        contract_room: selectedContract.room_number,
        contract_tenant: selectedContract.tenant_name,
        month_year: `${formData.month}/${formData.year}`,
        created_date: new Date().toISOString().split("T")[0],
      };

      setInvoices([newInvoice, ...invoices]);
    } else {
      // Cập nhật hóa đơn hiện có
      setInvoices(
        invoices.map((invoice) => {
          if (invoice.id === currentInvoice.id) {
            return {
              ...invoice,
              ...formData,
              contract_room: selectedContract.room_number,
              contract_tenant: selectedContract.tenant_name,
              month_year: `${formData.month}/${formData.year}`,
              updated_at: new Date().toISOString().split("T")[0],
            };
          }
          return invoice;
        })
      );
    }

    setShowModal(false);
  };

  // Handler tạo file PDF hóa đơn
  const handleExportInvoice = (invoiceId) => {
    console.log(`Xuất hóa đơn ${invoiceId} dưới dạng PDF`);
    // Trong thực tế, sẽ gọi API để tạo và tải file PDF
    alert("Đã tạo và tải xuống file PDF hóa đơn!");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn</h1>
        <p className="text-gray-600">
          Quản lý danh sách hóa đơn hàng tháng và thông tin thanh toán
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-row justify-between items-center space-x-4">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm hóa đơn..."
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
                <option value="pending">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="overdue">Quá hạn</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Hợp đồng:</label>
              <select
                name="contract"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.contract}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả hợp đồng</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    Phòng {contract.room_number} - {contract.tenant_name}
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
                <option value="current">Tháng hiện tại</option>
                <option value="last3Months">3 tháng gần đây</option>
                <option value="thisYear">Năm nay</option>
              </select>
            </div>

            {/* Nút thêm hóa đơn */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
              onClick={handleAddInvoice}
            >
              <Plus size={16} className="mr-2" />
              Thêm hóa đơn
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách hóa đơn */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            Không tìm thấy hóa đơn nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã hóa đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng/Người thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tháng/Năm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hạn thanh toán
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
                {currentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {invoice.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(invoice.created_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Phòng {invoice.contract_room}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.contract_tenant}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Tháng {invoice.month}/{invoice.year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {invoice.total_amount.toLocaleString()} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.due_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.status === "paid" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Đã thanh toán
                        </span>
                      ) : invoice.status === "pending" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Chưa thanh toán
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Quá hạn
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditInvoice(invoice)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleExportInvoice(invoice.id)}
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
                  <span className="font-medium">{indexOfFirstInvoice + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastInvoice, filteredInvoices.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{filteredInvoices.length}</span>{" "}
                  hóa đơn
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

      {/* Modal chi tiết hóa đơn */}
      {showDetailModal && detailInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết hóa đơn
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
                    Thông tin hóa đơn
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Mã hóa đơn:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Ngày tạo:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(
                            detailInvoice.created_date
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Hợp đồng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.contract_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Phòng:
                        </span>
                        <span className="text-sm text-gray-900">
                          Phòng {detailInvoice.contract_room}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Người thuê:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.contract_tenant}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Kỳ thanh toán:
                        </span>
                        <span className="text-sm text-gray-900">
                          Tháng {detailInvoice.month}/{detailInvoice.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mt-4 mb-3">
                    Thông tin thanh toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Trạng thái:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            detailInvoice.status === "paid"
                              ? "text-green-600"
                              : detailInvoice.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {detailInvoice.status === "paid"
                            ? "Đã thanh toán"
                            : detailInvoice.status === "pending"
                            ? "Chưa thanh toán"
                            : "Quá hạn"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Hạn thanh toán:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(detailInvoice.due_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      {detailInvoice.status === "paid" &&
                        detailInvoice.payment_date && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">
                              Ngày thanh toán:
                            </span>
                            <span className="text-sm text-gray-900">
                              {new Date(
                                detailInvoice.payment_date
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        )}
                      {detailInvoice.note && (
                        <div className="pt-2 border-t border-gray-200 mt-2">
                          <span className="text-sm font-medium text-gray-500">
                            Ghi chú:
                          </span>
                          <p className="text-sm text-gray-900 mt-1">
                            {detailInvoice.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chi tiết thanh toán */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Chi tiết thanh toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-4">
                      <div className="flex justify-between pb-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          Tiền phòng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.room_fee.toLocaleString()} đ
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Phí dịch vụ:
                        </h4>
                        {detailInvoice.services_fee.length > 0 ? (
                          <ul className="space-y-2">
                            {detailInvoice.services_fee.map(
                              (service, index) => (
                                <li
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-gray-600">
                                    {service.name}:
                                  </span>
                                  <span className="text-gray-900">
                                    {service.amount.toLocaleString()} đ
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Không có phí dịch vụ
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex justify-between">
                        <span className="text-sm font-bold text-gray-700">
                          Tổng cộng:
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {detailInvoice.total_amount.toLocaleString()} đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code thanh toán */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-md flex flex-col items-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 self-start">
                      Mã QR thanh toán
                    </h3>
                    <div className="bg-white p-3 border border-gray-200 rounded-md">
                      {/* Placeholder cho QR code */}
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                        <DollarSign size={64} className="text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Quét mã QR để thanh toán hóa đơn
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => handleExportInvoice(detailInvoice.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Xuất PDF
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditInvoice(detailInvoice);
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

      {/* Modal thêm/sửa hóa đơn */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === "add"
                  ? "Thêm hóa đơn mới"
                  : "Sửa thông tin hóa đơn"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hợp đồng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hợp đồng <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="contract_id"
                    value={formData.contract_id}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={modalMode === "edit"}
                  >
                    <option value="">-- Chọn hợp đồng --</option>
                    {contracts
                      .filter((contract) => contract.status === "active")
                      .map((contract) => (
                        <option key={contract.id} value={contract.id}>
                          Phòng {contract.room_number} - {contract.tenant_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Tháng/Năm hóa đơn */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tháng <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="month"
                      value={formData.month}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          Tháng {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Năm <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {[...Array(5)].map((_, i) => {
                        const year = new Date().getFullYear() - 2 + i;
                        return (
                          <option key={i} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Tiền phòng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiền phòng (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="room_fee"
                    value={formData.room_fee}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    (Tự động lấy từ hợp đồng)
                  </p>
                </div>

                {/* Hạn thanh toán */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn thanh toán <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
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
                    <option value="pending">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="overdue">Quá hạn</option>
                  </select>
                </div>

                {/* Ngày thanh toán (nếu đã thanh toán) */}
                {formData.status === "paid" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày thanh toán
                    </label>
                    <div className="flex items-center">
                      <div className="relative flex-grow">
                        <input
                          type="date"
                          name="payment_date"
                          value={formData.payment_date || ""}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar
                          className="absolute right-3 top-2.5 text-gray-400"
                          size={18}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tổng tiền */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tổng tiền (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={formData.total_amount.toLocaleString()}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    (Tự động tính = Tiền phòng + Phí dịch vụ)
                  </p>
                </div>

                {/* Ghi chú */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleFormChange}
                    rows="2"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập ghi chú (nếu có)"
                  ></textarea>
                </div>

                {/* Phí dịch vụ */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phí dịch vụ
                  </label>

                  {/* Danh sách dịch vụ hiện tại */}
                  {formData.services_fee.length > 0 ? (
                    <div className="mb-4 border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                            >
                              Tên dịch vụ
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase"
                            >
                              Số tiền (VNĐ)
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase"
                            >
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {formData.services_fee.map((service) => (
                            <tr key={service.id}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {service.name}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                                {service.amount.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveService(service.id)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              Tổng phí dịch vụ
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                              {formData.services_fee
                                .reduce(
                                  (sum, service) => sum + service.amount,
                                  0
                                )
                                .toLocaleString()}{" "}
                              đ
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">
                      Chưa có dịch vụ nào được thêm
                    </p>
                  )}

                  {/* Form thêm dịch vụ mới */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Thêm dịch vụ mới
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Tên dịch vụ"
                          value={newService.name}
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          placeholder="Số tiền (VNĐ)"
                          value={newService.amount}
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              amount: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={handleAddService}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                          <Plus size={16} className="inline mr-1" /> Thêm
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Hoặc chọn dịch vụ có sẵn:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {serviceOptions.map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() =>
                              setNewService({ name: service.name, amount: "" })
                            }
                            className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-md hover:bg-gray-300"
                          >
                            {service.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
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
                  {modalMode === "add" ? "Thêm hóa đơn" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesManagement;
