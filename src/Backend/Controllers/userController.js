import { executeQuery } from "../Database/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import passwordResetService from "../Services/passwordResetService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await executeQuery(
      "SELECT id, username, email, avatar, phone, full_name, role, status FROM users WHERE deleted_at IS NULL"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách người dùng" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy thông tin người dùng cơ bản
    const users = await executeQuery(
      `SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.avatar, 
        u.phone, 
        u.full_name, 
        u.role,
        u.cccd,
        u.created_at as member_since
      FROM users u 
      WHERE u.id = ? AND u.deleted_at IS NULL`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const user = users[0];

    // Lấy thông tin tenant
    const tenants = await executeQuery(
      `SELECT 
        id_card_number, 
        permanent_address, 
        emergency_contact 
      FROM tenants 
      WHERE user_id = ?`,
      [userId]
    );

    // Lấy lịch sử thuê phòng
    const rentalHistory = await executeQuery(
      `SELECT 
        r.room_number, 
        c.start_date, 
        c.end_date, 
        r.price as monthly_rent, 
        r.floor, 
        r.area
      FROM contracts c
      JOIN rooms r ON c.room_id = r.id
      WHERE c.tenant_id = (SELECT id FROM tenants WHERE user_id = ?)
      ORDER BY c.start_date DESC`,
      [userId]
    );

    // Lấy các hóa đơn
    const invoices = await executeQuery(
      `SELECT 
        i.id, 
        i.month, 
        i.year, 
        i.total_amount, 
        i.status, 
        i.due_date, 
        p.payment_date
      FROM invoices i
      LEFT JOIN payments p ON i.id = p.invoice_id
      JOIN contracts c ON i.contract_id = c.id
      JOIN tenants t ON c.tenant_id = t.id
      WHERE t.user_id = ?
      ORDER BY i.year DESC, i.month DESC`,
      [userId]
    );

    // Thống kê thanh toán
    const paymentStats = await executeQuery(
      `SELECT 
        COUNT(*) as total_payments,
        SUM(CASE WHEN p.payment_date <= i.due_date THEN 1 ELSE 0 END) as on_time_payments
      FROM invoices i
      JOIN payments p ON i.id = p.invoice_id
      JOIN contracts c ON i.contract_id = c.id
      JOIN tenants t ON c.tenant_id = t.id
      WHERE t.user_id = ?`,
      [userId]
    );

    // Lấy yêu cầu bảo trì
    const maintenanceRequests = await executeQuery(
      `SELECT 
        mr.id, 
        mr.description, 
        mr.status, 
        mr.priority,
        mr.created_at,
        mr.resolved_at,
        mr.image_urls,
        r.room_number,
        r.title as room_title
      FROM maintenance_requests mr
      LEFT JOIN rooms r ON mr.room_id = r.id
      WHERE mr.tenant_id = (SELECT id FROM tenants WHERE user_id = ?)
      ORDER BY mr.created_at DESC
      LIMIT 10`,
      [userId]
    );

    // Lấy thông báo
    const notifications = await executeQuery(
      `SELECT 
    id, 
    type,
    title, 
    content, 
    is_read, 
    severity,
    created_at,
    related_id
  FROM notifications
  WHERE user_id = ?
  ORDER BY created_at DESC
  LIMIT 5`,
      [userId]
    );

    // Tính toán thời gian thuê
    const totalStayMonths =
      rentalHistory.length > 0
        ? calculateTotalStayMonths(
            rentalHistory[0].start_date,
            rentalHistory[0].end_date
          )
        : 0;

    // Tính toán tỷ lệ thanh toán
    const onTimePaymentPercentage = paymentStats[0]
      ? Math.round(
          (paymentStats[0].on_time_payments / paymentStats[0].total_payments) *
            100
        )
      : 0;

    // Tổng hợp dữ liệu
    const profileData = {
      ...user,
      tenant_info: tenants[0] || {},
      rental_history: rentalHistory,
      invoices: invoices,
      maintenance_requests: maintenanceRequests,
      notifications: notifications,
      stats: {
        total_stay_months: totalStayMonths,
        payment_history: {
          total: paymentStats[0]?.total_payments || 0,
          on_time: onTimePaymentPercentage,
          late: 100 - onTimePaymentPercentage,
        },
      },
    };

    res.json(profileData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "Lỗi lấy thông tin hồ sơ",
      error: error.message,
    });
  }
};

