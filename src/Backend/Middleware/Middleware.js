// src/Backend/Middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy token xác thực" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token không hợp lệ" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xác thực", error: error.message });
  }
};

// src/Backend/Middleware/authMiddleware.js
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  next();
};

// src/Backend/Middleware/Middleware.js
export const checkLandlordRole = async (req, res, next) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
