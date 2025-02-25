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
} from "lucide-react";

const PaymentsManagement = () => {
  // State quản lý danh sách thanh toán
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    method: "all",
    dateRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(8);

  // State cho modal thêm/sửa thanh toán
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'
  const [currentPayment, setCurrentPayment] = useState(null);

  // State cho detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPayment, setDetailPayment] = useState(null);

  // Danh sách hóa đơn (giả lập)
  const [invoices, setInvoices] = useState([]);

  // Danh sách phương thức thanh toán
  const paymentMethods = [
    { id: "bank_transfer", name: "Chuyển khoản ngân hàng" },
    { id: "cash", name: "Tiền mặt" },
    { id: "momo", name: "Ví MoMo" },
    { id: "zalo_pay", name: "Zalo Pay" },
    { id: "vnpay", name: "VNPay" },
  ];

  // State cho form thêm/sửa thanh toán
  const [formData, setFormData] = useState({
    invoice_id: "",
    amount: "",
    payment_method: "",
    payment_date: new Date().toISOString().split("T")[0],
    transaction_id: "",
    status: true,
    note: "",
  });

  // Giả lập dữ liệu
  useEffect(() => {
    // Giả lập API call cho hóa đơn
    const mockInvoices = Array(20)
      .fill()
      .map((_, index) => ({
        id: `invoice_${index + 1}`,
        room_number: `${(index % 5) + 1}0${(index % 10) + 1}`,
        tenant_name: `Nguyễn Văn ${String.fromCharCode(65 + (index % 5))} ${
          index + 1
        }`,
        total_amount: 2500000 + (index % 15) * 300000,
        status: index % 3 === 0 ? "pending" : "paid",
      }));
    setInvoices(mockInvoices);

    // Giả lập API call cho thanh toán
    const mockPayments = Array(30)
      .fill()
      .map((_, index) => {
        const paymentDate = new Date();
        paymentDate.setDate(paymentDate.getDate() - (index % 30));

        const selectedInvoice = mockInvoices[index % mockInvoices.length];

        return {
          id: `payment_${index + 1}`,
          invoice_id: selectedInvoice.id,
          invoice_room: selectedInvoice.room_number,
          invoice_tenant: selectedInvoice.tenant_name,
          amount: selectedInvoice.total_amount,
          payment_method: paymentMethods[index % paymentMethods.length].id,
          payment_date: paymentDate.toISOString().split("T")[0],
          transaction_id: `TR${Math.floor(Math.random() * 1000000)}`,
          status: index % 5 !== 0,
          note: index % 7 === 0 ? "Thanh toán từng phần" : "",
        };
      });

    setPayments(mockPayments);
    setLoading(false);
  }, []);

  // Lọc thanh toán theo điều kiện search và filter
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.invoice_room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoice_tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "success" && payment.status === true) ||
      (filters.status === "failed" && payment.status === false);

    const matchesMethod =
      filters.method === "all" || payment.payment_method === filters.method;

    let matchesDateRange = true;
    const paymentDate = new Date(payment.payment_date);
    const today = new Date();

    if (filters.dateRange === "current") {
      matchesDateRange =
        paymentDate.getMonth() === today.getMonth() &&
        paymentDate.getFullYear() === today.getFullYear();
    } else if (filters.dateRange === "last3Months") {
      const last3Months = new Date();
      last3Months.setMonth(today.getMonth() - 3);
      matchesDateRange = paymentDate >= last3Months;
    } else if (filters.dateRange === "thisYear") {
      matchesDateRange = paymentDate.getFullYear() === today.getFullYear();
    }

    return matchesSearch && matchesStatus && matchesMethod && matchesDateRange;
  });

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

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

  // Handler mở modal thêm thanh toán mới
  const handleAddPayment = () => {
    const currentDate = new Date();

    setModalMode("add");
    setFormData({
      invoice_id: "",
      amount: "",
      payment_method: "",
      payment_date: currentDate.toISOString().split("T")[0],
      transaction_id: "",
      status: true,
      note: "",
    });
    setShowModal(true);
  };

  // Handler mở modal sửa thanh toán
  const handleEditPayment = (payment) => {
    setModalMode("edit");
    setCurrentPayment(payment);
    setFormData({
      invoice_id: payment.invoice_id,
      amount: payment.amount,
      payment_method: payment.payment_method,
      payment_date: payment.payment_date,
      transaction_id: payment.transaction_id || "",
      status: payment.status,
      note: payment.note || "",
    });
    setShowModal(true);
  };

  // Handler xem chi tiết thanh toán
  const handleViewPayment = (payment) => {
    setDetailPayment(payment);
    setShowDetailModal(true);
  };

  // Handler xóa thanh toán
  const handleDeletePayment = (paymentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thanh toán này?")) {
      setPayments(payments.filter((payment) => payment.id !== paymentId));
    }
  };

  // Handler cho việc thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Xử lý logic cho việc chọn hóa đơn
    if (name === "invoice_id" && value) {
      const selectedInvoice = invoices.find((invoice) => invoice.id === value);
      if (selectedInvoice) {
        setFormData((prev) => ({
          ...prev,
          invoice_id: value,
          amount: selectedInvoice.total_amount,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handler lưu thông tin thanh toán
  const handleSavePayment = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.invoice_id || !formData.payment_method) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Lấy thông tin hóa đơn
    const selectedInvoice = invoices.find(
      (invoice) => invoice.id === formData.invoice_id
    );

    if (modalMode === "add") {
      // Tạo thanh toán mới
      const newPayment = {
        id: `payment_${payments.length + 1}`,
        ...formData,
        invoice_room: selectedInvoice.room_number,
        invoice_tenant: selectedInvoice.tenant_name,
      };

      setPayments([newPayment, ...payments]);
    } else {
      // Cập nhật thanh toán hiện có
      setPayments(
        payments.map((payment) => {
          if (payment.id === currentPayment.id) {
            return {
              ...payment,
              ...formData,
              invoice_room: selectedInvoice.room_number,
              invoice_tenant: selectedInvoice.tenant_name,
            };
          }
          return payment;
        })
      );
    }

    setShowModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thanh toán</h1>
        <p className="text-gray-600">
          Quản lý danh sách thanh toán và thông tin giao dịch
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-row justify-between items-center space-x-4">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm thanh toán..."
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
                <option value="success">Thành công</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Phương thức:</label>
              <select
                name="method"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.method}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
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

            {/* Nút thêm thanh toán */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 ml-auto"
              onClick={handleAddPayment}
            >
              <Plus size={16} className="mr-2" />
              Thêm thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách thanh toán */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            Không tìm thấy thanh toán nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hóa đơn/Người thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày thanh toán
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
                {currentPayments.map((payment) => {
                  // Tìm phương thức thanh toán tương ứng
                  const paymentMethodObj = paymentMethods.find(
                    (method) => method.id === payment.payment_method
                  );

                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {payment.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.transaction_id || "Chưa có mã giao dịch"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.invoice_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          Phòng {payment.invoice_room} -{" "}
                          {payment.invoice_tenant}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {payment.amount.toLocaleString()} đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paymentMethodObj
                          ? paymentMethodObj.name
                          : payment.payment_method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.payment_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.status ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Thành công
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Thất bại
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewPayment(payment)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstPayment + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastPayment, filteredPayments.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{filteredPayments.length}</span>{" "}
                  thanh toán
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

      {/* Modal chi tiết thanh toán */}
      {showDetailModal && detailPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết thanh toán
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
                    Thông tin thanh toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Mã thanh toán:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailPayment.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Mã giao dịch:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailPayment.transaction_id ||
                            "Chưa có mã giao dịch"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Hóa đơn:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailPayment.invoice_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Phòng:
                        </span>
                        <span className="text-sm text-gray-900">
                          Phòng {detailPayment.invoice_room}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Người thuê:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailPayment.invoice_tenant}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin thanh toán */}
                  <h3 className="text-lg font-medium text-gray-900 mt-4 mb-3">
                    Chi tiết thanh toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Phương thức:
                        </span>
                        <span className="text-sm text-gray-900">
                          {paymentMethods.find(
                            (method) =>
                              method.id === detailPayment.payment_method
                          )?.name || detailPayment.payment_method}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Ngày thanh toán:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(
                            detailPayment.payment_date
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Trạng thái:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            detailPayment.status
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {detailPayment.status ? "Thành công" : "Thất bại"}
                        </span>
                      </div>
                      {detailPayment.note && (
                        <div className="pt-2 border-t border-gray-200 mt-2">
                          <span className="text-sm font-medium text-gray-500">
                            Ghi chú:
                          </span>
                          <p className="text-sm text-gray-900 mt-1">
                            {detailPayment.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chi tiết số tiền */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Thông tin số tiền
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Số tiền thanh toán:
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {detailPayment.amount.toLocaleString()} đ
                        </span>
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex justify-between">
                        <span className="text-sm font-bold text-gray-700">
                          Tổng số tiền:
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {detailPayment.amount.toLocaleString()} đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditPayment(detailPayment);
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

      {/* Modal thêm/sửa thanh toán */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === "add"
                  ? "Thêm thanh toán mới"
                  : "Sửa thông tin thanh toán"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hóa đơn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hóa đơn <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="invoice_id"
                    value={formData.invoice_id}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={modalMode === "edit"}
                  >
                    <option value="">-- Chọn hóa đơn --</option>
                    {invoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.id} - Phòng {invoice.room_number} -{" "}
                        {invoice.tenant_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Số tiền */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>

                {/* Phương thức thanh toán */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phương thức thanh toán{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Chọn phương thức --</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ngày thanh toán */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày thanh toán <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <input
                        type="date"
                        name="payment_date"
                        value={formData.payment_date}
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

                {/* Mã giao dịch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã giao dịch
                  </label>
                  <input
                    type="text"
                    name="transaction_id"
                    value={formData.transaction_id}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã giao dịch (nếu có)"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="radio"
                        name="status"
                        value="true"
                        checked={formData.status === true}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: true,
                          }))
                        }
                        className="form-radio"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Thành công
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="false"
                        checked={formData.status === false}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: false,
                          }))
                        }
                        className="form-radio"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Thất bại
                      </span>
                    </label>
                  </div>
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
                  {modalMode === "add" ? "Thêm thanh toán" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagement;