// Hàm tính toán tổng số tháng thuê
function calculateTotalStayMonths(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return months;
}

export const createUser = async (req, res) => {
  try {
    const { username, email, password, phone, full_name, cccd, role, avatar } =
      req.body;

    // Kiểm tra username hoặc email đã tồn tại
    const existingUser = await executeQuery(
      "SELECT * FROM users WHERE (username = ? OR email = ?) AND deleted_at IS NULL",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Tên đăng nhập hoặc email đã tồn tại",
      });
    }

    // Kiểm tra CCCD nếu có
    if (cccd) {
      const existingCccd = await executeQuery(
        "SELECT * FROM users WHERE cccd = ? AND deleted_at IS NULL",
        [cccd]
      );

      if (existingCccd.length > 0) {
        return res.status(400).json({
          message: "Số CCCD đã được sử dụng bởi tài khoản khác",
        });
      }
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Thêm người dùng mới với avatar và cccd
    const result = await executeQuery(
      `INSERT INTO users 
        (username, password_hash, email, phone, full_name, cccd, role, avatar) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        passwordHash,
        email,
        phone,
        full_name,
        cccd || null,
        role || "tenant",
        avatar || null,
      ]
    );

    // Tạo tenant mới khi đăng ký tài khoản với vai trò tenant
    if (role === "tenant" || !role) {
      await executeQuery(
        `INSERT INTO tenants (user_id, full_name, id_card_number, phone, status) 
         VALUES (?, ?, ?, ?, true)`,
        [result.insertId, full_name, cccd, phone]
      );
    }

    // Tạo token
    const token = jwt.sign(
      {
        id: result.insertId,
        username,
        role: role || "tenant",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Đăng ký thành công",
      userId: result.insertId,
      token,
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({
      message: "Lỗi đăng ký",
      error: error.message,
    });
  }
};

export const checkUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await executeQuery(
      "SELECT id FROM users WHERE email = ? AND deleted_at IS NULL",
      [email]
    );

    res.json({
      exists: user.length > 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi kiểm tra thông tin người dùng",
      error: error.message,
    });
  }
};

// Đăng ký tài khoản từ thông tin hợp đồng
export const registerFromContract = async (req, res) => {
  try {
    const { username, email, password, phone, full_name } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await executeQuery(
      "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email đã được sử dụng",
        requireLogin: true,
      });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Thêm người dùng mới
    const result = await executeQuery(
      `INSERT INTO users 
        (username, password_hash, email, phone, full_name, role, created_at) 
        VALUES (?, ?, ?, ?, ?, 'tenant', NOW())`,
      [username, passwordHash, email, phone, full_name]
    );

    // Tạo token
    const token = jwt.sign(
      {
        id: result.insertId,
        username,
        role: "tenant",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Đăng ký thành công",
      userId: result.insertId,
      token, // Quan trọng: trả về token
    });

    // Tạo user_profile
    await executeQuery(
      `INSERT INTO user_profiles 
        (user_id, address, identity_number, created_at)
        VALUES (?, NULL, NULL, NOW())`,
      [result.insertId]
    );
  } catch (error) {
    res.status(500).json({
      message: "Lỗi đăng ký",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm người dùng
    const users = await executeQuery(
      "SELECT * FROM users WHERE username = ? AND deleted_at IS NULL AND status = true",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Tên đăng nhập không tồn tại hoặc tài khoản đã bị khóa",
      });
    }

    const user = users[0];

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác" });
    }

    // Tạo token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi đăng nhập",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Lấy ID từ token
    const userId = req.user.id;
    const { phone, full_name, avatar, cccd, address } = req.body;

    console.log("Received update data:", {
      phone,
      full_name,
      avatar,
      cccd,
      address,
    });

    // Tạo một đối tượng để lưu các trường hợp lệ cho bảng users
    const updateFields = {};
    const updateValues = [];

    // Validate và thêm từng trường
    if (phone !== undefined) {
      // Kiểm tra định dạng số điện thoại (10-11 chữ số)
      if (!/^\d{10,11}$/.test(phone)) {
        return res.status(400).json({
          message: "Số điện thoại không hợp lệ. Phải có 10-11 chữ số.",
        });
      }
      updateFields.phone = phone;
      updateValues.push(phone);
    }

    if (full_name !== undefined) {
      // Kiểm tra độ dài tên
      if (full_name.length > 100) {
        return res.status(400).json({
          message: "Tên không được vượt quá 100 ký tự",
        });
      }
      updateFields.full_name = full_name;
      updateValues.push(full_name);
    }

    if (cccd !== undefined) {
      // Kiểm tra định dạng CCCD (9, 12 số)
      if (!/^\d{9}(\d{3})?$/.test(cccd)) {
        return res.status(400).json({
          message: "Số CCCD không hợp lệ. Phải có 9 hoặc 12 chữ số.",
        });
      }

      // Kiểm tra CCCD đã tồn tại chưa
      const existingCccd = await executeQuery(
        "SELECT id FROM users WHERE cccd = ? AND id != ? AND deleted_at IS NULL",
        [cccd, userId]
      );
      console.log("CCCD value received:", cccd);

      if (existingCccd.length > 0) {
        return res.status(400).json({
          message: "Số CCCD đã được sử dụng bởi người dùng khác",
        });
      }

      updateFields.cccd = cccd;
      updateValues.push(cccd);
    }

    if (avatar !== undefined) {
      // Kiểm tra độ dài đường dẫn avatar
      if (avatar.length > 255) {
        return res.status(400).json({
          message: "Đường dẫn avatar quá dài",
        });
      }
      updateFields.avatar = avatar;
      updateValues.push(avatar);
    }

    // Nếu không có trường nào để update trong users và không có address để update
    if (Object.keys(updateFields).length === 0 && address === undefined) {
      return res.status(400).json({
        message: "Không có thông tin nào để cập nhật",
      });
    }

    // Thực hiện các cập nhật trong users table nếu có
    if (Object.keys(updateFields).length > 0) {
      // Tạo câu query động
      const setClause = Object.keys(updateFields)
        .map((field) => `${field} = ?`)
        .join(", ");

      // Thêm userId vào cuối mảng values
      updateValues.push(userId);

      // Thực hiện update
      const result = await executeQuery(
        `UPDATE users 
         SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? AND deleted_at IS NULL`,
        updateValues
      );

      // Kiểm tra xem có bản ghi nào được cập nhật không
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng hoặc người dùng đã bị xóa",
        });
      }

      console.log(`Updated ${result.affectedRows} user records successfully.`);
    }

    // Kiểm tra xem tenant record đã tồn tại chưa
    const tenantExists = await executeQuery(
      "SELECT id FROM tenants WHERE user_id = ?",
      [userId]
    );

    console.log("Tenant exists check:", tenantExists);

    // Xử lý cập nhật thông tin tenant
    let tenantUpdateSuccess = false;

    if (tenantExists.length === 0) {
      // Nếu tenant record chưa tồn tại, tạo mới
      if (
        full_name !== undefined ||
        cccd !== undefined ||
        address !== undefined
      ) {
        const insertFields = [];
        const insertValues = [];

        insertFields.push("user_id");
        insertValues.push(userId);

        if (full_name !== undefined) {
          insertFields.push("full_name");
          insertValues.push(full_name);
        }

        if (cccd !== undefined) {
          insertFields.push("id_card_number");
          insertValues.push(cccd);
        }

        if (address !== undefined) {
          insertFields.push("permanent_address");
          insertValues.push(address);
          console.log("Adding address to new tenant record:", address);
        }

        const insertResult = await executeQuery(
          `INSERT INTO tenants (${insertFields.join(
            ", "
          )}) VALUES (${insertFields.map(() => "?").join(", ")})`,
          insertValues
        );

        console.log("Tenant insert result:", insertResult);
        tenantUpdateSuccess = insertResult.affectedRows > 0;
      }
    } else {
      // Tenant record đã tồn tại, cập nhật
      const tenantUpdateFields = [];
      const tenantUpdateValues = [];

      if (full_name !== undefined) {
        tenantUpdateFields.push("full_name = ?");
        tenantUpdateValues.push(full_name);
      }

      if (cccd !== undefined) {
        tenantUpdateFields.push("id_card_number = ?");
        tenantUpdateValues.push(cccd);
      }

      if (address !== undefined) {
        const updateQuery = `UPDATE tenants 
          SET permanent_address = ?, 
          updated_at = CURRENT_TIMESTAMP 
          WHERE user_id = ?`;

        const updateResult = await executeQuery(updateQuery, [address, userId]);

        console.log("Address update result:", {
          affectedRows: updateResult.affectedRows,
          changedRows: updateResult.changedRows,
          message: updateResult.message,
        });

        // Thêm kiểm tra kết quả update
        if (updateResult.affectedRows === 0) {
          console.warn("Failed to update address. Attempting to insert...");

          // Nếu update không thành công, thử insert mới
          await executeQuery(
            `INSERT INTO tenants (user_id, permanent_address, created_at) 
             VALUES (?, ?, CURRENT_TIMESTAMP)`,
            [userId, address]
          );
        }
      }

      if (tenantUpdateFields.length > 0) {
        // Thêm userId vào cuối mảng values
        tenantUpdateValues.push(userId);

        // Log truy vấn để debug
        console.log(
          "Tenant update query:",
          `UPDATE tenants SET ${tenantUpdateFields.join(
            ", "
          )}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
          tenantUpdateValues
        );

        // Thực hiện update
        const tenantResult = await executeQuery(
          `UPDATE tenants 
           SET ${tenantUpdateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
           WHERE user_id = ?`,
          tenantUpdateValues
        );

        console.log("Tenant update result:", tenantResult);

        // Kiểm tra kết quả cập nhật
        if (tenantResult.affectedRows === 0) {
          console.warn("No tenant records were updated!");
        } else {
          console.log(
            `Updated ${tenantResult.affectedRows} tenant records successfully.`
          );
          tenantUpdateSuccess = true;
        }
      }
    }

    // Kiểm tra trực tiếp sau khi cập nhật
    const verifyUpdate = await executeQuery(
      "SELECT permanent_address FROM tenants WHERE user_id = ?",
      [userId]
    );
    console.log("Verification after update:", verifyUpdate);

    // Lấy thông tin người dùng đầy đủ sau khi cập nhật
    const [updatedUser] = await executeQuery(
      `SELECT u.id, u.username, u.email, u.phone, u.full_name, u.cccd, u.avatar, u.role, t.permanent_address
       FROM users u
       LEFT JOIN tenants t ON u.id = t.user_id
       WHERE u.id = ?`,
      [userId]
    );

    // Log thông tin user đã cập nhật để debug
    console.log("Updated user with address:", updatedUser);

    res.json({
      message: "Cập nhật người dùng thành công",
      user: updatedUser,
      updatedFields: [
        ...Object.keys(updateFields),
        ...(address !== undefined ? ["address"] : []),
      ],
      tenant_update_success: tenantUpdateSuccess,
    });
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    res.status(500).json({
      message: "Lỗi cập nhật người dùng",
      error: error.message,
    });
  }
};

