import { executeQuery } from "../Database/database.js";

// Lấy danh sách hợp đồng
export const getAllContracts = async (req, res) => {
  try {
    const contracts = await executeQuery(
      `SELECT c.*, r.title as room_name, r.address as room_address, 
       r.images, r.area, t.full_name as tenant_name, u.phone as tenant_phone, u.email as tenant_email,
       l.id as landlord_id, lu.full_name as landlord_name, lu.phone as landlord_phone, lu.email as landlord_email 
       FROM contracts c 
       LEFT JOIN rooms r ON c.room_id = r.id 
       LEFT JOIN tenants t ON c.tenant_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN landlords l ON r.landlord_id = l.id
       LEFT JOIN users lu ON l.user_id = lu.id
       WHERE c.deleted_at IS NULL`,
      []
    );

    // Format lại dữ liệu để phù hợp với giao diện
    const formattedContracts = contracts.map((contract) => {
      // Parse hình ảnh từ JSON
      let roomImage = "https://via.placeholder.com/400x300";
      if (contract.images) {
        try {
          const images =
            typeof contract.images === "string"
              ? JSON.parse(contract.images)
              : contract.images;
          if (images && images.length > 0) {
            roomImage = images[0];
          }
        } catch (e) {
          console.error("Lỗi khi parse images:", e);
        }
      }

      return {
        id: `HD${contract.id.toString().padStart(4, "0")}`,
        status: contract.status || "pending",
        startDate: contract.start_date,
        endDate: contract.end_date,
        room: {
          id: contract.room_id,
          name: contract.room_name || "Phòng không có tên",
          address: contract.room_address || "Không có địa chỉ",
          type: "Phòng trọ",
          area: contract.area ? `${contract.area}m²` : "Chưa cập nhật",
          image: roomImage,
        },
        tenant: {
          id: contract.tenant_id,
          name: contract.tenant_name || "Chưa có người thuê",
          id_card: contract.id_card_number || "Chưa cập nhật",
          phone: contract.tenant_phone || "Chưa cập nhật",
          email: contract.tenant_email || "Chưa cập nhật",
        },
        landlord: {
          id: contract.landlord_id,
          name: contract.landlord_name || "Chưa có chủ trọ",
          id_card: "Thông tin bảo mật",
          phone: contract.landlord_phone || "Chưa cập nhật",
          email: contract.landlord_email || "Chưa cập nhật",
        },
        payment: {
          rent: parseFloat(contract.monthly_rent || 0),
          deposit: parseFloat(contract.deposit_amount || 0),
          services: [
            { name: "Phí điện", amount: "3,500 VNĐ/kWh" },
            { name: "Phí nước", amount: "25,000 VNĐ/m³" },
            { name: "Internet", amount: "200,000 VNĐ/tháng" },
            { name: "Phí dịch vụ", amount: "200,000 VNĐ/tháng" },
          ],
        },
      };
    });

    res.status(200).json({
      success: true,
      data: formattedContracts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hợp đồng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách hợp đồng",
      error: error.message,
    });
  }
};

