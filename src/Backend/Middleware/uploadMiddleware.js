import multer from "multer";
import path from "path";
import fs from "fs";

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(process.cwd(), "uploads/avatar");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `avatar-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Validate file
const fileFilter = (req, file, cb) => {
  // Chấp nhận các định dạng ảnh
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Chỉ được tải lên các file ảnh (JPEG, PNG, GIF, WEBP)"),
      false
    );
  }
};

// Cấu hình upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});

export default upload;
