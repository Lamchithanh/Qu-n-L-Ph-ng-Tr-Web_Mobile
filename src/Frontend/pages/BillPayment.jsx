import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Wallet,
  Building2,
  Receipt,
  Clock,
  AlertCircle,
  CheckCircle2,
  BellRing,
  PieChart,
  ArrowUpRight,
  ChevronDown,
  Search,
  Filter,
  FileText,
  DollarSign,
  Calendar,
  ChevronUp,
  Download,
  User,
  Home,
  QrCode,
  ArrowRight,
  Shield,
  X,
  MapPin,
} from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../../Style/BillPayment.module.scss";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";
import MaQR from "../../assets/VCB_QR.png";

const BillPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { id: billId } = useParams();

  // State management
  const [activeTab, setActiveTab] = useState("history");
  const [selectedBill, setSelectedBill] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showStats, setShowStats] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bills, setBills] = useState([]);
  const [billStats, setBillStats] = useState({
    totalPaid: 0,
    totalPending: 0,
    averageMonthly: 0,
    onTimePayment: 0,
  });

  // Fetch bills data
  useEffect(() => {
    const fetchBillsData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data that would come from API
        const mockBills = [
          {
            id: 1,
            period: "Tháng 10/2024",
            amount: 2500000,
            status: "pending",
            dueDate: "2024-10-25",
            roomInfo: {
              id: 101,
              name: "Phòng 303A",
              type: "Căn hộ mini",
              address: "123 Nguyễn Văn Linh, Q7",
              image:
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            },
            items: [
              {
                name: "Tiền điện",
                amount: 1200000,
                usage: "200 kWh",
                unitPrice: "3,500 VNĐ/kWh",
                previous: 1500,
                current: 1700,
              },
              {
                name: "Tiền nước",
                amount: 800000,
                usage: "15m³",
                unitPrice: "25,000 VNĐ/m³",
                previous: 45,
                current: 60,
              },
              {
                name: "Phí dịch vụ",
                amount: 500000,
                details: "Vệ sinh, bảo vệ, wifi",
              },
            ],
            contractInfo: {
              id: "HD0001",
              startDate: "2024-04-01",
              endDate: "2025-04-01",
              tenant: {
                name: "Nguyễn Văn A",
                phone: "0903123456",
              },
            },
            history: [
              {
                date: "2024-10-15",
                action: "Tạo hóa đơn",
                status: "completed",
              },
              {
                date: "2024-10-20",
                action: "Gửi thông báo",
                status: "completed",
              },
            ],
          },
          {
            id: 2,
            period: "Tháng 9/2024",
            amount: 2300000,
            status: "paid",
            paidDate: "2024-09-20",
            paymentMethod: "MoMo",
            transactionId: "TXN123456",
            roomInfo: {
              id: 101,
              name: "Phòng 303A",
              type: "Căn hộ mini",
              address: "123 Nguyễn Văn Linh, Q7",
              image:
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            },
            items: [
              {
                name: "Tiền điện",
                amount: 1100000,
                usage: "180 kWh",
                unitPrice: "3,500 VNĐ/kWh",
                previous: 1350,
                current: 1530,
              },
              {
                name: "Tiền nước",
                amount: 700000,
                usage: "12m³",
                unitPrice: "25,000 VNĐ/m³",
                previous: 33,
                current: 45,
              },
              {
                name: "Phí dịch vụ",
                amount: 500000,
                details: "Vệ sinh, bảo vệ, wifi",
              },
            ],
            contractInfo: {
              id: "HD0001",
              startDate: "2024-04-01",
              endDate: "2025-04-01",
              tenant: {
                name: "Nguyễn Văn A",
                phone: "0903123456",
              },
            },
            history: [
              {
                date: "2024-09-15",
                action: "Tạo hóa đơn",
                status: "completed",
              },
              {
                date: "2024-09-18",
                action: "Gửi thông báo",
                status: "completed",
              },
              {
                date: "2024-09-20",
                action: "Thanh toán thành công",
                status: "completed",
              },
            ],
          },
          {
            id: 3,
            period: "Tháng 8/2024",
            amount: 2450000,
            status: "paid",
            paidDate: "2024-08-18",
            paymentMethod: "Chuyển khoản",
            transactionId: "TXN789012",
            roomInfo: {
              id: 101,
              name: "Phòng 303A",
              type: "Căn hộ mini",
              address: "123 Nguyễn Văn Linh, Q7",
              image:
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            },
            items: [
              {
                name: "Tiền điện",
                amount: 1250000,
                usage: "210 kWh",
                unitPrice: "3,500 VNĐ/kWh",
                previous: 1140,
                current: 1350,
              },
              {
                name: "Tiền nước",
                amount: 700000,
                usage: "13m³",
                unitPrice: "25,000 VNĐ/m³",
                previous: 20,
                current: 33,
              },
              {
                name: "Phí dịch vụ",
                amount: 500000,
                details: "Vệ sinh, bảo vệ, wifi",
              },
            ],
            contractInfo: {
              id: "HD0001",
              startDate: "2024-04-01",
              endDate: "2025-04-01",
              tenant: {
                name: "Nguyễn Văn A",
                phone: "0903123456",
              },
            },
            history: [
              {
                date: "2024-08-15",
                action: "Tạo hóa đơn",
                status: "completed",
              },
              {
                date: "2024-08-16",
                action: "Gửi thông báo",
                status: "completed",
              },
              {
                date: "2024-08-18",
                action: "Thanh toán thành công",
                status: "completed",
              },
            ],
          },
        ];

        // Mock stats that would come from API
        const mockStats = {
          totalPaid: 12500000,
          totalPending: 3500000,
          averageMonthly: 2800000,
          onTimePayment: 95,
        };

        setBills(mockBills);
        setBillStats(mockStats);

        // If there's a billId in the URL, select that bill
        if (billId) {
          const bill = mockBills.find((b) => b.id === parseInt(billId));
          if (bill) {
            setSelectedBill(bill);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu hóa đơn:", error);
        setError("Không thể tải thông tin hóa đơn. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchBillsData();
  }, [billId]);

  // Payment methods configuration
  const paymentMethods = [
    {
      id: "credit",
      icon: <CreditCard className={styles.methodIcon} />,
      title: "Thẻ tín dụng/Ghi nợ",
      description: "Visa, Mastercard, JCB",
      promotion: "Hoàn tiền 1% cho thẻ tín dụng",
      banks: ["Vietcombank", "BIDV", "Techcombank"],
    },
    {
      id: "ewallet",
      icon: <Wallet className={styles.methodIcon} />,
      title: "Ví điện tử",
      description: "MoMo, ZaloPay, VNPay",
      promotion: "Giảm 20k cho lần đầu liên kết",
      features: ["Thanh toán nhanh", "Hoàn tiền", "Tích điểm"],
    },
    {
      id: "banking",
      icon: <Building2 className={styles.methodIcon} />,
      title: "Chuyển khoản",
      description: "Internet Banking",
      accountInfo: {
        bank: "Vietcombank",
        number: "9981911449",
        name: "DANG LAM CHI THANH",
        branch: "Ninh Kiều, TP.Cần Thơ",
      },
    },
  ];

  // Handle payment method selection
  const handleSelectPaymentMethod = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setShowQRCode(false);
  };

  // Handle payment
  const handlePayment = (billId) => {
    // Find the bill with the given ID
    const bill = bills.find((b) => b.id === billId);
    if (!bill) {
      showToast("Không tìm thấy hóa đơn", "error");
      return;
    }

    if (activeTab === "history") {
      setActiveTab("payment");
      setSelectedBill(bill);
    } else {
      // If already on payment tab, proceed with payment
      if (!selectedPaymentMethod) {
        showToast("Vui lòng chọn phương thức thanh toán", "error");
        return;
      }

      navigate("/payment-confirmation", {
        state: {
          billId: bill.id,
          amount: bill.amount,
          paymentMethod: selectedPaymentMethod,
          billPeriod: bill.period,
          roomId: bill.roomInfo.id,
        },
      });
    }
  };

  // Filter bills
  const filterBills = () => {
    return bills.filter((bill) => {
      const matchesStatus =
        filterStatus === "all" || bill.status === filterStatus;
      const matchesSearch =
        bill.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.roomInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth =
        !selectedMonth || bill.period.includes(selectedMonth);
      return matchesStatus && matchesSearch && matchesMonth;
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case "paid":
        return styles.statusPaid;
      case "pending":
        return styles.statusPending;
      case "overdue":
        return styles.statusOverdue;
      case "processing":
        return styles.statusProcessing;
      case "completed":
        return styles.statusCompleted;
      default:
        return "";
    }
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className={styles.loadingState}>
      <div className={styles.spinner}></div>
      <p>Đang tải thông tin hóa đơn...</p>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className={styles.errorState}>
      <AlertCircle size={64} className={styles.errorIcon} />
      <h2>Đã có lỗi xảy ra</h2>
      <p>{error}</p>
      <div className={styles.actions}>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <Receipt size={64} className={styles.emptyIcon} />
      <h2>Không có hóa đơn</h2>
      <p>Bạn chưa có hóa đơn nào trong hệ thống</p>
    </div>
  );
  return (
    <div className={styles.container}>
      {/* Loading, Error và Empty states */}
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Đang tải thông tin hóa đơn...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <AlertCircle size={64} className={styles.errorIcon} />
          <h2>Đã có lỗi xảy ra</h2>
          <p>{error}</p>
          <div className={styles.actions}>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {!loading && !error && bills.length === 0 && (
        <div className={styles.emptyState}>
          <Receipt size={64} className={styles.emptyIcon} />
          <h2>Không có hóa đơn</h2>
          <p>Bạn chưa có hóa đơn nào trong hệ thống</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && bills.length > 0 && (
        <>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <div className={styles.headerTitle}>
                <FileText size={24} className={styles.icon} />
                <h1>Hóa Đơn & Thanh Toán</h1>
              </div>
              <div className={styles.headerActions}>
                <button
                  className={styles.statsToggle}
                  onClick={() => setShowStats(!showStats)}
                >
                  <PieChart size={20} />
                  {showStats ? "Ẩn thống kê" : "Hiện thống kê"}
                </button>
                <button className={styles.notification}>
                  <BellRing size={20} />
                  <span className={styles.badge}>2</span>
                </button>
              </div>
            </div>

            {showStats && (
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <h4>Tổng đã thanh toán</h4>
                  <p>{formatCurrency(billStats.totalPaid)}</p>
                  <span className={styles.statTrend}>
                    <ArrowUpRight size={16} />
                    +12.5%
                  </span>
                </div>
                <div className={styles.statCard}>
                  <h4>Đang chờ thanh toán</h4>
                  <p>{formatCurrency(billStats.totalPending)}</p>
                </div>
                <div className={styles.statCard}>
                  <h4>Trung bình/tháng</h4>
                  <p>{formatCurrency(billStats.averageMonthly)}</p>
                </div>
                <div className={styles.statCard}>
                  <h4>Thanh toán đúng hạn</h4>
                  <p>{billStats.onTimePayment}%</p>
                </div>
              </div>
            )}

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  activeTab === "history" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("history")}
              >
                <Receipt size={20} />
                <span>Lịch sử hóa đơn</span>
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "payment" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("payment")}
              >
                <CreditCard size={20} />
                <span>Thanh toán</span>
              </button>
            </div>
          </div>

          <div className={styles.content}>
            {activeTab === "history" && (
              <div className={styles.historyTab}>
                <div className={styles.filters}>
                  <div className={styles.searchBox}>
                    <Search size={20} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm hóa đơn..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className={styles.filterGroup}>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="pending">Chờ thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                    </select>

                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="">Tất cả các tháng</option>
                      <option value="10/2024">Tháng 10/2024</option>
                      <option value="9/2024">Tháng 9/2024</option>
                      <option value="8/2024">Tháng 8/2024</option>
                    </select>
                  </div>
                </div>

                <div className={styles.billsGrid}>
                  <div className={styles.billsList}>
                    {filterBills().map((bill) => (
                      <div
                        key={bill.id}
                        className={`${styles.billCard} ${
                          selectedBill?.id === bill.id ? styles.selected : ""
                        }`}
                        onClick={() => setSelectedBill(bill)}
                      >
                        <div className={styles.billHeader}>
                          <div className={styles.billInfo}>
                            <h3>{bill.period}</h3>
                            <p className={styles.roomInfo}>
                              {bill.roomInfo.name} - {bill.roomInfo.type}
                            </p>
                          </div>
                          <span
                            className={`${styles.status} ${getStatusColorClass(
                              bill.status
                            )}`}
                          >
                            {bill.status === "paid" ? (
                              <>
                                <CheckCircle2 size={16} /> Đã thanh toán
                              </>
                            ) : (
                              <>
                                <Clock size={16} /> Chờ thanh toán
                              </>
                            )}
                          </span>
                        </div>

                        <div className={styles.billAmount}>
                          <div>
                            <span className={styles.label}>Tổng tiền:</span>
                            <span className={styles.amount}>
                              {formatCurrency(bill.amount)}
                            </span>
                          </div>
                          {bill.status === "pending" && (
                            <div className={styles.dueDate}>
                              <AlertCircle size={16} />
                              <span>
                                Hạn thanh toán: {formatDate(bill.dueDate)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className={styles.billSummary}>
                          {bill.items.slice(0, 2).map((item, index) => (
                            <div key={index} className={styles.billItem}>
                              <div className={styles.itemInfo}>
                                <span className={styles.itemName}>
                                  {item.name}
                                </span>
                                {item.usage && (
                                  <span className={styles.itemUsage}>
                                    {item.usage}
                                  </span>
                                )}
                              </div>
                              <span className={styles.itemAmount}>
                                {formatCurrency(item.amount)}
                              </span>
                            </div>
                          ))}
                          {bill.items.length > 2 && (
                            <div className={styles.moreItems}>
                              +{bill.items.length - 2} khoản khác
                            </div>
                          )}
                        </div>

                        {bill.status === "pending" ? (
                          <button
                            className={styles.payButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayment(bill.id);
                            }}
                          >
                            <CreditCard size={20} />
                            Thanh toán ngay
                          </button>
                        ) : (
                          <div className={styles.paymentInfo}>
                            <div className={styles.paymentMethod}>
                              Thanh toán qua: {bill.paymentMethod}
                            </div>
                            <div className={styles.paidDate}>
                              Ngày: {formatDate(bill.paidDate)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedBill && (
                    <div className={styles.billDetail}>
                      <div className={styles.billDetailHeader}>
                        <div className={styles.roomImageContainer}>
                          <img
                            src={selectedBill.roomInfo.image}
                            alt={selectedBill.roomInfo.name}
                            className={styles.roomImage}
                          />
                          <span className={styles.roomType}>
                            {selectedBill.roomInfo.type}
                          </span>
                        </div>

                        <div className={styles.billDetailInfo}>
                          <h2>{selectedBill.period}</h2>
                          <p className={styles.roomName}>
                            <Home size={16} className={styles.icon} />
                            {selectedBill.roomInfo.name}
                          </p>
                          <p className={styles.roomAddress}>
                            <MapPin size={16} className={styles.icon} />
                            {selectedBill.roomInfo.address}
                          </p>
                          <div className={styles.contractInfo}>
                            <span>Mã HĐ: {selectedBill.contractInfo.id}</span>
                            <span className={styles.tenantName}>
                              <User size={16} className={styles.icon} />
                              {selectedBill.contractInfo.tenant.name}
                            </span>
                          </div>
                          <div
                            className={`${
                              styles.billStatus
                            } ${getStatusColorClass(selectedBill.status)}`}
                          >
                            {selectedBill.status === "paid" ? (
                              <>
                                <CheckCircle2 size={20} />
                                Đã thanh toán
                              </>
                            ) : (
                              <>
                                <Clock size={20} />
                                Chờ thanh toán
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.billBreakdown}>
                        <h3>Chi tiết hóa đơn</h3>
                        <div className={styles.billItems}>
                          {selectedBill.items.map((item, index) => (
                            <div key={index} className={styles.item}>
                              <div className={styles.itemDetails}>
                                <span className={styles.itemName}>
                                  {item.name}
                                </span>
                                {item.usage && (
                                  <div className={styles.usageDetails}>
                                    <span className={styles.usage}>
                                      {item.usage}
                                    </span>
                                    {item.previous !== undefined && (
                                      <span className={styles.usageChange}>
                                        {item.previous} → {item.current}
                                      </span>
                                    )}
                                    <span className={styles.unitPrice}>
                                      ({item.unitPrice})
                                    </span>
                                  </div>
                                )}
                                {item.details && (
                                  <span className={styles.itemDetails}>
                                    {item.details}
                                  </span>
                                )}
                              </div>
                              <span className={styles.itemAmount}>
                                {formatCurrency(item.amount)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className={styles.totalAmount}>
                          <div className={styles.totalLabel}>Tổng cộng</div>
                          <div className={styles.totalValue}>
                            {formatCurrency(selectedBill.amount)}
                          </div>
                        </div>

                        {selectedBill.status === "pending" && (
                          <div className={styles.dueInfo}>
                            <AlertCircle size={16} className={styles.icon} />
                            <span>
                              Hạn thanh toán: {formatDate(selectedBill.dueDate)}
                            </span>
                          </div>
                        )}

                        {selectedBill.status === "paid" && (
                          <div className={styles.paidInfo}>
                            <div className={styles.paidDetail}>
                              <span className={styles.paidLabel}>
                                Phương thức:
                              </span>
                              <span className={styles.paidValue}>
                                {selectedBill.paymentMethod}
                              </span>
                            </div>
                            <div className={styles.paidDetail}>
                              <span className={styles.paidLabel}>
                                Ngày thanh toán:
                              </span>
                              <span className={styles.paidValue}>
                                {formatDate(selectedBill.paidDate)}
                              </span>
                            </div>
                            <div className={styles.paidDetail}>
                              <span className={styles.paidLabel}>
                                Mã giao dịch:
                              </span>
                              <span className={styles.paidValue}>
                                {selectedBill.transactionId}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.billTimeline}>
                        <h3>Lịch sử hoạt động</h3>
                        <div className={styles.timeline}>
                          {selectedBill.history.map((event, index) => (
                            <div key={index} className={styles.timelineItem}>
                              <div className={styles.timelineLine}></div>
                              <div
                                className={`${styles.timelineDot} ${
                                  event.status === "completed"
                                    ? styles.completed
                                    : ""
                                }`}
                              ></div>
                              <div className={styles.timelineInfo}>
                                <div className={styles.timelineHeader}>
                                  <span className={styles.timelineAction}>
                                    {event.action}
                                  </span>
                                  <span className={styles.timelineDate}>
                                    {event.date}
                                  </span>
                                </div>
                                {event.status === "completed" && (
                                  <span className={styles.completedBadge}>
                                    <CheckCircle2 size={12} />
                                    Hoàn thành
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.billActions}>
                        <button
                          className={styles.downloadButton}
                          onClick={() => {
                            showToast(
                              "Đang chuẩn bị tải hóa đơn PDF...",
                              "info"
                            );
                            setTimeout(() => {
                              showToast("Tải hóa đơn thành công", "success");
                            }, 1500);
                          }}
                        >
                          <Download size={18} />
                          Tải hóa đơn
                        </button>

                        {selectedBill.status === "pending" && (
                          <button
                            className={styles.payNowButton}
                            onClick={() => handlePayment(selectedBill.id)}
                          >
                            <CreditCard size={18} />
                            Thanh toán ngay
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className={styles.paymentTab}>
                {selectedBill ? (
                  <div className={styles.paymentContainer}>
                    <div className={styles.selectedBillSummary}>
                      <div className={styles.summaryHeader}>
                        <h3>Thông tin hóa đơn</h3>
                        <button
                          className={styles.changeBillButton}
                          onClick={() => setActiveTab("history")}
                        >
                          Đổi hóa đơn
                        </button>
                      </div>

                      <div className={styles.summaryContent}>
                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>
                            Kỳ thanh toán:
                          </span>
                          <span className={styles.summaryValue}>
                            {selectedBill.period}
                          </span>
                        </div>

                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>Phòng:</span>
                          <span className={styles.summaryValue}>
                            {selectedBill.roomInfo.name}
                          </span>
                        </div>

                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>
                            Hạn thanh toán:
                          </span>
                          <span
                            className={`${styles.summaryValue} ${styles.dueDate}`}
                          >
                            {formatDate(selectedBill.dueDate)}
                          </span>
                        </div>

                        <div className={styles.summaryDivider}></div>

                        <div className={styles.briefItems}>
                          {selectedBill.items.map((item, index) => (
                            <div key={index} className={styles.briefItem}>
                              <span className={styles.briefItemName}>
                                {item.name}
                              </span>
                              <span className={styles.briefItemAmount}>
                                {formatCurrency(item.amount)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className={styles.summaryDivider}></div>

                        <div
                          className={`${styles.summaryRow} ${styles.totalRow}`}
                        >
                          <span className={styles.totalLabel}>
                            Tổng thanh toán:
                          </span>
                          <span className={styles.totalAmount}>
                            {formatCurrency(selectedBill.amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.paymentMethods}>
                      <h3>Chọn phương thức thanh toán</h3>

                      <div className={styles.methodsList}>
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`${styles.methodCard} ${
                              selectedPaymentMethod === method.id
                                ? styles.selected
                                : ""
                            }`}
                            onClick={() => handleSelectPaymentMethod(method.id)}
                          >
                            <div className={styles.methodHeader}>
                              {method.icon}
                              <div className={styles.methodInfo}>
                                <h4>{method.title}</h4>
                                <p>{method.description}</p>
                              </div>
                              {selectedPaymentMethod === method.id && (
                                <CheckCircle2
                                  className={styles.selectedIcon}
                                  size={20}
                                />
                              )}
                            </div>

                            {selectedPaymentMethod === method.id && (
                              <div className={styles.methodDetails}>
                                {method.promotion && (
                                  <div className={styles.promotion}>
                                    <span className={styles.promotionTag}>
                                      Ưu đãi
                                    </span>
                                    <span>{method.promotion}</span>
                                  </div>
                                )}

                                {method.banks && (
                                  <div className={styles.bankList}>
                                    <h5>Ngân hàng hỗ trợ:</h5>
                                    <ul>
                                      {method.banks.map((bank, index) => (
                                        <li key={index}>{bank}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {method.features && (
                                  <div className={styles.featureList}>
                                    <h5>Tính năng:</h5>
                                    <ul>
                                      {method.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {method.accountInfo && (
                                  <div className={styles.accountInfo}>
                                    <h5>Thông tin tài khoản:</h5>
                                    <div className={styles.accountGrid}>
                                      <div className={styles.accountItem}>
                                        <span className={styles.accountLabel}>
                                          Ngân hàng:
                                        </span>
                                        <span className={styles.accountValue}>
                                          {method.accountInfo.bank}
                                        </span>
                                      </div>

                                      <div className={styles.accountItem}>
                                        <span className={styles.accountLabel}>
                                          Số tài khoản:
                                        </span>
                                        <div className={styles.copyableValue}>
                                          <span>
                                            {method.accountInfo.number}
                                          </span>
                                          <button
                                            className={styles.copyButton}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(
                                                method.accountInfo.number
                                              );
                                              showToast(
                                                "Đã sao chép số tài khoản",
                                                "success"
                                              );
                                            }}
                                          >
                                            Sao chép
                                          </button>
                                        </div>
                                      </div>

                                      <div className={styles.accountItem}>
                                        <span className={styles.accountLabel}>
                                          Chủ tài khoản:
                                        </span>
                                        <span className={styles.accountValue}>
                                          {method.accountInfo.name}
                                        </span>
                                      </div>

                                      <div className={styles.accountItem}>
                                        <span className={styles.accountLabel}>
                                          Chi nhánh:
                                        </span>
                                        <span className={styles.accountValue}>
                                          {method.accountInfo.branch}
                                        </span>
                                      </div>

                                      <div className={styles.transferContent}>
                                        <span className={styles.accountLabel}>
                                          Nội dung chuyển khoản:
                                        </span>
                                        <div className={styles.copyableValue}>
                                          <span>
                                            THANHTOAN {selectedBill.id}
                                          </span>
                                          <button
                                            className={styles.copyButton}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(
                                                `THANHTOAN ${selectedBill.id}`
                                              );
                                              showToast(
                                                "Đã sao chép nội dung chuyển khoản",
                                                "success"
                                              );
                                            }}
                                          >
                                            Sao chép
                                          </button>
                                        </div>
                                      </div>

                                      <button
                                        className={styles.qrButton}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowQRCode(!showQRCode);
                                        }}
                                      >
                                        <QrCode size={16} />
                                        {showQRCode
                                          ? "Ẩn mã QR"
                                          : "Hiển thị mã QR"}
                                      </button>

                                      {showQRCode && (
                                        <div className={styles.qrContainer}>
                                          <img
                                            src={MaQR}
                                            alt="QR thanh toán"
                                            className={styles.qrImage}
                                          />
                                          <span className={styles.qrNote}>
                                            Quét mã để thanh toán
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className={styles.paymentAction}>
                        <button
                          className={styles.confirmButton}
                          disabled={!selectedPaymentMethod}
                          onClick={() => handlePayment(selectedBill.id)}
                        >
                          <CheckCircle2 size={20} />
                          Xác nhận thanh toán
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.noBillSelected}>
                    <Receipt size={64} className={styles.icon} />
                    <h3>Chưa chọn hóa đơn</h3>
                    <p>
                      Vui lòng chọn hóa đơn cần thanh toán từ tab "Lịch sử hóa
                      đơn"
                    </p>
                    <button
                      className={styles.selectBillButton}
                      onClick={() => setActiveTab("history")}
                    >
                      Chọn hóa đơn
                    </button>
                  </div>
                )}

                <div className={styles.paymentGuide}>
                  <h3>Hướng dẫn thanh toán</h3>
                  <div className={styles.guideSteps}>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>1</div>
                      <div className={styles.stepContent}>
                        <h4>Chọn hóa đơn</h4>
                        <p>Chọn hóa đơn cần thanh toán từ danh sách</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>2</div>
                      <div className={styles.stepContent}>
                        <h4>Chọn phương thức</h4>
                        <p>Lựa chọn phương thức thanh toán phù hợp</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>3</div>
                      <div className={styles.stepContent}>
                        <h4>Xác nhận thanh toán</h4>
                        <p>Kiểm tra và xác nhận thông tin thanh toán</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>4</div>
                      <div className={styles.stepContent}>
                        <h4>Hoàn tất</h4>
                        <p>Nhận biên lai và xác nhận thanh toán</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.footerInfo}>
              <Shield size={20} className={styles.icon} />
              <p>
                Mọi thông tin thanh toán của bạn đều được bảo mật theo quy định
                pháp luật.
              </p>
            </div>

            <div className={styles.footerActions}>
              <button
                className={styles.supportButton}
                onClick={() => {
                  showToast("Đã gửi yêu cầu hỗ trợ", "info");
                }}
              >
                <User size={16} />
                Yêu cầu hỗ trợ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BillPayment;
