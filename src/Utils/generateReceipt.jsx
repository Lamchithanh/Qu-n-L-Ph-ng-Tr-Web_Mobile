import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { CONFIG } from "../Frontend/config/config";

// Sử dụng font Helvetica thay vì Times-Roman để hỗ trợ tiếng Việt tốt hơn
// Helvetica là font mặc định của react-pdf/renderer và hỗ trợ Unicode tốt hơn

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "1px solid #E5E7EB",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4F46E5",
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#F9FAFB",
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1px solid #E5E7EB",
  },
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 5,
  },
  label: {
    fontSize: 11,
    color: "#6B7280",
    width: "40%",
  },
  value: {
    fontSize: 11,
    color: "#1F2937",
    width: "60%",
    textAlign: "right",
  },
  highlight: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
  success: {
    color: "#10B981",
    fontWeight: "bold",
  },
  divider: {
    borderBottom: "1px dashed #E5E7EB",
    marginVertical: 10,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6B7280",
    paddingTop: 20,
    borderTop: "1px solid #E5E7EB",
  },
  qrCode: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  verificationSection: {
    alignItems: "center",
    marginTop: 20,
  },
  verificationText: {
    fontSize: 9,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 5,
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 5,
  },
  statusBadge: {
    backgroundColor: "#ECFDF5",
    padding: 5,
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  statusText: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "bold",
  },
  note: {
    fontSize: 10,
    color: "#6B7280",
    fontStyle: "italic",
    marginTop: 10,
  },
});

// Hàm chuyển đổi tiếng Việt sang không dấu để đảm bảo hiển thị đúng
const removeVietnameseAccents = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const ReceiptDocument = ({
  contractId,
  transactionId,
  amount,
  paymentMethod,
  tenantInfo,
  transactionDate,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>QLPT</Text>
          </View>
          <Text style={styles.dateText}>
            Ngay: {transactionDate || new Date().toLocaleDateString("vi-VN")}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>DA THANH TOAN</Text>
          </View>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>BIEN NHAN THANH TOAN</Text>
      <Text style={styles.subtitle}>Xac nhan dat coc hop dong thue phong</Text>

      {/* Transaction Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thong tin giao dich</Text>

        <View style={styles.detail}>
          <Text style={styles.label}>Ma hop dong:</Text>
          <Text style={styles.value}>{contractId}</Text>
        </View>

        <View style={styles.detail}>
          <Text style={styles.label}>Ma giao dich:</Text>
          <Text style={[styles.value, styles.highlight]}>{transactionId}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detail}>
          <Text style={styles.label}>Ngay thanh toan:</Text>
          <Text style={styles.value}>
            {transactionDate || new Date().toLocaleDateString("vi-VN")}
          </Text>
        </View>

        <View style={styles.detail}>
          <Text style={styles.label}>So tien thanh toan:</Text>
          <Text style={[styles.value, styles.highlight]}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(amount)}
          </Text>
        </View>

        <View style={styles.detail}>
          <Text style={styles.label}>Phuong thuc:</Text>
          <Text style={styles.value}>
            {removeVietnameseAccents(paymentMethod)}
          </Text>
        </View>

        <View style={styles.detail}>
          <Text style={styles.label}>Trang thai:</Text>
          <Text style={[styles.value, styles.success]}>Da thanh toan</Text>
        </View>
      </View>

      {/* Tenant Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thong tin nguoi thanh toan</Text>

        <View style={styles.detail}>
          <Text style={styles.label}>Ho va ten:</Text>
          <Text style={styles.value}>
            {removeVietnameseAccents(tenantInfo.fullName) || "Chua cap nhat"}
          </Text>
        </View>

        <View style={styles.detail}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>
            {tenantInfo.email || "Chua cap nhat"}
          </Text>
        </View>

        <View style={styles.detail}>
          <Text style={styles.label}>So dien thoai:</Text>
          <Text style={styles.value}>
            {tenantInfo.phone || "Chua cap nhat"}
          </Text>
        </View>
      </View>

      {/* Note */}
      <View style={styles.section}>
        <Text style={styles.note}>
          Bien nhan nay la xac nhan cho viec dat coc hop dong thue phong. Vui
          long giu lai bien nhan nay de xuat trinh khi can thiet.
        </Text>
      </View>

      {/* Verification Section */}
      <View style={styles.verificationSection}>
        <Text style={styles.verificationText}>
          Ma xac thuc: {transactionId}
        </Text>
        <Text style={styles.verificationText}>
          Bien nhan nay duoc tao tu dong tu he thong va co gia tri phap ly ma
          khong can chu ky.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>He thong Quan ly Phong tro - QLPT</Text>
        <Text>Dia chi: 123 Duong ABC, Quan XYZ, TP. Ho Chi Minh</Text>
        <Text>Hotline: 0123 456 789 | Email: support@qlpt.com</Text>
      </View>
    </Page>
  </Document>
);

export const generateReceipt = async (data) => {
  try {
    // Chuẩn bị dữ liệu mặc định từ tham số đầu vào
    let receiptData = {
      contractId: data.contractId,
      transactionId: data.confirmationCode,
      amount: data.amount,
      paymentMethod: data.method || "Chuyen khoan",
      transactionDate: data.transactionDate,
      tenantInfo: {
        fullName: data.tenantName || "",
        email: data.tenantEmail || "",
        phone: data.tenantPhone || "",
      },
    };

    // Chỉ thực hiện gọi API nếu có token
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        // Lấy thông tin người dùng trước (ít khả năng lỗi hơn)
        const profileResponse = await fetch(`${CONFIG.API_URL}/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Thêm timeout để tránh chờ quá lâu
          signal: AbortSignal.timeout(3000),
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData) {
            // Cập nhật thông tin người dùng từ API nếu có
            receiptData.tenantInfo.fullName =
              profileData.full_name || receiptData.tenantInfo.fullName;
            receiptData.tenantInfo.email =
              profileData.email || receiptData.tenantInfo.email;
            receiptData.tenantInfo.phone =
              profileData.phone || receiptData.tenantInfo.phone;
          }
        }

        // Không gọi API payments vì hiện tại endpoint không tồn tại
        // Sẽ sử dụng dữ liệu mặc định từ tham số đầu vào
      } catch (apiError) {
        console.warn(
          "Không thể lấy dữ liệu từ API, sử dụng dữ liệu mặc định:",
          apiError.message
        );
        // Tiếp tục với dữ liệu mặc định nếu có lỗi
      }
    }

    // Tạo document PDF với dữ liệu đã chuẩn bị
    const pdfDoc = pdf(
      <ReceiptDocument
        contractId={receiptData.contractId}
        transactionId={receiptData.transactionId}
        amount={receiptData.amount}
        paymentMethod={receiptData.paymentMethod}
        transactionDate={receiptData.transactionDate}
        tenantInfo={receiptData.tenantInfo}
      />
    );

    // Chuyển PDF thành Blob
    const blob = await pdfDoc.toBlob();

    // Tạo URL tải xuống
    const url = URL.createObjectURL(blob);

    // Tạo link tải
    const link = document.createElement("a");
    link.href = url;
    link.download = `bien-nhan-${receiptData.contractId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Giải phóng bộ nhớ
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Lỗi tạo biên nhận:", error);
    alert("Không thể tạo biên nhận. Vui lòng thử lại sau.");
    return { success: false, error: error.message };
  }
};
