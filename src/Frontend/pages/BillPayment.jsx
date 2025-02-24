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
} from "lucide-react";
import styles from "../../Style/BillPayment.module.scss";

const BillPayment = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [selectedBill, setSelectedBill] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showStats, setShowStats] = useState(true);

  const billStats = {
    totalPaid: 12500000,
    totalPending: 3500000,
    averageMonthly: 2800000,
    onTimePayment: 95,
  };

  const bills = [
    {
      id: 1,
      period: "Tháng 10/2024",
      amount: 2500000,
      status: "pending",
      dueDate: "2024-10-25",
      roomInfo: {
        name: "Phòng 303A",
        type: "Căn hộ mini",
        address: "123 Nguyễn Văn Linh, Q7",
      },
      items: [
        {
          name: "Tiền điện",
          amount: 1200000,
          usage: "200 kWh",
          unitPrice: "3,500 VNĐ/kWh",
        },
        {
          name: "Tiền nước",
          amount: 800000,
          usage: "15m³",
          unitPrice: "25,000 VNĐ/m³",
        },
        {
          name: "Phí dịch vụ",
          amount: 500000,
          details: "Vệ sinh, bảo vệ, wifi",
        },
      ],
      history: [
        { date: "2024-10-15", action: "Tạo hóa đơn" },
        { date: "2024-10-20", action: "Gửi thông báo" },
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
        name: "Phòng 303A",
        type: "Căn hộ mini",
        address: "123 Nguyễn Văn Linh, Q7",
      },
      items: [
        {
          name: "Tiền điện",
          amount: 1100000,
          usage: "180 kWh",
          unitPrice: "3,500 VNĐ/kWh",
        },
        {
          name: "Tiền nước",
          amount: 700000,
          usage: "12m³",
          unitPrice: "25,000 VNĐ/m³",
        },
        {
          name: "Phí dịch vụ",
          amount: 500000,
          details: "Vệ sinh, bảo vệ, wifi",
        },
      ],
      history: [
        { date: "2024-09-15", action: "Tạo hóa đơn" },
        { date: "2024-09-18", action: "Gửi thông báo" },
        { date: "2024-09-20", action: "Thanh toán thành công" },
      ],
    },
  ];

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
        number: "1234567890",
        name: "NGUYEN VAN A",
      },
    },
  ];

  const handlePayment = (billId) => {
    console.log("Thanh toán hóa đơn:", billId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Hóa Đơn & Thanh Toán</h1>
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
            Lịch sử hóa đơn
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "payment" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("payment")}
          >
            <CreditCard size={20} />
            Thanh toán
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "history" ? (
          <>
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
                  <option value="09/2024">Tháng 09/2024</option>
                </select>
              </div>
            </div>

            <div className={styles.billList}>
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
                    <span className={`${styles.status} ${styles[bill.status]}`}>
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
                        Hạn thanh toán: {bill.dueDate}
                      </div>
                    )}
                  </div>

                  <div className={styles.billDetails}>
                    {bill.items.map((item, index) => (
                      <div key={index} className={styles.billItem}>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{item.name}</span>
                          {item.usage && (
                            <span className={styles.itemUsage}>
                              {item.usage} ({item.unitPrice})
                            </span>
                          )}
                        </div>
                        <span className={styles.itemAmount}>
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
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
                      <div className={styles.transactionId}>
                        Mã GD: {bill.transactionId}
                      </div>
                      <div className={styles.paymentMethod}>
                        Thanh toán qua: {bill.paymentMethod}
                      </div>
                    </div>
                  )}

                  <div className={styles.billHistory}>
                    <h4>Lịch sử</h4>
                    {bill.history.map((event, index) => (
                      <div key={index} className={styles.historyItem}>
                        <Clock size={14} />
                        <span className={styles.date}>{event.date}</span>
                        <span className={styles.action}>{event.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.paymentMethods}>
            <div className={styles.paymentHeader}>
              <h2>Phương thức thanh toán</h2>
              <p>Chọn phương thức thanh toán phù hợp với bạn</p>
            </div>

            <div className={styles.methodsGrid}>
              {paymentMethods.map((method) => (
                <div key={method.id} className={styles.methodCard}>
                  <div className={styles.methodHeader}>
                    {method.icon}
                    <div>
                      <h3>{method.title}</h3>
                      <p>{method.description}</p>
                    </div>
                  </div>

                  <div className={styles.methodContent}>
                    {method.promotion && (
                      <div className={styles.promotion}>
                        <span className={styles.promotionTag}>Ưu đãi</span>
                        {method.promotion}
                      </div>
                    )}

                    {method.banks && (
                      <div className={styles.bankList}>
                        <h4>Ngân hàng hỗ trợ:</h4>
                        <ul>
                          {method.banks.map((bank, index) => (
                            <li key={index}>{bank}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {method.features && (
                      <div className={styles.featureList}>
                        <h4>Tính năng:</h4>
                        <ul>
                          {method.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {method.accountInfo && (
                      <div className={styles.accountInfo}>
                        <h4>Thông tin tài khoản:</h4>
                        <p>Ngân hàng: {method.accountInfo.bank}</p>
                        <p>Số tài khoản: {method.accountInfo.number}</p>
                        <p>Chủ tài khoản: {method.accountInfo.name}</p>
                      </div>
                    )}
                  </div>

                  <button className={styles.selectMethod}>
                    Chọn phương thức
                    <ChevronDown size={16} />
                  </button>
                </div>
              ))}
            </div>

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
    </div>
  );
};

export default BillPayment;