export const updateAvatar = async (req, res, avatarUrl) => {
  try {
    const userId = req.user.id;

    if (!avatarUrl) {
      return res.status(400).json({
        message: "Không có file avatar",
      });
    }

    // Lấy avatar cũ
    const [currentUser] = await executeQuery(
      "SELECT avatar FROM users WHERE id = ? AND deleted_at IS NULL",
      [userId]
    );

    // Cập nhật avatar mới
    await executeQuery(
      "UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL",
      [avatarUrl, userId]
    );

    // Xóa file avatar cũ nếu tồn tại
    if (
      currentUser.avatar &&
      currentUser.avatar.startsWith("/uploads/avatar/")
    ) {
      const oldAvatarPath = path.join(process.cwd(), currentUser.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    res.json({
      message: "Cập nhật avatar thành công",
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error("Lỗi cập nhật avatar:", error);
    res.status(500).json({
      message: "Lỗi cập nhật avatar",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra mật khẩu hiện tại
    const user = await executeQuery(
      "SELECT password_hash FROM users WHERE id = ? AND deleted_at IS NULL",
      [userId]
    );

    const isMatch = await bcrypt.compare(
      currentPassword,
      user[0].password_hash
    );
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Mật khẩu hiện tại không chính xác" });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    await executeQuery(
      "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newPasswordHash, userId]
    );

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi đổi mật khẩu",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await executeQuery(
      "UPDATE users SET deleted_at = CURRENT_TIMESTAMP, status = false WHERE id = ?",
      [id]
    );

    res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi xóa người dùng",
      error: error.message,
    });
  }
};
// Lấy danh sách thông báo
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, severity, is_read } = req.query;

    // Xây dựng điều kiện truy vấn động
    let queryConditions = [`user_id = ?`];
    const queryParams = [userId];

    if (type) {
      queryConditions.push(`type = ?`);
      queryParams.push(type);
    }

    if (severity) {
      queryConditions.push(`severity = ?`);
      queryParams.push(severity);
    }

    if (is_read !== undefined) {
      queryConditions.push(`is_read = ?`);
      queryParams.push(is_read === "true");
    }

    const notifications = await executeQuery(
      `SELECT 
        id, 
        type,
        title, 
        content, 
        is_read,
        related_id,
        severity,
        created_at,
        expires_at
      FROM notifications
      WHERE ${queryConditions.join(" AND ")}
      ORDER BY created_at DESC
      LIMIT 50`,
      queryParams
    );

    // Thống kê
    const stats = await executeQuery(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_read = false THEN 1 ELSE 0 END) as unread,
        SUM(CASE WHEN severity = 'urgent' THEN 1 ELSE 0 END) as urgent
      FROM notifications
      WHERE user_id = ?`,
      [userId]
    );

    res.json({
      notifications,
      stats: stats[0],
    });
  } catch (error) {
    console.error("Lỗi lấy thông báo:", error);
    res.status(500).json({
      message: "Không thể lấy danh sách thông báo",
      error: error.message,
    });
  }
};

// Lấy danh sách yêu cầu bảo trì
export const getMaintenanceRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Kiểm tra xem người dùng có thuê phòng nào không
    const hasActiveContract = await executeQuery(
      `SELECT COUNT(*) as count FROM contracts c
       JOIN tenants t ON c.tenant_id = t.id
       WHERE t.user_id = ? AND c.status = 'active'`,
      [userId]
    );

    // Nếu không có hợp đồng active, trả về thông báo rõ ràng
    if (!hasActiveContract[0] || hasActiveContract[0].count === 0) {
      return res.status(403).json({
        message:
          "Bạn cần có hợp đồng thuê phòng hoạt động để sử dụng tính năng này",
        noActiveContract: true,
      });
    }

    // Lấy tenant_id
    const [tenantInfo] = await executeQuery(
      `SELECT id FROM tenants WHERE user_id = ?`,
      [userId]
    );

    // Xây dựng điều kiện truy vấn động
    let queryConditions = [`tenant_id = ?`];
    const queryParams = [tenantInfo.id];

    if (status) {
      queryConditions.push(`status = ?`);
      queryParams.push(status);
    }

    if (priority) {
      queryConditions.push(`priority = ?`);
      queryParams.push(priority);
    }

    const maintenanceRequests = await executeQuery(
      `SELECT 
        mr.id, 
        mr.description, 
        mr.status,
        mr.priority,
        mr.image_urls,
        mr.created_at,
        mr.resolved_at,
        r.room_number,
        r.title as room_title
      FROM maintenance_requests mr
      LEFT JOIN rooms r ON mr.room_id = r.id
      WHERE ${queryConditions.join(" AND ")}
      ORDER BY mr.created_at DESC
      LIMIT 50`,
      queryParams
    );

    // Thống kê
    const stats = await executeQuery(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM maintenance_requests
      WHERE tenant_id = ?`,
      [tenantInfo.id]
    );

    // Parse JSON images
    const processedRequests = maintenanceRequests.map((request) => ({
      ...request,
      image_urls: request.image_urls ? JSON.parse(request.image_urls) : [],
      // Thêm title từ description nếu không có title
      title:
        request.description.substring(0, 50) +
        (request.description.length > 50 ? "..." : ""),
      category: "other", // Mặc định nếu không có trường category
    }));

    res.json({
      maintenance_requests: processedRequests,
      stats: stats[0],
    });
  } catch (error) {
    console.error("Lỗi lấy yêu cầu bảo trì:", error);
    res.status(500).json({
      message: "Không thể lấy danh sách yêu cầu bảo trì",
      error: error.message,
    });
  }
};

