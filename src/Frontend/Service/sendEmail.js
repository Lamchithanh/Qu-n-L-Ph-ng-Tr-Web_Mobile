require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully!");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

// Gửi thử email
sendEmail(
  "customer@example.com",
  "Nhắc nợ",
  "Bạn có hóa đơn chưa thanh toán. Vui lòng thanh toán sớm!"
);