// Lấy chi tiết hợp đồng
export const getContractById = async (req, res) => {
  try {
    const [contract] = await executeQuery(
      `SELECT c.*, r.title as room_name, r.address as room_address, r.area, 
       r.images, r.description as room_description, r.price,
       t.full_name as tenant_name, t.id_card_number, u.phone as tenant_phone, u.email as tenant_email,
       l.id as landlord_id, l.id_card_number as landlord_id_card, 
       lu.full_name as landlord_name, lu.phone as landlord_phone, lu.email as landlord_email 
       FROM contracts c 
       LEFT JOIN rooms r ON c.room_id = r.id 
       LEFT JOIN tenants t ON c.tenant_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN landlords l ON r.landlord_id = l.id
       LEFT JOIN users lu ON l.user_id = lu.id
       WHERE c.id = ? AND c.deleted_at IS NULL`,
      [req.params.id]
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hợp đồng",
      });
    }

    // Parse hình ảnh từ JSON
    let roomImage = "https://via.placeholder.com/400x300";
    if (contract.images) {
      try {
        const images =
          typeof contract.images === "string"
            ? JSON.parse(contract.images)
            : contract.images;
        if (images && images.length > 0) {
          roomImage = images[0];
        }
      } catch (e) {
        console.error("Lỗi khi parse images:", e);
      }
    }

    // Lấy các điều khoản của hợp đồng
    const terms = [
      {
        id: 1,
        title: "1. Điều khoản chung",
        content:
          "Hai bên tự nguyện thỏa thuận và cam kết thực hiện đúng các điều khoản sau đây...",
      },
      {
        id: 2,
        title: "2. Thời hạn cho thuê",
        content:
          "Thời hạn thuê nhà là 12 tháng kể từ ngày ký hợp đồng. Có thể gia hạn nếu hai bên đồng ý...",
      },
      {
        id: 3,
        title: "3. Giá thuê và thanh toán",
        content:
          "Giá thuê được thanh toán hàng tháng vào ngày 05. Bao gồm tiền thuê và các chi phí phát sinh...",
      },
      {
        id: 4,
        title: "4. Quyền và nghĩa vụ bên thuê",
        content:
          "Bên thuê có trách nhiệm giữ gìn nhà ở và tài sản trong nhà, thanh toán đúng hạn...",
      },
      {
        id: 5,
        title: "5. Quyền và nghĩa vụ bên cho thuê",
        content:
          "Bên cho thuê có trách nhiệm bảo đảm quyền sử dụng nhà ở, bảo trì sửa chữa khi cần...",
      },
    ];

    const formattedContract = {
      id: `HD${contract.id.toString().padStart(4, "0")}`,
      status: contract.status || "pending",
      startDate: contract.start_date,
      endDate: contract.end_date,
      room: {
        id: contract.room_id,
        name: contract.room_name || "Phòng không có tên",
        address: contract.room_address || "Không có địa chỉ",
        type: "Phòng trọ",
        area: contract.area ? `${contract.area}m²` : "Chưa cập nhật",
        image: roomImage,
        description: contract.room_description || "Không có mô tả",
      },
      tenant: {
        id: contract.tenant_id,
        name: contract.tenant_name || "Chưa có người thuê",
        id_card: contract.id_card_number || "Chưa cập nhật", // Sửa thành id_card
        phone: contract.tenant_phone || "Chưa cập nhật",
        email: contract.tenant_email || "Chưa cập nhật",
      },
      landlord: {
        id: contract.landlord_id,
        name: contract.landlord_name || "Chưa có chủ trọ",
        id_card: contract.landlord_id_card || "Thông tin bảo mật", // Sửa thành id_card
        phone: contract.landlord_phone || "Chưa cập nhật",
        email: contract.landlord_email || "Chưa cập nhật",
      },
      payment: {
        rent: parseFloat(contract.monthly_rent || 0),
        deposit: parseFloat(contract.deposit_amount || 0),
        services: [
          { name: "Phí điện", amount: "3,500 VNĐ/kWh" },
          { name: "Phí nước", amount: "25,000 VNĐ/m³" },
          { name: "Internet", amount: "200,000 VNĐ/tháng" },
          { name: "Phí dịch vụ", amount: "200,000 VNĐ/tháng" },
        ],
      },
      terms: terms,
      created_at: contract.created_at,
      updated_at: contract.updated_at,
    };

    res.status(200).json({
      success: true,
      data: formattedContract,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết hợp đồng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết hợp đồng",
      error: error.message,
    });
  }
};

// Lấy chi tiết dịch vụ cho hợp đồng
export const getContractServiceUsages = async (req, res) => {
  try {
    const contractId = req.params.id;
    const currentMonth = new Date().getMonth() + 1; // getMonth() trả về 0-11
    const currentYear = new Date().getFullYear();

    const serviceUsages = await executeQuery(
      `SELECT 
        s.id, 
        s.name, 
        s.price_unit,
        su.previous_reading,
        su.current_reading,
        su.usage_amount,
        ROUND(s.price * su.usage_amount, 2) as total_amount
      FROM 
        service_usage su
      JOIN 
        services s ON su.service_id = s.id
      WHERE 
        su.contract_id = ? 
        AND su.month = ?
        AND su.year = ?`,
      [contractId, currentMonth, currentYear]
    );

    // Nếu không có dữ liệu cho tháng hiện tại, lấy dữ liệu từ tháng gần nhất
    if (serviceUsages.length === 0) {
      const latestServiceUsages = await executeQuery(
        `SELECT 
  s.id, 
  s.name, 
  s.price_unit,
  su.previous_reading,
  su.current_reading,
  su.usage_amount,
  ROUND(s.price * su.usage_amount, 2) as total_amount
FROM 
  service_usage su
JOIN 
  services s ON su.service_id = s.id
WHERE 
  su.contract_id = ?
ORDER BY 
  su.year DESC, su.month DESC
LIMIT 12`,
        [contractId]
      );

      return res.status(200).json({
        success: true,
        message:
          "Không có dữ liệu dịch vụ cho tháng hiện tại. Sử dụng dữ liệu mới nhất.",
        data: latestServiceUsages,
      });
    }

    res.status(200).json({
      success: true,
      data: serviceUsages,
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy dữ liệu dịch vụ",
      error: error.message,
    });
  }
};

