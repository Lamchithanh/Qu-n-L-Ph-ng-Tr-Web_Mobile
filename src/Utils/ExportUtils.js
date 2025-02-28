import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ExportUtils = {
  /**
   * Tạo file Excel từ dữ liệu chủ trọ
   * @param {Array} data - Dữ liệu chủ trọ
   * @returns {Promise<String>} - Đường dẫn đến file Excel
   */
  async generateExcel(data) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách chủ trọ");

      // Định dạng tiêu đề
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Họ và tên", key: "full_name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Số điện thoại", key: "phone", width: 15 },
        { header: "CMND/CCCD", key: "id_card_number", width: 15 },
        { header: "Giấy phép kinh doanh", key: "business_license", width: 20 },
        { header: "Địa chỉ", key: "address", width: 40 },
        { header: "Trạng thái", key: "status", width: 15 },
        { header: "Số nhà trọ", key: "property_count", width: 10 },
        { header: "Ngày tạo", key: "created_at", width: 20 },
      ];

      // Định dạng header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4F81BD" },
      };
      worksheet.getRow(1).font = { color: { argb: "FFFFFFFF" }, bold: true };

      // Thêm dữ liệu
      data.forEach((item) => {
        const row = {
          id: item.id,
          full_name: item.full_name,
          email: item.email,
          phone: item.phone,
          id_card_number: item.id_card_number,
          business_license: item.business_license || "Không có",
          address: item.address,
          status: this.translateStatus(item.status),
          property_count: item.property_count,
          created_at: new Date(item.created_at).toLocaleString("vi-VN"),
        };
        worksheet.addRow(row);
      });

      // Tạo thư mục temp nếu chưa có
      const tempDir = path.join(__dirname, "../temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Tạo tên file dựa trên thời gian
      const fileName = `landlords_${Date.now()}.xlsx`;
      const filePath = path.join(tempDir, fileName);

      // Lưu file
      await workbook.xlsx.writeFile(filePath);

      return filePath;
    } catch (error) {
      console.error("Lỗi khi tạo file Excel:", error);
      throw error;
    }
  },

  /**
   * Tạo file PDF từ dữ liệu chủ trọ
   * @param {Array} data - Dữ liệu chủ trọ
   * @returns {Promise<String>} - Đường dẫn đến file PDF
   */
  async generatePDF(data) {
    return new Promise((resolve, reject) => {
      try {
        // Tạo thư mục temp nếu chưa có
        const tempDir = path.join(__dirname, "../temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        // Tạo tên file dựa trên thời gian
        const fileName = `landlords_${Date.now()}.pdf`;
        const filePath = path.join(tempDir, fileName);

        // Tạo document PDF
        const doc = new PDFDocument({
          margin: 30,
          size: "A4",
          info: {
            Title: "Danh sách chủ trọ",
            Author: "Hệ thống quản lý nhà trọ",
          },
        });

        // Pipe đến file
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Tiêu đề
        doc.fontSize(18).font("Helvetica-Bold").text("DANH SÁCH CHỦ TRỌ", {
          align: "center",
        });

        doc.moveDown();
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, {
            align: "right",
          });
        doc.moveDown();

        // Bảng header
        const tableTop = 120;
        const colWidths = [25, 85, 80, 70, 70, 70, 70, 60];

        // Header
        const headers = [
          "ID",
          "Họ và tên",
          "Email",
          "SĐT",
          "CMND/CCCD",
          "Trạng thái",
          "Số nhà trọ",
          "Ngày tạo",
        ];

        // Vẽ header table
        doc.fontSize(10).font("Helvetica-Bold");
        let currentX = 30;

        headers.forEach((header, i) => {
          doc.text(header, currentX, tableTop, {
            width: colWidths[i],
            align: "left",
          });
          currentX += colWidths[i];
        });

        // Vẽ line dưới header
        doc
          .moveTo(30, tableTop + 15)
          .lineTo(30 + colWidths.reduce((a, b) => a + b, 0), tableTop + 15)
          .stroke();

        // Dữ liệu
        let yPos = tableTop + 25;

        data.forEach((item, index) => {
          if (yPos > 700) {
            // Kiểm tra nếu sắp hết trang
            doc.addPage();
            yPos = 50;
          }

          // Hiển thị dữ liệu
          doc.fontSize(9).font("Helvetica");
          currentX = 30;

          const rowData = [
            item.id,
            item.full_name,
            item.email,
            item.phone,
            item.id_card_number,
            this.translateStatus(item.status),
            item.property_count,
            new Date(item.created_at).toLocaleDateString("vi-VN"),
          ];

          rowData.forEach((cell, i) => {
            doc.text(cell.toString(), currentX, yPos, {
              width: colWidths[i],
              align: "left",
              lineBreak: false,
              ellipsis: true,
            });
            currentX += colWidths[i];
          });

          // Line giữa các row
          yPos += 20;
          if (index < data.length - 1) {
            doc
              .moveTo(30, yPos - 5)
              .lineTo(30 + colWidths.reduce((a, b) => a + b, 0), yPos - 5)
              .stroke("#CCCCCC");
          }
        });

        // Thêm footer
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);

          // Footer với số trang
          doc
            .fontSize(8)
            .font("Helvetica")
            .text(`Trang ${i + 1}/${pageCount}`, 30, doc.page.height - 50, {
              align: "center",
              width: doc.page.width - 60,
            });
        }

        // Finalize document
        doc.end();

        stream.on("finish", () => {
          resolve(filePath);
        });

        stream.on("error", (error) => {
          reject(error);
        });
      } catch (error) {
        console.error("Lỗi khi tạo file PDF:", error);
        reject(error);
      }
    });
  },

  /**
   * Chuyển đổi trạng thái từ tiếng Anh sang tiếng Việt
   * @param {String} status - Trạng thái
   * @returns {String} - Trạng thái đã dịch
   */
  translateStatus(status) {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  },
};
