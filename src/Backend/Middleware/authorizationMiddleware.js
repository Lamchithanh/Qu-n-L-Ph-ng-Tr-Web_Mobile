// src/Backend/Middleware/authorizationMiddleware.js
export const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    console.log("authorizeRole middleware running");
    console.log("req.user:", req.user);
    console.log("Allowed roles:", allowedRoles);

    if (!req.user) {
      console.log("No req.user found");
      return res.status(401).json({
        message: "Chưa được xác thực",
        error: "Unauthorized",
      });
    }

    console.log("User role:", req.user.role);

    if (!allowedRoles.includes(req.user.role)) {
      console.log("Role not allowed:", req.user.role);
      return res.status(403).json({
        message: "Bạn không có quyền truy cập tính năng này",
        requiredRoles: allowedRoles,
        currentRole: req.user.role,
      });
    }

    console.log("Role authorized, continuing...");
    next();
  };
};

// Middleware kiểm tra quyền sở hữu tài nguyên
export const checkResourceOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      let ownerId;

      switch (resourceType) {
        case "contract":
          const [contract] = await executeQuery(
            "SELECT tenant_id, room_id FROM contracts WHERE id = ?",
            [req.params.id]
          );

          // Kiểm tra xem người dùng có phải là tenant của hợp đồng không
          const [tenant] = await executeQuery(
            "SELECT user_id FROM tenants WHERE id = ?",
            [contract.tenant_id]
          );

          if (
            tenant.user_id === req.user.id ||
            req.user.role === "admin" ||
            req.user.role === "staff"
          ) {
            return next();
          }
          break;

        case "room":
          const [room] = await executeQuery(
            "SELECT landlord_id FROM rooms WHERE id = ?",
            [req.params.id]
          );

          const [landlord] = await executeQuery(
            "SELECT user_id FROM landlords WHERE id = ?",
            [room.landlord_id]
          );

          if (
            landlord.user_id === req.user.id ||
            req.user.role === "admin" ||
            req.user.role === "staff"
          ) {
            return next();
          }
          break;

        default:
          return res.status(400).json({
            message: "Loại tài nguyên không hợp lệ",
          });
      }

      // Nếu không thuộc quyền sở hữu
      return res.status(403).json({
        message: "Bạn không có quyền truy cập tài nguyên này",
      });
    } catch (error) {
      console.error(`Lỗi kiểm tra quyền sở hữu ${resourceType}:`, error);
      res.status(500).json({
        message: "Lỗi kiểm tra quyền truy cập",
        error: error.message,
      });
    }
  };
};

// Middleware kiểm tra trạng thái tài khoản
export const checkAccountStatus = (req, res, next) => {
  // Kiểm tra xem tài khoản có bị khóa không
  if (req.user.status === false) {
    return res.status(403).json({
      message: "Tài khoản của bạn đã bị khóa",
      action: "contact_support",
    });
  }
  next();
};

// Middleware kiểm tra xác minh email
export const checkEmailVerification = (req, res, next) => {
  if (!req.user.email_verified) {
    return res.status(403).json({
      message: "Vui lòng xác minh email trước khi sử dụng tính năng này",
      action: "verify_email",
    });
  }
  next();
};