// Tạo hợp đồng mới
export const createContract = async (req, res) => {
  try {
    const {
      room_id,
      tenant_id,
      start_date,
      end_date,
      deposit_amount,
      monthly_rent,
      payment_date,
      terms_conditions,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!room_id || !tenant_id || !start_date || !end_date || !monthly_rent) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const result = await executeQuery(
      `INSERT INTO contracts (room_id, tenant_id, start_date, end_date, deposit_amount, monthly_rent, payment_date, terms_conditions, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        room_id,
        tenant_id,
        start_date,
        end_date,
        deposit_amount,
        monthly_rent,
        payment_date || 5, // Mặc định là ngày 5 hàng tháng
        terms_conditions || "Các điều khoản cơ bản của hợp đồng thuê phòng trọ",
      ]
    );

    // Cập nhật trạng thái phòng thành 'occupied'
    await executeQuery("UPDATE rooms SET status = 'occupied' WHERE id = ?", [
      room_id,
    ]);

    res.status(201).json({
      success: true,
      message: "Tạo hợp đồng thành công",
      data: {
        contractId: result.insertId,
        status: "active",
      },
    });
  } catch (error) {
    console.error("Lỗi khi tạo hợp đồng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo hợp đồng",
      error: error.message,
    });
  }
};

// Cập nhật hợp đồng
export const updateContract = async (req, res) => {
  try {
    const {
      room_id,
      tenant_id,
      start_date,
      end_date,
      deposit_amount,
      monthly_rent,
      payment_date,
      terms_conditions,
      status,
    } = req.body;

    // Kiểm tra hợp đồng có tồn tại không
    const [existingContract] = await executeQuery(
      "SELECT * FROM contracts WHERE id = ? AND deleted_at IS NULL",
      [req.params.id]
    );

    if (!existingContract) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hợp đồng",
      });
    }

    // Cập nhật hợp đồng
    const result = await executeQuery(
      `UPDATE contracts SET 
        room_id = COALESCE(?, room_id), 
        tenant_id = COALESCE(?, tenant_id), 
        start_date = COALESCE(?, start_date), 
        end_date = COALESCE(?, end_date), 
        deposit_amount = COALESCE(?, deposit_amount), 
        monthly_rent = COALESCE(?, monthly_rent), 
        payment_date = COALESCE(?, payment_date), 
        terms_conditions = COALESCE(?, terms_conditions), 
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND deleted_at IS NULL`,
      [
        room_id,
        tenant_id,
        start_date,
        end_date,
        deposit_amount,
        monthly_rent,
        payment_date,
        terms_conditions,
        status,
        req.params.id,
      ]
    );

    // Nếu thay đổi phòng hoặc trạng thái hợp đồng, cập nhật trạng thái các phòng tương ứng
    if (room_id && room_id !== existingContract.room_id) {
      // Khôi phục trạng thái phòng cũ
      await executeQuery("UPDATE rooms SET status = 'available' WHERE id = ?", [
        existingContract.room_id,
      ]);

      // Cập nhật trạng thái phòng mới
      await executeQuery("UPDATE rooms SET status = 'occupied' WHERE id = ?", [
        room_id,
      ]);
    }

    // Nếu hợp đồng kết thúc, cập nhật phòng thành available
    if (status && (status === "terminated" || status === "expired")) {
      await executeQuery("UPDATE rooms SET status = 'available' WHERE id = ?", [
        existingContract.room_id,
      ]);
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật hợp đồng thành công",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật hợp đồng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật hợp đồng",
      error: error.message,
    });
  }
};

// Xóa mềm hợp đồng
export const deleteContract = async (req, res) => {
  try {
    // Lấy thông tin hợp đồng trước khi xóa
    const [contract] = await executeQuery(
      "SELECT room_id FROM contracts WHERE id = ? AND deleted_at IS NULL",
      [req.params.id]
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hợp đồng",
      });
    }

    // Xóa mềm hợp đồng
    const result = await executeQuery(
      "UPDATE contracts SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL",
      [req.params.id]
    );

    // Cập nhật trạng thái phòng thành 'available'
    await executeQuery("UPDATE rooms SET status = 'available' WHERE id = ?", [
      contract.room_id,
    ]);

    res.status(200).json({
      success: true,
      message: "Xóa hợp đồng thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa hợp đồng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa hợp đồng",
      error: error.message,
    });
  }
};

// Kết thúc hợp đồng
export const terminateContract = async (req, res) => {
  try {
    const { termination_reason } = req.body;

    // Lấy thông tin hợp đồng
    const [contract] = await executeQuery(
      "SELECT room_id FROM contracts WHERE id = ? AND deleted_at IS NULL",
      [req.params.id]
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hợp đồng",
      });
    }

    // Cập nhật trạng thái hợp đồng
    const result = await executeQuery(
      `UPDATE contracts SET 
        status = 'terminated', 
        termination_reason = ?, 
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND deleted_at IS NULL`,
      [termination_reason || "Kết thúc hợp đồng theo yêu cầu", req.params.id]
    );

    // Cập nhật trạng thái phòng thành 'available'
    await executeQuery("UPDATE rooms SET status = 'available' WHERE id = ?", [
      contract.room_id,
    ]);

    res.status(200).json({
      success: true,
      message: "Kết thúc hợp đồng thành công",
    });
  } catch (error) {
    console.error("Lỗi khi kết thúc hợp đồng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi kết thúc hợp đồng",
      error: error.message,
    });
  }
};

// Ký hợp đồng
export const signContract = async (req, res) => {
  try {
    // Kiểm tra hợp đồng có tồn tại không
    const [contract] = await executeQuery(
      "SELECT * FROM contracts WHERE id = ? AND deleted_at IS NULL",
      [req.params.id]
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hợp đồng",
      });
    }

    // Cập nhật trạng thái hợp đồng thành "active"
    await executeQuery(
      "UPDATE contracts SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [req.params.id]
    );

    // Cập nhật trạng thái phòng thành "occupied"
    await executeQuery("UPDATE rooms SET status = 'occupied' WHERE id = ?", [
      contract.room_id,
    ]);

    res.status(200).json({
      success: true,
      message: "Ký hợp đồng thành công",
      data: {
        contractId: contract.id,
        status: "active",
        deposit_amount: contract.deposit_amount,
      },
    });
  } catch (error) {
    console.error("Lỗi khi ký hợp đồng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi ký hợp đồng",
      error: error.message,
    });
  }
};

// Cập nhật thông tin tenant trong hợp đồng
export const updateTenantInfo = async (req, res) => {
  try {
    const { name, id, phone, email } = req.body;

    // Kiểm tra hợp đồng có tồn tại không
    const [contract] = await executeQuery(
      "SELECT tenant_id FROM contracts WHERE id = ? AND deleted_at IS NULL",
      [req.params.id]
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hợp đồng",
      });
    }

    // Lấy thông tin user_id của tenant
    const [tenant] = await executeQuery(
      "SELECT user_id FROM tenants WHERE id = ?",
      [contract.tenant_id]
    );

    if (!tenant || !tenant.user_id) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người thuê",
      });
    }

    // Cập nhật thông tin trong bảng tenants
    await executeQuery(
      "UPDATE tenants SET full_name = ?, id_card_number = ? WHERE id = ?",
      [name, id, contract.tenant_id]
    );

    // Cập nhật thông tin trong bảng users
    await executeQuery(
      "UPDATE users SET full_name = ?, phone = ?, email = ? WHERE id = ?",
      [name, phone, email, tenant.user_id]
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin người thuê thành công",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người thuê:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật thông tin người thuê",
      error: error.message,
    });
  }
};
