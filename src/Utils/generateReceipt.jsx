import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  subheader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
  },
  notice: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  footer: {
    marginTop: 50,
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
});

const ReceiptDocument = ({ contractId, confirmationCode, amount, method }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>BIÊN NHẬN THANH TOÁN</Text>
      <Text style={styles.subheader}>Central Plaza Apartment</Text>

      <View style={styles.section}>
        <View style={styles.detail}>
          <Text style={styles.label}>Ngày thanh toán:</Text>
          <Text style={styles.value}>
            {new Date().toLocaleDateString("vi-VN")}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Mã hợp đồng:</Text>
          <Text style={styles.value}>{contractId}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Mã xác nhận:</Text>
          <Text style={styles.value}>{confirmationCode}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Số tiền đã thanh toán:</Text>
          <Text style={styles.value}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(amount)}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Phương thức thanh toán:</Text>
          <Text style={styles.value}>{method}</Text>
        </View>
      </View>

      <View style={styles.notice}>
        <Text style={styles.label}>Lưu ý quan trọng:</Text>
        <Text>• Vui lòng giữ biên nhận này để đối chiếu khi nhận phòng</Text>
        <Text>• Mã xác nhận cần được bảo mật và không chia sẻ</Text>
        <Text>• Liên hệ quản lý để được hướng dẫn thêm</Text>
      </View>

      <Text style={styles.footer}>
        Central Plaza - 123 Nguyễn Văn A, Quận 1, TP.HCM Hotline: 0123 456 789
      </Text>
    </Page>
  </Document>
);

export const generateReceipt = async (data) => {
  try {
    // Tạo một URL tạm thời chứa dữ liệu JSON
    const jsonData = JSON.stringify(
      {
        contractId: data.contractId,
        confirmationCode: data.confirmationCode,
        amount: data.amount,
        method: data.method,
        date: new Date().toLocaleDateString("vi-VN"),
      },
      null,
      2
    );

    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `bien-nhan-${data.contractId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Lỗi tạo biên nhận:", error);
    throw error;
  }
};
