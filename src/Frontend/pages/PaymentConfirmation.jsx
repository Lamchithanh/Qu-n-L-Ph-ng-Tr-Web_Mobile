import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Building2,
  Wallet,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  X,
  QrCode,
} from "lucide-react";
import styles from "../../Style/PaymentConfirmation.module.scss";
import MaQR from "../../assets/VCB_QR.png";
const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const contractId = location.state?.contractId || "HD2024-0123";
  const amount = location.state?.amount || 10000000;

  const paymentMethods = [
    {
      id: "banking",
      icon: <Building2 size={24} />,
      title: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản trực tiếp qua tài khoản ngân hàng",
      info: {
        bank: "Vietcombank",
        account: "9981911449",
        holder: "DANG LAM CHI THANH",
        branch: "Ninh Kiều, TP.Cần Thơ",
        qrCode: MaQR, // Đúng
      },
    },
    {
      id: "ewallet",
      icon: <Wallet size={24} />,
      title: "Ví điện tử",
      description: "Thanh toán qua ví MoMo, ZaloPay, VNPay",
      wallets: ["MoMo", "ZaloPay", "VNPay"],
    },
    {
      id: "card",
      icon: <CreditCard size={24} />,
      title: "Thẻ tín dụng/Ghi nợ",
      description: "Thanh toán bằng thẻ Visa, Mastercard, JCB",
      cards: ["Visa", "Mastercard", "JCB"],
    },
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setShowQR(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setProcessingPayment(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/payment-success", {
        state: {
          contractId,
          amount,
          method: selectedMethod,
        },
      });
    } catch (error) {
      setProcessingPayment(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Xác nhận thanh toán</h1>
          <div className={styles.steps}>
            <div className={`${styles.step} ${styles.completed}`}>
              <div className={styles.stepIcon}>
                <FileText size={20} />
              </div>
              <span>Ký hợp đồng</span>
              <ArrowRight size={16} />
            </div>
            <div className={`${styles.step} ${styles.active}`}>
              <div className={styles.stepIcon}>
                <DollarSign size={20} />
              </div>
              <span>Thanh toán</span>
              <ArrowRight size={16} />
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <BadgeCheck size={20} />
              </div>
              <span>Hoàn tất</span>
            </div>
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.orderInfo}>
            <div className={styles.detail}>
              <span>Mã hợp đồng:</span>
              <strong>{contractId}</strong>
            </div>
            <div className={styles.detail}>
              <span>Số tiền cọc:</span>
              <strong className={styles.amount}>
                {formatCurrency(amount)}
              </strong>
            </div>
          </div>
          <button
            className={styles.detailsToggle}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
            {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showDetails && (
            <div className={styles.detailsContent}>
              <div className={styles.detailRow}>
                <span>Phí dịch vụ:</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Tổng thanh toán:</span>
                <strong>{formatCurrency(amount)}</strong>
              </div>
            </div>
          )}
        </div>

        <div className={styles.methodsSection}>
          <h2>Chọn phương thức thanh toán</h2>
          <div className={styles.methods}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`${styles.methodCard} ${
                  selectedMethod === method.id ? styles.selected : ""
                }`}
                onClick={() => handleMethodSelect(method.id)}
              >
                <div className={styles.methodHeader}>
                  <div className={styles.methodIcon}>{method.icon}</div>
                  <div className={styles.methodInfo}>
                    <h3>{method.title}</h3>
                    <p>{method.description}</p>
                  </div>
                </div>
                {selectedMethod === method.id && method.id === "banking" && (
                  <div className={styles.methodDetails}>
                    <div className={styles.bankInfo}>
                      <div className={styles.bankActions}>
                        <button
                          className={`${styles.qrToggleBtn} ${
                            showQR ? styles.active : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleQR();
                          }}
                        >
                          <QrCode size={20} />
                          {showQR ? "Ẩn mã QR" : "Quét mã QR"}
                        </button>
                      </div>

                      {showQR ? (
                        <div className={styles.qrCodeContainer}>
                          <img
                            className={styles.qrImage}
                            src={MaQR}
                            alt="Mã QR thanh toán"
                          />
                          <p className={styles.qrNote}>
                            Quét mã QR để thanh toán nhanh qua ứng dụng ngân
                            hàng của bạn
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className={styles.bankDetail}>
                            <span>Ngân hàng:</span>
                            <strong>{method.info.bank}</strong>
                          </div>
                          <div className={styles.bankDetail}>
                            <span>Số tài khoản:</span>
                            <strong>{method.info.account}</strong>
                          </div>
                          <div className={styles.bankDetail}>
                            <span>Chủ tài khoản:</span>
                            <strong>{method.info.holder}</strong>
                          </div>
                          <div className={styles.bankDetail}>
                            <span>Chi nhánh:</span>
                            <strong>{method.info.branch}</strong>
                          </div>
                        </>
                      )}

                      <div className={styles.transferNote}>
                        <h4>Nội dung chuyển khoản:</h4>
                        <div className={styles.noteContent}>
                          <code>DATCOC {contractId}</code>
                          <button
                            className={styles.copyBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(
                                `DATCOC ${contractId}`
                              );
                            }}
                          >
                            Sao chép
                          </button>
                        </div>
                        <p className={styles.noteText}>
                          * Vui lòng ghi đúng nội dung chuyển khoản để được xác
                          nhận tự động
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {selectedMethod === method.id && method.id === "ewallet" && (
                  <div className={styles.walletOptions}>
                    {method.wallets.map((wallet) => (
                      <button key={wallet} className={styles.walletBtn}>
                        {wallet}
                      </button>
                    ))}
                  </div>
                )}
                {selectedMethod === method.id && method.id === "card" && (
                  <div className={styles.cardOptions}>
                    {method.cards.map((card) => (
                      <div key={card} className={styles.cardType}>
                        {card}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
            disabled={processingPayment}
          >
            <X size={20} />
            Hủy bỏ
          </button>
          <button
            className={styles.confirmBtn}
            onClick={handlePayment}
            disabled={!selectedMethod || processingPayment}
          >
            {processingPayment ? (
              <>
                <Clock size={20} />
                Đang xử lý...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Xác nhận thanh toán
              </>
            )}
          </button>
        </div>

        <div className={styles.notice}>
          <AlertCircle size={20} />
          <p>
            Vui lòng kiểm tra kỹ thông tin thanh toán trước khi xác nhận. Sau
            khi thanh toán thành công, bạn sẽ nhận được email xác nhận và hợp
            đồng có hiệu lực.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
