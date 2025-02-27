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
  RefreshCw,
} from "lucide-react";

const InvoicesPaymentsManagement = () => {
  // State quản lý danh sách hóa đơn và thanh toán
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(8);

  // State cho modal chi tiết hóa đơn và thanh toán
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);
  const [showPaymentDetailModal, setShowPaymentDetailModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [currentPayment, setCurrentPayment] = useState(null);

  // State cho modal hoàn tiền
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Danh sách trạng thái hóa đơn
  const invoiceStatuses = [
    { id: "pending", name: "Chưa thanh toán", color: "text-yellow-600" },
    { id: "paid", name: "Đã thanh toán", color: "text-green-600" },
    { id: "overdue", name: "Quá hạn", color: "text-red-600" },
  ];

  // Danh sách phương thức thanh toán
  const paymentMethods = [
    { id: "bank_transfer", name: "Chuyển khoản ngân hàng" },
    { id: "cash", name: "Tiền mặt" },
    { id: "momo", name: "Ví MoMo" },
    { id: "zalo_pay", name: "Zalo Pay" },
    { id: "vnpay", name: "VNPay" },
  ];

  // Giả lập dữ liệu
  useEffect(() => {
    // Giả lập dữ liệu hóa đơn
    const mockInvoices = Array(30)
      .fill()
      .map((_, index) => {
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + (15 - (index % 15)));

        return {
          id: `INV-${index + 1}`,
          contract_id: `CONTRACT-${Math.floor(index / 3) + 1}`,
          month: ((today.getMonth() + 12 - index) % 12) + 1,
          year: today.getFullYear() - Math.floor(index / 12),
          room_fee: 2500000 + (index % 10) * 100000,
          services_fee: JSON.stringify({
            electricity: 500000 + (index % 5) * 50000,
            water: 100000 + (index % 3) * 20000,
          }),
          total_amount: 3100000 + (index % 10) * 150000,
          due_date: dueDate.toISOString().split("T")[0],
          status:
            index % 5 === 0 ? "overdue" : index % 3 === 0 ? "pending" : "paid",
          note: index % 7 === 0 ? "Hóa đơn phức tạp" : "",
          landlord_name: `Chủ trọ ${String.fromCharCode(65 + (index % 5))}`,
          tenant_name: `Người thuê ${String.fromCharCode(65 + (index % 5))} ${
            index + 1
          }`,
        };
      });
    setInvoices(mockInvoices);

    // Giả lập dữ liệu thanh toán
    const mockPayments = mockInvoices
      .filter((inv) => inv.status === "paid")
      .map((invoice, index) => ({
        id: `PAY-${index + 1}`,
        invoice_id: invoice.id,
        amount: invoice.total_amount,
        payment_method: paymentMethods[index % paymentMethods.length].id,
        payment_date: new Date(invoice.due_date).toISOString(),
        transaction_id: `TR${Math.floor(Math.random() * 1000000)}`,
        status: true,
        note: index % 7 === 0 ? "Thanh toán đúng hạn" : "",
      }));
    setPayments(mockPayments);
    setLoading(false);
  }, []);

  // Lọc hóa đơn theo điều kiện search và filter
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.landlord_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || invoice.status === filters.status;

    let matchesDateRange = true;
    const invoiceDate = new Date(invoice.due_date);
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

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Pagination logic cho hóa đơn
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  // Handlers cho filter và search
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

  // Handler xem chi tiết hóa đơn
  const handleViewInvoiceDetail = (invoice) => {
    setCurrentInvoice(invoice);
    setShowInvoiceDetailModal(true);
  };

  // Handler xem chi tiết thanh toán
  const handleViewPaymentDetail = (payment) => {
    const relatedInvoice = invoices.find(
      (inv) => inv.id === payment.invoice_id
    );
    setCurrentPayment({ ...payment, invoice: relatedInvoice });
    setShowPaymentDetailModal(true);
  };

  // Handler mở modal hoàn tiền
  const handleOpenRefundModal = (payment) => {
    setCurrentPayment(payment);
    setShowRefundModal(true);
  };

  // Handler thực hiện hoàn tiền
  const handleRefund = () => {
    // Logic xử lý hoàn tiền (giả lập)
    alert(`Đang xử lý hoàn tiền cho giao dịch ${currentPayment.id}`);
    setShowRefundModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý Hóa đơn & Thanh toán
        </h1>
        <p className="text-gray-600">
          Quản lý danh sách hóa đơn và lịch sử thanh toán
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
                {invoiceStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
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
                    Số hóa đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ trọ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hạn thanh toán
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentInvoices.map((invoice) => {
                  const statusObj = invoiceStatuses.find(
                    (status) => status.id === invoice.status
                  );

                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {invoice.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tháng {invoice.month}/{invoice.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.landlord_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.tenant_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {invoice.total_amount.toLocaleString()} đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusObj.color} bg-opacity-20`}
                        >
                          {statusObj.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.due_date).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewInvoiceDetail(invoice)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye size={18} />
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
      {showInvoiceDetailModal && currentInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết hóa đơn
              </h2>
              <button
                onClick={() => setShowInvoiceDetailModal(false)}
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
                          Số hóa đơn:
                        </span>
                        <span className="text-sm text-gray-900">
                          {currentInvoice.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Kỳ hóa đơn:
                        </span>
                        <span className="text-sm text-gray-900">
                          Tháng {currentInvoice.month}/{currentInvoice.year}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Chủ trọ:
                        </span>
                        <span className="text-sm text-gray-900">
                          {currentInvoice.landlord_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Người thuê:
                        </span>
                        <span className="text-sm text-gray-900">
                          {currentInvoice.tenant_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Trạng thái:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            invoiceStatuses.find(
                              (s) => s.id === currentInvoice.status
                            )?.color
                          }`}
                        >
                          {
                            invoiceStatuses.find(
                              (s) => s.id === currentInvoice.status
                            )?.name
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chi tiết dịch vụ */}
                  <h3 className="text-lg font-medium text-gray-900 mt-4 mb-3">
                    Chi tiết dịch vụ
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(
                        JSON.parse(currentInvoice.services_fee)
                      ).map(([service, amount]) => (
                        <div key={service} className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500 capitalize">
                            {service}:
                          </span>
                          <span className="text-sm text-gray-900">
                            {amount.toLocaleString()} đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chi tiết số tiền */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Thông tin thanh toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Tiền phòng:
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {currentInvoice.room_fee.toLocaleString()} đ
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Tiền dịch vụ:
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {Object.values(
                            JSON.parse(currentInvoice.services_fee)
                          )
                            .reduce((a, b) => a + b, 0)
                            .toLocaleString()}{" "}
                          đ
                        </span>
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex justify-between">
                        <span className="text-sm font-bold text-gray-700">
                          Tổng số tiền:
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {currentInvoice.total_amount.toLocaleString()} đ
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Hạn thanh toán:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(currentInvoice.due_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentInvoice.note && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <span className="text-sm font-medium text-gray-500 block mb-2">
                        Ghi chú:
                      </span>
                      <p className="text-sm text-gray-900">
                        {currentInvoice.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowInvoiceDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết thanh toán */}
      {showPaymentDetailModal && currentPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết thanh toán
              </h2>
              <button
                onClick={() => setShowPaymentDetailModal(false)}
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
                          {currentPayment.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Mã giao dịch:
                        </span>
                        <span className="text-sm text-gray-900">
                          {currentPayment.transaction_id ||
                            "Chưa có mã giao dịch"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Hóa đơn:
                        </span>
                        <span className="text-sm text-gray-900">
                          {currentPayment.invoice_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Người thuê:
                        </span>
                        <span className="text-sm text-gray-900">
                          {currentPayment.invoice.tenant_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Trạng thái:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            currentPayment.status
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {currentPayment.status ? "Thành công" : "Thất bại"}
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
                              method.id === currentPayment.payment_method
                          )?.name || currentPayment.payment_method}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Ngày thanh toán:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(
                            currentPayment.payment_date
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {currentPayment.note && (
                        <div className="pt-2 border-t border-gray-200 mt-2">
                          <span className="text-sm font-medium text-gray-500">
                            Ghi chú:
                          </span>
                          <p className="text-sm text-gray-900 mt-1">
                            {currentPayment.note}
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
                          {currentPayment.amount.toLocaleString()} đ
                        </span>
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex justify-between">
                        <span className="text-sm font-bold text-gray-700">
                          Tổng số tiền:
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {currentPayment.amount.toLocaleString()} đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin hoàn tiền */}
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Quản lý hoàn tiền
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Kiểm tra và xử lý hoàn tiền nếu có sai sót
                      </span>
                      <button
                        onClick={() => handleOpenRefundModal(currentPayment)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Hoàn tiền
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPaymentDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal hoàn tiền */}
      {showRefundModal && currentPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Xác nhận hoàn tiền
              </h2>
              <button
                onClick={() => setShowRefundModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle
                    size={20}
                    className="text-yellow-600 mr-3 mt-1"
                  />
                  <p className="text-sm text-yellow-700">
                    Vui lòng kiểm tra kỹ thông tin trước khi thực hiện hoàn
                    tiền. Thao tác này không thể hoàn tác.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-500">
                      Mã thanh toán:
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {currentPayment.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Số tiền:</span>
                    <p className="text-sm font-medium text-blue-600">
                      {currentPayment.amount.toLocaleString()} đ
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-gray-500">
                      Lý do hoàn tiền:
                    </span>
                    <textarea
                      rows="3"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập lý do hoàn tiền (bắt buộc)"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleRefund}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Xác nhận hoàn tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPaymentsManagement;
