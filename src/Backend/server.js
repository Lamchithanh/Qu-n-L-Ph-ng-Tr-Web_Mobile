import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { testConnection } from "./Database/database.js";
import userRoutes from "./Routes/userRoutes.js";
import landlordRoutes from "./Routes/landlordRoutes.js";
import contractRoutes from "./Routes/contractRoutes.js";
import roomRouter from "./Routes/roomRouter.js";
import path from "path";
import fs from "fs";

// Cấu hình môi trường
dotenv.config({ path: ".env" });

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"], // Thêm tất cả origins được phép
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware để log requests (giúp debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(process.cwd(), "uploads/landlord");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use("/api/users", userRoutes);
app.use("/api/landlords", landlordRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/rooms", roomRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Đã xảy ra lỗi!",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint không tồn tại",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);

  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log("Kết nối đến cơ sở dữ liệu thành công!");
    } else {
      console.error("Không thể kết nối đến cơ sở dữ liệu.");
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra kết nối database:", error);
  }
});

export default app;