// Tạo yêu cầu bảo trì mới
export const createMaintenanceRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    // Kiểm tra xem người dùng có thuê phòng nào không
    const hasActiveContract = await executeQuery(
      `SELECT c.id, c.room_id, t.id as tenant_id FROM contracts c
       JOIN tenants t ON c.tenant_id = t.id
       WHERE t.user_id = ? AND c.status = 'active'
       LIMIT 1`,
      [userId]
    );

    // Nếu không có hợp đồng active, từ chối yêu cầu
    if (hasActiveContract.length === 0) {
      return res.status(403).json({
        message: "Bạn cần có hợp đồng thuê phòng hoạt động để báo cáo sự cố",
        noActiveContract: true,
      });
    }

    // Sử dụng tenant_id và room_id từ hợp đồng
    const tenantId = hasActiveContract[0].tenant_id;
    const roomId = hasActiveContract[0].room_id;

    // Tiếp tục với code hiện tại, nhưng sử dụng tenantId và roomId
    const { title, description, priority, category } = req.body;
    const images = req.files;

    // Xử lý upload hình ảnh
    const imageUrls = images
      ? images.map((file) => `/uploads/maintenance/${file.filename}`)
      : null;

    // Tạo yêu cầu bảo trì với roomId từ hợp đồng
    const fullDescription = title ? `${title}: ${description}` : description;

    const result = await executeQuery(
      `INSERT INTO maintenance_requests 
        (tenant_id, room_id, description, priority, status, image_urls)
      VALUES (?, ?, ?, ?, 'pending', ?)`,
      [
        tenantId,
        roomId,
        fullDescription,
        priority || "medium",
        imageUrls ? JSON.stringify(imageUrls) : null,
      ]
    );

    // Tạo thông báo
    await executeQuery(
      `INSERT INTO notifications 
        (user_id, type, title, content, severity, related_id)
      VALUES (?, 'maintenance', 'Yêu cầu bảo trì mới', ?, 'medium', ?)`,
      [
        userId,
        `Yêu cầu bảo trì mới: ${fullDescription.substring(0, 50)}...`,
        result.insertId,
      ]
    );

    res.status(201).json({
      message: "Tạo yêu cầu bảo trì thành công",
      maintenance_request_id: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi tạo yêu cầu bảo trì:", error);
    res.status(500).json({
      message: "Không thể tạo yêu cầu bảo trì",
      error: error.message,
    });
  }
};

