import { executeQuery } from "../Database/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";

export const registerLandlord = async (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Received files:", req.files);

  try {
    // Kiểm tra user tồn tại
    const existingUser = await executeQuery(
      "SELECT * FROM users WHERE (username = ? OR email = ?) AND deleted_at IS NULL",
      [req.body.username, req.body.email]
    );

    if (existingUser.length > 0) {
      // Xóa file nếu user đã tồn tại
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          files.forEach((file) => {
            try {
              fs.unlinkSync(file.path);
            } catch (err) {
              console.error("Lỗi xóa file:", err);
            }
          });
        });
      }

      return res.status(400).json({
        message: "Tên đăng nhập hoặc email đã tồn tại",
      });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    // Xử lý upload file
    let businessLicensePath = null;
    let propertyDocumentsPaths = [];

    if (req.files) {
      // Xử lý giấy phép kinh doanh
      if (req.files.businessLicense && req.files.businessLicense[0]) {
        businessLicensePath = `uploads/landlord/${req.files.businessLicense[0].filename}`;
      }

      // Xử lý giấy tờ nhà đất
      if (req.files.propertyDocuments) {
        propertyDocumentsPaths = req.files.propertyDocuments.map(
          (file) => `uploads/landlord/${file.filename}`
        );
      }
    }

    // Thêm người dùng mới
    const userResult = await executeQuery(
      `INSERT INTO users 
        (username, password_hash, email, phone, full_name, role) 
        VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.body.username,
        passwordHash,
        req.body.email,
        req.body.phone,
        req.body.full_name,
        "landlord_pending",
      ]
    );

    const userId = userResult.insertId;

    // Thêm thông tin chủ trọ
    await executeQuery(
      `INSERT INTO landlords 
        (user_id, id_card_number, address, business_license, property_documents, description, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        req.body.idCard,
        req.body.address,
        businessLicensePath,
        JSON.stringify(propertyDocumentsPaths),
        req.body.description,
        "pending",
      ]
    );

    // Tạo token
    const token = jwt.sign(
      {
        id: userId,
        username: req.body.username,
        role: "landlord_pending",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Đăng ký chủ trọ thành công! Vui lòng chờ admin xác nhận.",
      userId,
      token,
    });
  } catch (error) {
    console.error("Lỗi đăng ký chủ trọ:", error);

    // Xóa các file tạm nếu có lỗi
    if (req.files) {
      Object.values(req.files).forEach((files) => {
        files.forEach((file) => {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error("Lỗi xóa file tạm:", unlinkError);
          }
        });
      });
    }

    res.status(500).json({
      message: "Lỗi đăng ký chủ trọ",
      error: error.message,
    });
  }
};

export const approveLandlord = async (req, res) => {
  try {
    const { id } = req.params;

    // Cập nhật trạng thái landlord
    await executeQuery(
      `UPDATE landlords SET status = 'approved' WHERE id = ?`,
      [id]
    );

    // Cập nhật role user
    await executeQuery(
      `UPDATE users SET role = 'landlord' WHERE id = (SELECT user_id FROM landlords WHERE id = ?)`,
      [id]
    );

    res.json({
      message: "Phê duyệt chủ trọ thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi phê duyệt chủ trọ",
      error: error.message,
    });
  }
};

export const rejectLandlord = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin user
    const landlordInfo = await executeQuery(
      `SELECT user_id, business_license, property_documents 
         FROM landlords WHERE id = ?`,
      [id]
    );

    // Xóa file đính kèm
    if (landlordInfo[0]) {
      const businessLicense = landlordInfo[0].business_license;
      const propertyDocuments = JSON.parse(
        landlordInfo[0].property_documents || "[]"
      );

      // Xóa file giấy phép kinh doanh
      if (businessLicense) {
        try {
          fs.unlinkSync(businessLicense);
        } catch (unlinkError) {
          console.error("Lỗi xóa file giấy phép:", unlinkError);
        }
      }

      // Xóa các file giấy tờ nhà đất
      propertyDocuments.forEach((doc) => {
        try {
          fs.unlinkSync(doc);
        } catch (unlinkError) {
          console.error("Lỗi xóa file giấy tờ:", unlinkError);
        }
      });

      // Xóa bản ghi landlord
      await executeQuery(`DELETE FROM landlords WHERE id = ?`, [id]);

      // Xóa user
      await executeQuery(`DELETE FROM users WHERE id = ?`, [
        landlordInfo[0].user_id,
      ]);
    }

    res.json({
      message: "Từ chối đăng ký chủ trọ thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi từ chối đăng ký chủ trọ",
      error: error.message,
    });
  }
};

export const getLandlordRegistrations = async (req, res) => {
  try {
    const registrations = await executeQuery(
      `SELECT l.*, u.username, u.email, u.phone, u.full_name 
       FROM landlords l
       JOIN users u ON l.user_id = u.id
       WHERE l.status = 'pending' AND u.deleted_at IS NULL`
    );

    res.json(registrations);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy danh sách đăng ký chủ trọ",
      error: error.message,
    });
  }
};

export const getLandlordProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const landlordProfile = await executeQuery(
      `SELECT l.*, u.username, u.email, u.phone, u.full_name 
       FROM landlords l
       JOIN users u ON l.user_id = u.id
       WHERE l.user_id = ? AND u.deleted_at IS NULL`,
      [userId]
    );

    if (landlordProfile.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin chủ trọ" });
    }

    res.json(landlordProfile[0]);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy thông tin chủ trọ",
      error: error.message,
    });
  }
};
