import { executeQuery } from "../Database/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    const user = await executeQuery(
      "SELECT id, username, email, avatar, phone, full_name, role FROM users WHERE id = ? AND deleted_at IS NULL",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, phone, full_name, role, avatar } =
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

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Thêm người dùng mới với avatar
    const result = await executeQuery(
      `INSERT INTO users 
        (username, password_hash, email, phone, full_name, role, avatar) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        passwordHash,
        email,
        phone,
        full_name,
        role || "tenant",
        avatar || null,
      ]
    );

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

    // Tạo user_profile
    await executeQuery(
      `INSERT INTO user_profiles 
        (user_id, address, identity_number, created_at)
        VALUES (?, NULL, NULL, NOW())`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Đăng ký thành công",
      userId: result.insertId,
      token,
    });
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
    const { id } = req.params;
    const { avatar, email, phone, full_name, role, status } = req.body;

    // Kiểm tra email đã tồn tại chưa (nếu có thay đổi email)
    if (email) {
      const existingUser = await executeQuery(
        "SELECT id FROM users WHERE email = ? AND id != ? AND deleted_at IS NULL",
        [email, id]
      );
      if (existingUser.length > 0) {
        return res.status(400).json({
          message: "Email đã được sử dụng bởi tài khoản khác",
        });
      }
    }

    await executeQuery(
      `UPDATE users 
        SET avatar = ?, email = ?, phone = ?, full_name = ?, role = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND deleted_at IS NULL`,
      [avatar, email, phone, full_name, role, status, id]
    );

    res.json({ message: "Cập nhật người dùng thành công" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi cập nhật người dùng",
      error: error.message,
    });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar } = req.body;

    if (!avatar) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đường dẫn avatar" });
    }

    await executeQuery(
      "UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL",
      [avatar, userId]
    );

    res.json({
      message: "Cập nhật avatar thành công",
      avatar: avatar,
    });
  } catch (error) {
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
