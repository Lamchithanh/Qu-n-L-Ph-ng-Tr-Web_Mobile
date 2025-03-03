import React, { useState, useEffect } from "react";
import {
  Search,
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
  DollarSign,
  FileText,
  Shield,
  Building,
  Home,
  User,
} from "lucide-react";

const AdminInvoicesManagement = () => {
  // State quản lý danh sách hóa đơn
  const [invoices, setInvoices] = useState([]);
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
  const [invoicesPerPage] = useState(10);

  // State cho modal chi tiết hóa đơn
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState(null);

  // State cho modal xét duyệt hóa đơn
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [approveNote, setApproveNote] = useState("");

  // Danh sách chủ trọ (giả lập)
  const [landlords, setLandlords] = useState([]);

  // Danh sách trạng thái hóa đơn
  const invoiceStatuses = [
    {
      id: "pending",
      name: "Chưa thanh toán",
      color: "text-yellow-600 bg-yellow-100",
    },
    { id: "paid", name: "Đã thanh toán", color: "text-green-600 bg-green-100" },
    { id: "overdue", name: "Quá hạn", color: "text-red-600 bg-red-100" },
    {
      id: "disputed",
      name: "Đang tranh chấp",
      color: "text-orange-600 bg-orange-100",
    },
    { id: "cancelled", name: "Đã hủy", color: "text-gray-600 bg-gray-100" },
    {
      id: "refunded",
      name: "Đã hoàn tiền",
      color: "text-blue-600 bg-blue-100",
    },
  ];

  // Giả lập dữ liệu
  useEffect(() => {
    // Giả lập API call cho chủ trọ
    setTimeout(() => {
      const mockLandlords = Array(10)
        .fill()
        .map((_, index) => ({
          id: `landlord_${index + 1}`,
          name: `Chủ trọ ${String.fromCharCode(65 + index)}`,
          phone: `098${index}${index + 1}${index + 2}${index + 3}${index + 4}`,
          email: `landlord${index + 1}@example.com`,
          propertyCount: Math.floor(Math.random() * 10) + 1,
          status: index % 5 !== 0 ? "active" : "pending",
        }));
      setLandlords(mockLandlords);

      // Giả lập API call cho hóa đơn
      const today = new Date();
      const mockInvoices = Array(50)
        .fill()
        .map((_, index) => {
          const invoiceDate = new Date(today);
          invoiceDate.setMonth(today.getMonth() - (index % 12));
          invoiceDate.setDate(1);

          const dueDate = new Date(invoiceDate);
          dueDate.setDate(10); // Hạn thanh toán là ngày 10 hàng tháng

          const selectedLandlord = mockLandlords[index % mockLandlords.length];

          // Xác định trạng thái dựa trên ngày và một số yếu tố ngẫu nhiên
          let status;
          if (index % 15 === 0) {
            status = "disputed";
          } else if (index % 12 === 0) {
            status = "cancelled";
          } else if (index % 11 === 0) {
            status = "refunded";
          } else if (index % 7 === 0) {
            status = "overdue";
          } else if (index % 3 === 0) {
            status = "pending";
          } else {
            status = "paid";
          }

          // Tạo danh sách dịch vụ ngẫu nhiên
          const services = [
            {
              id: "service_1",
              name: "Điện",
              amount: Math.floor(Math.random() * 300000) + 100000,
            },
            {
              id: "service_2",
              name: "Nước",
              amount: Math.floor(Math.random() * 100000) + 50000,
            },
          ];

          if (index % 2 === 0) {
            services.push({
              id: "service_3",
              name: "Internet",
              amount: 200000,
            });
          }

          if (index % 3 === 0) {
            services.push({
              id: "service_4",
              name: "Dịch vụ vệ sinh",
              amount: 150000,
            });
          }

          // Tính tổng tiền
          const roomFee = 2500000 + (index % 20) * 100000;
          const serviceTotal = services.reduce(
            (sum, service) => sum + service.amount,
            0
          );
          const totalAmount = roomFee + serviceTotal;

          // Người thuê ngẫu nhiên
          const tenantName =
            [
              "Nguyễn Văn A",
              "Trần Thị B",
              "Lê Văn C",
              "Phạm Thị D",
              "Hoàng Văn E",
            ][index % 5] + ` ${Math.floor(index / 5) + 1}`;

          // Ngày thanh toán (nếu đã thanh toán)
          let paymentDate = null;
          if (status === "paid" || status === "refunded") {
            paymentDate = new Date(dueDate);
            paymentDate.setDate(
              paymentDate.getDate() - Math.floor(Math.random() * 5)
            );
          }

          // Ghi chú cho hóa đơn
          let note = "";
          if (status === "disputed") {
            note = "Khách hàng khiếu nại về phí dịch vụ quá cao";
          } else if (status === "cancelled") {
            note = "Hóa đơn hủy do nhập sai thông tin";
          } else if (status === "refunded") {
            note = "Đã hoàn tiền do tính sai phí dịch vụ";
          } else if (index % 5 === 0) {
            note = "Thanh toán trễ sẽ phát sinh phí phạt 5%";
          }

          return {
            id: `INV-${index + 1}`,
            invoice_number: `INV-${invoiceDate.getFullYear()}${String(
              invoiceDate.getMonth() + 1
            ).padStart(2, "0")}-${String(index + 1).padStart(4, "0")}`,
            landlord_id: selectedLandlord.id,
            landlord_name: selectedLandlord.name,
            landlord_phone: selectedLandlord.phone,
            landlord_email: selectedLandlord.email,
            room_number: `${(index % 5) + 1}0${(index % 10) + 1}`,
            property_name: `Nhà trọ ${String.fromCharCode(65 + (index % 10))}`,
            property_address: `${(index % 5) + 1}${(index % 10) + 1} Đường số ${
              (index % 20) + 1
            }, Quận ${(index % 12) + 1}, TP.HCM`,
            tenant_name: tenantName,
            tenant_phone: `097${index % 10}${(index % 10) + 1}${
              (index % 10) + 2
            }${(index % 10) + 3}${(index % 10) + 4}`,
            month: invoiceDate.getMonth() + 1,
            year: invoiceDate.getFullYear(),
            month_year: `${
              invoiceDate.getMonth() + 1
            }/${invoiceDate.getFullYear()}`,
            room_fee: roomFee,
            services_fee: services,
            total_amount: totalAmount,
            payment_fee: totalAmount * 0.01, // Phí giao dịch 1%
            platform_fee: totalAmount * 0.02, // Phí nền tảng 2%
            landlord_received: totalAmount - totalAmount * 0.03, // Chủ nhà nhận 97%
            due_date: dueDate.toISOString().split("T")[0],
            created_date: invoiceDate.toISOString().split("T")[0],
            payment_date: paymentDate
              ? paymentDate.toISOString().split("T")[0]
              : null,
            payment_method:
              status === "paid"
                ? ["Chuyển khoản ngân hàng", "Tiền mặt", "Ví MoMo", "ZaloPay"][
                    index % 4
                  ]
                : null,
            status: status,
            note: note,
            admin_reviewed: index % 4 === 0,
          };
        });

      setInvoices(mockInvoices);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc hóa đơn theo điều kiện search và filter
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.landlord_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.property_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || invoice.status === filters.status;
    const matchesLandlord =
      filters.landlord === "all" || invoice.landlord_id === filters.landlord;

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
      matchesSearch && matchesStatus && matchesLandlord && matchesDateRange
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

  // Handler xem chi tiết hóa đơn
  const handleViewInvoice = (invoice) => {
    setDetailInvoice(invoice);
    setShowDetailModal(true);
  };

  // Handler mở modal xét duyệt hóa đơn
  const handleOpenApproveModal = (invoice) => {
    setCurrentInvoice(invoice);
    setApproveNote("");
    setShowApproveModal(true);
  };

  // Handler xét duyệt hóa đơn
  const handleApproveInvoice = () => {
    // Cập nhật trạng thái đã xét duyệt
    setInvoices(
      invoices.map((invoice) => {
        if (invoice.id === currentInvoice.id) {
          return {
            ...invoice,
            admin_reviewed: true,
            admin_note: approveNote,
            review_date: new Date().toISOString().split("T")[0],
          };
        }
        return invoice;
      })
    );
    setShowApproveModal(false);

    // Nếu đang xem chi tiết hóa đơn đó, cập nhật thông tin chi tiết
    if (detailInvoice && detailInvoice.id === currentInvoice.id) {
      setDetailInvoice({
        ...detailInvoice,
        admin_reviewed: true,
        admin_note: approveNote,
        review_date: new Date().toISOString().split("T")[0],
      });
    }
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
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý hóa đơn hệ thống
        </h1>
        <p className="text-gray-600">
          Quản lý và giám sát tất cả hóa đơn trên nền tảng
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm hóa đơn, chủ trọ..."
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
                {invoiceStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
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
                <option value="current">Tháng hiện tại</option>
                <option value="last3Months">3 tháng gần đây</option>
                <option value="thisYear">Năm nay</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số hóa đơn</p>
              <p className="text-2xl font-bold text-gray-800">
                {invoices.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Tháng này:{" "}
            {
              invoices.filter((inv) => {
                const now = new Date();
                return (
                  inv.month === now.getMonth() + 1 &&
                  inv.year === now.getFullYear()
                );
              }).length
            }{" "}
            hóa đơn
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã thanh toán</p>
              <p className="text-2xl font-bold text-green-600">
                {invoices.filter((inv) => inv.status === "paid").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {(
              (invoices.filter((inv) => inv.status === "paid").length /
                invoices.length) *
              100
            ).toFixed(1)}
            % tổng hóa đơn
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cần xét duyệt</p>
              <p className="text-2xl font-bold text-orange-600">
                {invoices.filter((inv) => !inv.admin_reviewed).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Cần xử lý:{" "}
            {invoices.filter((inv) => inv.status === "disputed").length} tranh
            chấp
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Doanh thu nền tảng</p>
              <p className="text-2xl font-bold text-indigo-600">
                {(
                  invoices
                    .filter((inv) => inv.status === "paid")
                    .reduce((sum, inv) => sum + inv.platform_fee, 0) / 1000000
                ).toFixed(1)}
                M
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <DollarSign className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Phí giao dịch:{" "}
            {(
              invoices
                .filter((inv) => inv.status === "paid")
                .reduce((sum, inv) => sum + inv.payment_fee, 0) / 1000000
            ).toFixed(1)}
            M
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
                    Chủ trọ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tháng/Năm
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã duyệt
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
                          {invoice.invoice_number}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(invoice.created_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.landlord_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {invoice.property_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.tenant_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Phòng {invoice.room_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Tháng {invoice.month}/{invoice.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                        {invoice.total_amount.toLocaleString()} đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusObj.color}`}
                        >
                          {statusObj.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {invoice.admin_reviewed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          {!invoice.admin_reviewed && (
                            <button
                              onClick={() => handleOpenApproveModal(invoice)}
                              className="text-green-600 hover:text-green-900"
                              title="Xét duyệt"
                            >
                              <Shield size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleExportInvoice(invoice.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Xuất PDF"
                          >
                            <Download size={18} />
                          </button>
                        </div>
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
                {/* Thông tin chủ trọ và người thuê */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <Building size={18} className="mr-2" />
                    Thông tin chủ trọ
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Chủ trọ:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.landlord_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Số điện thoại:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.landlord_phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Email:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.landlord_email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Nhà trọ:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.property_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Địa chỉ:
                        </span>
                        <span className="text-sm text-gray-900 text-right">
                          {detailInvoice.property_address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <User size={18} className="mr-2" />
                    Thông tin người thuê
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Người thuê:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.tenant_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Số điện thoại:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.tenant_phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Phòng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.room_number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin hóa đơn */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FileText size={18} className="mr-2" />
                    Thông tin hóa đơn
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Mã hóa đơn:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailInvoice.invoice_number}
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
                          Kỳ hóa đơn:
                        </span>
                        <span className="text-sm text-gray-900">
                          Tháng {detailInvoice.month}/{detailInvoice.year}
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
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Trạng thái:
                        </span>
                        <span
                          className={`text-sm font-medium ${invoiceStatuses
                            .find(
                              (status) => status.id === detailInvoice.status
                            )
                            ?.color.replace("bg-", "")}`}
                        >
                          {
                            invoiceStatuses.find(
                              (status) => status.id === detailInvoice.status
                            )?.name
                          }
                        </span>
                      </div>
                      {detailInvoice.payment_date && (
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
                      {detailInvoice.payment_method && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">
                            Phương thức:
                          </span>
                          <span className="text-sm text-gray-900">
                            {detailInvoice.payment_method}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <DollarSign size={18} className="mr-2" />
                    Chi tiết thanh toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Tiền phòng:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {detailInvoice.room_fee.toLocaleString()} đ
                        </span>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Phí dịch vụ:
                        </span>
                        {detailInvoice.services_fee.length > 0 ? (
                          <ul className="mt-2 space-y-2">
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
                          <p className="text-sm text-gray-500 mt-2">
                            Không có phí dịch vụ
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Tổng tiền hóa đơn:
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {detailInvoice.total_amount.toLocaleString()} đ
                          </span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm font-medium text-gray-700">
                            Phí giao dịch (1%):
                          </span>
                          <span className="text-sm text-gray-900">
                            {detailInvoice.payment_fee.toLocaleString()} đ
                          </span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm font-medium text-gray-700">
                            Phí nền tảng (2%):
                          </span>
                          <span className="text-sm text-gray-900">
                            {detailInvoice.platform_fee.toLocaleString()} đ
                          </span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm font-medium text-gray-700">
                            Chủ trọ nhận:
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {detailInvoice.landlord_received.toLocaleString()} đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ghi chú và xét duyệt */}
              <div className="mt-6">
                {detailInvoice.note && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                      Ghi chú từ chủ trọ:
                    </h3>
                    <p className="text-sm text-yellow-700">
                      {detailInvoice.note}
                    </p>
                  </div>
                )}

                {detailInvoice.admin_reviewed ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                      <CheckCircle size={16} className="mr-2" />
                      Đã được xét duyệt
                    </h3>
                    {detailInvoice.admin_note && (
                      <p className="text-sm text-green-700">
                        {detailInvoice.admin_note}
                      </p>
                    )}
                    {detailInvoice.review_date && (
                      <p className="text-xs text-green-600 mt-2">
                        Ngày xét duyệt:{" "}
                        {new Date(detailInvoice.review_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">
                        Hóa đơn này chưa được xét duyệt
                      </h3>
                      <p className="text-xs text-blue-700 mt-1">
                        Xét duyệt để xác nhận tính hợp lệ của hóa đơn này
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenApproveModal(detailInvoice)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Shield size={16} className="mr-2" />
                      Xét duyệt ngay
                    </button>
                  </div>
                )}
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
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xét duyệt hóa đơn */}
      {showApproveModal && currentInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Xét duyệt hóa đơn
              </h2>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <Shield size={20} className="text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">
                      Xác nhận xét duyệt hóa đơn
                    </h3>
                    <p className="text-sm text-blue-700">
                      Hóa đơn: {currentInvoice.invoice_number}
                      <br />
                      Số tiền: {currentInvoice.total_amount.toLocaleString()} đ
                      <br />
                      Trạng thái:{" "}
                      {
                        invoiceStatuses.find(
                          (status) => status.id === currentInvoice.status
                        )?.name
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú xét duyệt (tùy chọn):
                </label>
                <textarea
                  rows="4"
                  value={approveNote}
                  onChange={(e) => setApproveNote(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập ghi chú xét duyệt nếu cần"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleApproveInvoice}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Xác nhận duyệt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoicesManagement;
