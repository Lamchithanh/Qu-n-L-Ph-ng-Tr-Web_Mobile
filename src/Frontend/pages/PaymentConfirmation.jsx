import React, { useState, useEffect } from "react";
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
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";

const PaymentConfirmation = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [contractDetails, setContractDetails] = useState(null);

  // Lấy thông tin từ state
  const contractId = location.state?.contractId;
  const displayCode = location.state?.displayCode;
  const isNewContract = location.state?.isNewContract || false;

  // Nếu có displayCode, ưu tiên sử dụng nó
  const displayContractId =
    displayCode ||
    contractDetails?.display_code ||
    (contractId ? `HD${String(contractId).padStart(4, "0")}` : "");

  const contractIdStr = contractId ? String(contractId) : "";

  useEffect(() => {
    console.log("Received contractId:", contractId);
    console.log("Full location state:", location.state);

    // Lấy thông tin người dùng từ localStorage nếu có
    const userInfo = localStorage.getItem("userInfo");
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
    const userName = parsedUserInfo?.full_name || parsedUserInfo?.name || "";

    // Kiểm tra xem có contractId không
    if (!contractId) {
      showToast("Không tìm thấy thông tin hợp đồng", "error");
      navigate("/");
      return;
    }

    // Lấy thông tin người dùng từ API nếu đã đăng nhập
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) return null;

        const response = await fetch(`${CONFIG.API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    };

    // Format mã hợp đồng
    const formatContractCode = (id, prefix = "HD") => {
      return `${prefix}${String(id).padStart(4, "0")}`;
    };

    // Đảm bảo contractId luôn là chuỗi và xử lý tiền tố một cách linh hoạt
    const contractIdStr = String(contractId);
    let numericContractId;

    // Kiểm tra nếu là định dạng "HDXXXX"
    if (contractIdStr.startsWith("HD") && !isNaN(contractIdStr.substring(2))) {
      numericContractId = parseInt(contractIdStr.substring(2), 10);
    }
    // Nếu là số nguyên, sử dụng trực tiếp
    else if (!isNaN(contractIdStr)) {
      numericContractId = parseInt(contractIdStr, 10);
    }

    console.log("Processed Contract ID:", numericContractId);

    // Sử dụng formatContractCode để đảm bảo mã hợp đồng luôn đúng định dạng
    const formattedContractId = formatContractCode(numericContractId);

    // Nếu có thông tin về số tiền, có thể hiển thị ngay mà không cần fetch
    if (location.state?.amount) {
      // Lấy thông tin người dùng nếu đã đăng nhập
      const fetchAndSetContractDetails = async () => {
        const token = localStorage.getItem("userToken");
        const userProfile = token ? await fetchUserProfile() : null;
        const userFullName =
          userProfile?.full_name || userProfile?.name || userName || "";

        // Tạo dữ liệu hợp đồng từ state đã có
        const contractIdStr = String(contractId);
        setContractDetails({
          id: contractIdStr.startsWith("HD")
            ? contractIdStr
            : `HD${contractIdStr.padStart(4, "0")}`,
          status: "pending",
          payment: {
            deposit: location.state.amount,
            rent: location.state.amount / 2, // giả sử tiền đặt cọc = 2 tháng tiền thuê
          },
          room: {
            name: location.state?.room_name || "Phòng mới đăng ký",
            address: location.state?.room_address || "Đang cập nhật",
          },
          tenant: {
            name: location.state?.tenant_name || userFullName || "Người thuê",
            full_name:
              location.state?.tenant_full_name ||
              location.state?.tenant_name ||
              userFullName ||
              "Người thuê",
          },
        });
      };

      fetchAndSetContractDetails();
      return;
    }

    // Fetch chi tiết hợp đồng chỉ khi không có đủ thông tin
    const fetchContractDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");

        // Lấy thông tin người dùng nếu đã đăng nhập
        const userProfile = token ? await fetchUserProfile() : null;
        const userFullName =
          userProfile?.full_name || userProfile?.name || userName || "";

        const response = await fetch(
          `${CONFIG.API_URL}/contracts/${numericContractId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        console.log("Chi tiết hợp đồng:", result);
        if (result.success) {
          setContractDetails({
            ...result.data,
            id: formattedContractId, // Sử dụng mã hợp đồng đã format
            display_code: result.data.display_code || formattedContractId,
            payment: {
              deposit:
                result.data.deposit_amount || location.state?.amount || 0,
              rent:
                result.data.monthly_rent ||
                (location.state?.amount ? location.state.amount / 2 : 0),
            },
            room: {
              name: result.data.room_name || "Phòng mới đăng ký",
              address: result.data.room_address || "Đang cập nhật",
            },
            tenant: {
              name: result.data.tenant_name || userFullName || "Người thuê",
              full_name:
                result.data.tenant_full_name ||
                result.data.tenant_name ||
                userFullName ||
                "Người thuê",
            },
          });
        } else {
          // Hiển thị thông báo nhưng không chuyển hướng
          showToast(
            result.message ||
              "Không thể tải đầy đủ thông tin hợp đồng, sử dụng thông tin cơ bản",
            "warning"
          );

          // Sử dụng thông tin cơ bản từ state
          setContractDetails({
            id: `HD${String(contractId).padStart(4, "0")}`,
            status: "pending",
            payment: {
              deposit: location.state?.amount || 0,
              rent: location.state?.amount ? location.state.amount / 2 : 0,
            },
            room: {
              name: "Phòng mới đăng ký",
              address: "Thông tin sẽ được cập nhật",
            },
            tenant: {
              name: location.state?.tenant_name || userFullName || "Người thuê",
              full_name:
                location.state?.tenant_full_name ||
                location.state?.tenant_name ||
                userFullName ||
                "Người thuê",
            },
          });
        }
      } catch (error) {
        console.error("Lỗi tải thông tin hợp đồng:", error);
        showToast("Đã có lỗi xảy ra, sử dụng thông tin cơ bản", "warning");

        // Sử dụng thông tin cơ bản từ state trong trường hợp lỗi
        setContractDetails({
          id: `HD${String(contractId).padStart(4, "0")}`,
          status: "pending",
          payment: {
            deposit: location.state?.amount || 0,
            rent: location.state?.amount ? location.state.amount / 2 : 0,
          },
          room: {
            name: "Phòng mới đăng ký",
            address: "Đang cập nhật",
          },
          tenant: {
            name: location.state?.tenant_name || userName || "Người thuê",
            full_name:
              location.state?.tenant_full_name ||
              location.state?.tenant_name ||
              userName ||
              "Người thuê",
          },
        });
      }
    };

    fetchContractDetails();
  }, [contractId, navigate, showToast, location.state]);

  useEffect(() => {
    console.log("Received contractId:", contractId);
    console.log("Full location state:", location.state);

    // Check if the ID exists
    if (contractId) {
      // Đảm bảo contractId là chuỗi trước khi sử dụng
      const contractIdStr = String(contractId);

      // Xử lý tiền tố nếu có
      const cleanContractId = contractIdStr.startsWith("HD")
        ? contractIdStr.substring(2)
        : contractIdStr;

      console.log("Cleaned Contract ID:", cleanContractId);
    }
  }, [contractId]);

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

  const handlePayment = async () => {
    if (!selectedMethod || !contractDetails) return;

    setProcessingPayment(true);
    try {
      const token = localStorage.getItem("userToken");

      // Format mã hợp đồng
      const formatContractCode = (id, prefix = "HD") => {
        return `${prefix}${String(id).padStart(4, "0")}`;
      };

      // Đảm bảo contractId luôn là chuỗi và xử lý tiền tố một cách linh hoạt
      const contractIdStr = String(contractId);
      let numericContractId;

      // Kiểm tra nếu là định dạng "HDXXXX"
      if (
        contractIdStr.startsWith("HD") &&
        !isNaN(contractIdStr.substring(2))
      ) {
        numericContractId = parseInt(contractIdStr.substring(2), 10);
      }
      // Nếu là số nguyên, sử dụng trực tiếp
      else if (!isNaN(contractIdStr)) {
        numericContractId = parseInt(contractIdStr, 10);
      }

      // Sử dụng formatContractCode để đảm bảo mã hợp đồng luôn đúng định dạng
      const formattedContractId = formatContractCode(numericContractId);

      const response = await fetch(`${CONFIG.API_URL}/contracts/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contract_id: Number(numericContractId), // Sử dụng numericContractId
          amount: contractDetails.payment.deposit,
          payment_method: selectedMethod,
        }),
      });

      console.log(`Calling URL: ${CONFIG.API_URL}/contracts/payments`);
      console.log("Contract ID for payment:", contractId);
      console.log("Numeric Contract ID:", numericContractId);

      const result = await response.json();

      if (result.success) {
        // Chuyển đến trang xác nhận thanh toán thành công
        navigate("/payment-success", {
          state: {
            contractId,
            displayCode: displayContractId,
            amount: contractDetails.payment.deposit,
            method: selectedMethod,
            isNewContract,
          },
        });
      } else {
        showToast(result.message || "Thanh toán không thành công", "error");
        setProcessingPayment(false);
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      showToast("Đã có lỗi xảy ra khi thanh toán", "error");
      setProcessingPayment(false);
    }
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className={styles.container}>
      {contractDetails ? (
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
                <strong>{displayContractId}</strong>
              </div>
              <div className={styles.detail}>
                <span>Số tiền cọc:</span>
                <strong className={styles.amount}>
                  {formatCurrency(contractDetails.payment.deposit)}
                </strong>
              </div>
            </div>
            <button
              className={styles.detailsToggle}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
              {showDetails ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {showDetails && (
              <div className={styles.detailsContent}>
                <div className={styles.detailRow}>
                  <span>Phí dịch vụ:</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Tổng thanh toán:</span>
                  <strong>
                    {formatCurrency(contractDetails.payment.deposit)}
                  </strong>
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
                            <code>
                              DATCOC {displayContractId}{" "}
                              {contractDetails?.tenant?.full_name ||
                                contractDetails?.tenant?.name ||
                                ""}
                            </code>
                            <button
                              className={styles.copyBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(
                                  `DATCOC ${displayContractId} ${
                                    contractDetails?.tenant?.full_name ||
                                    contractDetails?.tenant?.name ||
                                    ""
                                  }`
                                );
                              }}
                            >
                              Sao chép
                            </button>
                          </div>
                          <p className={styles.noteText}>
                            * Vui lòng ghi đúng nội dung chuyển khoản để được
                            xác nhận tự động. Nội dung bao gồm: DATCOC + Mã hợp
                            đồng + Tên người thuê
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
      ) : (
        <div className={styles.loadingState}>
          <Clock size={48} />
          <p>Đang tải thông tin hợp đồng...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation;
