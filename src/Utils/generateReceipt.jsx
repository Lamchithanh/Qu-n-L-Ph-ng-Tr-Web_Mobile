import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { CONFIG } from "../Frontend/config/config";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman", // Hoặc 'Times-Roman'
    fontSize: 11,
    padding: 40,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
  },
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 5,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  value: {
    fontSize: 12,
    color: "#333",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
});

const ReceiptDocument = ({
  contractId,
  transactionId,
  amount,
  paymentMethod,
  tenantInfo,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>BIÊN NHẬN THANH TOÁN</Text>

      <View style={styles.section}>
        <View style={styles.detail}>
          <Text style={styles.label}>Ngày thanh toán</Text>
          <Text style={styles.value}>
            {new Date().toLocaleDateString("vi-VN")}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Mã hợp đồng</Text>
          <Text style={styles.value}>{contractId}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Mã giao dịch</Text>
          <Text style={styles.value}>{transactionId}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Số tiền thanh toán</Text>
          <Text style={styles.value}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(amount)}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Phương thức</Text>
          <Text style={styles.value}>{paymentMethod}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.detail}>
          <Text style={styles.label}>Tên người thanh toán</Text>
          <Text style={styles.value}>{tenantInfo.fullName}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{tenantInfo.email}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.value}>{tenantInfo.phone}</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Biên nhận điện tử - Hệ thống quản lý cho thuê phòng
      </Text>
    </Page>
  </Document>
);

export const generateReceipt = async (data) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      throw new Error("Không có phiên đăng nhập");
    }

    // Lấy thông tin giao dịch chi tiết
    const paymentResponse = await fetch(
      `${CONFIG.API_URL}/payments/transaction/${data.contractId}`, // Điều chỉnh endpoint
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    let paymentData;
    try {
      paymentData = await paymentResponse.json();
    } catch (parseError) {
      console.error("Lỗi parse JSON:", parseError);
      // Sử dụng dữ liệu từ input nếu không thể lấy từ API
      paymentData = {
        success: true,
        data: {
          transaction_id: data.confirmationCode,
          amount: data.amount,
          payment_method: data.method,
        },
      };
    }

    if (!paymentData.success) {
      console.warn(
        "Không thể lấy chi tiết thanh toán, sử dụng dữ liệu mặc định"
      );
      paymentData = {
        success: true,
        data: {
          transaction_id: data.confirmationCode,
          amount: data.amount,
          payment_method: data.method,
        },
      };
    }

    // Lấy thông tin người dùng
    const profileResponse = await fetch(`${CONFIG.API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    let profileData;
    try {
      profileData = await profileResponse.json();
    } catch (parseError) {
      console.error("Lỗi parse thông tin người dùng:", parseError);
      profileData = { success: false };
    }

    // Tạo document PDF
    const pdfDoc = pdf(
      <ReceiptDocument
        contractId={data.contractId}
        transactionId={paymentData.data.transaction_id || data.confirmationCode}
        amount={paymentData.data.amount || data.amount}
        paymentMethod={paymentData.data.payment_method || data.method}
        tenantInfo={{
          fullName: profileData.full_name || data.tenantName,
          email: profileData.email || data.tenantEmail,
          phone: profileData.phone,
        }}
      />
    );

    // Chuyển PDF thành Blob
    const blob = await pdfDoc.toBlob();

    // Tạo URL tải xuống
    const url = URL.createObjectURL(blob);

    // Tạo link tải
    const link = document.createElement("a");
    link.href = url;
    link.download = `bien-nhan-${data.contractId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Giải phóng bộ nhớ
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Lỗi tạo biên nhận:", error);
    throw error;
  }
};