// Cấu hình mail service (nên đưa vào file config riêng)
const mailTransporter = nodemailer.createTransport({
  service: "gmail", // Hoặc SMTP server riêng
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Lưu trữ tạm thời mã reset (trong dự án thực tế, nên lưu vào database)
const resetCodes = new Map();

/**
 * Gửi email quên mật khẩu
 * @route POST /api/users/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email không được để trống" });
    }

    const result = await passwordResetService.handlePasswordResetRequest(email);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res
      .status(200)
      .json({ message: "Mã xác nhận đã được gửi đến email của bạn" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Lỗi server khi xử lý yêu cầu" });
  }
};

/**
 * Xác thực mã reset mật khẩu
 * @route POST /api/users/verify-reset-code
 * @access Public
 */
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email và mã xác nhận không được để trống" });
    }

    const verification = await passwordResetService.verifyResetCode(
      email,
      code
    );

    if (!verification.valid) {
      return res.status(400).json({ message: verification.message });
    }

    res.status(200).json({
      message: "Mã xác nhận hợp lệ",
      resetId: verification.resetId,
    });
  } catch (error) {
    console.error("Verify reset code error:", error);
    res.status(500).json({ message: "Lỗi server khi xác thực mã" });
  }
};

/**
 * Đặt lại mật khẩu
 * @route POST /api/users/reset-password
 * @access Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Kiểm tra độ mạnh mật khẩu
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    // Xác thực mã
    const verification = await passwordResetService.verifyResetCode(
      email,
      code
    );

    if (!verification.valid) {
      return res
        .status(400)
        .json({ message: verification.message || "Mã xác nhận không hợp lệ" });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    await executeQuery("UPDATE users SET password_hash = ? WHERE id = ?", [
      hashedPassword,
      verification.userId,
    ]);

    // Đánh dấu mã đã sử dụng
    await passwordResetService.markResetCodeAsUsed(verification.resetId);

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Lỗi server khi đặt lại mật khẩu" });
  }
};

/**
 * Gửi lại mã xác nhận
 * @route POST /api/users/resend-reset-code
 * @access Public
 */
export const resendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email không được để trống" });
    }

    const result = await passwordResetService.handlePasswordResetRequest(email);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res
      .status(200)
      .json({ message: "Mã xác nhận mới đã được gửi đến email của bạn" });
  } catch (error) {
    console.error("Resend reset code error:", error);
    res.status(500).json({ message: "Lỗi server khi gửi lại mã" });
  }
};
