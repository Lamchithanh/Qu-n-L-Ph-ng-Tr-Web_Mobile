require("dotenv").config();
const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log("📲 SMS sent successfully!", response.sid);
  } catch (error) {
    console.error("❌ SMS sending failed:", error);
  }
};

// Gửi thử SMS
sendSMS(
  "+84901234567",
  "Bạn có hóa đơn chưa thanh toán. Vui lòng thanh toán sớm!"
);
