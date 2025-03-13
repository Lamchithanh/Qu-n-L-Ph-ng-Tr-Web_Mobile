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

export const getContractById = async (req, res) => {
  try {
    const contractId = req.params.id;
    const userId = req.user.id;

    // 2. Lấy hợp đồng theo ID
    // Sửa đổi truy vấn
    const [contract] = await executeQuery(
      `SELECT 
    c.id, 
     c.display_code,
    c.start_date, 
    c.end_date, 
    c.status, 
    c.monthly_rent, 
    c.deposit_amount,
    r.id AS room_id,
    r.title AS room_name, 
    r.address AS room_address, 
    r.area, 
    r.images,
    r.room_number,
    l.id AS landlord_id,
    lu.full_name AS landlord_name,
    lu.phone AS landlord_phone,
    lu.email AS landlord_email,
    t.full_name AS tenant_name,
    u.phone AS tenant_phone,
    u.email AS tenant_email,
    t.id_card_number AS tenant_id_card
  FROM contracts c
  LEFT JOIN rooms r ON c.room_id = r.id
  LEFT JOIN tenants t ON c.tenant_id = t.id
  LEFT JOIN users u ON t.user_id = u.id
  LEFT JOIN landlords l ON r.landlord_id = l.id
  LEFT JOIN users lu ON l.user_id = lu.id
  WHERE c.id = ?`,
      [contractId]
    );

    // Nếu không tìm thấy hợp đồng
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hợp đồng",
      });
    }

    // Xử lý hình ảnh phòng
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
      } catch (error) {
        console.error("Lỗi parse hình ảnh:", error);
      }
    }

    // Lấy dịch vụ
    const services = await executeQuery(
      `SELECT 
        s.id, 
        s.name, 
        s.price_unit, 
        s.price,
        su.previous_reading,
        su.current_reading,
        su.usage_amount,
        ROUND(s.price * COALESCE(su.usage_amount, 0), 2) as total_amount
      FROM services s
      LEFT JOIN service_usage su ON s.id = su.service_id 
        AND su.contract_id = ?
        AND su.month = MONTH(CURRENT_DATE())
        AND su.year = YEAR(CURRENT_DATE())
      WHERE s.status = true
      ORDER BY s.name`,
      [contractId]
    );

    // Điều khoản mặc định
    const terms = [
      {
        id: 1,
        title: "1. Điều khoản chung",
        content:
          "Hai bên tự nguyện thỏa thuận và cam kết thực hiện đúng các điều khoản trong hợp đồng thuê phòng này.",
      },
      {
        id: 2,
        title: "2. Thời hạn cho thuê",
        content: `Thời hạn thuê phòng từ ${formatDate(
          contract.start_date
        )} đến ${formatDate(
          contract.end_date
        )}. Hợp đồng có thể gia hạn nếu hai bên đồng ý.`,
      },
    ];

    // Định dạng dữ liệu trả về
    const formattedContract = {
      id:
        contract.display_code || `HD${contract.id.toString().padStart(4, "0")}`,
      status: contract.status,
      startDate: contract.start_date,
      endDate: contract.end_date,
      room: {
        id: contract.room_id,
        name: contract.room_name,
        number: contract.room_number,
        address: contract.room_address,
        area: contract.area ? `${contract.area}m²` : "Chưa cập nhật",
        image: roomImage,
      },
      tenant: {
        name: contract.tenant_name,
        phone: contract.tenant_phone,
        email: contract.tenant_email,
      },
      landlord: {
        id: contract.landlord_id,
        name: contract.landlord_name,
        phone: contract.landlord_phone,
        email: contract.landlord_email,
      },
      payment: {
        rent: parseFloat(contract.monthly_rent || 0),
        deposit: parseFloat(contract.deposit_amount || 0),
        services: services.map((service) => ({
          id: service.id,
          name: service.name,
          price_unit: service.price_unit,
          price: service.price,
          previous_reading: service.previous_reading || 0,
          current_reading: service.current_reading || 0,
          usage_amount: service.usage_amount || 0,
          total_amount: parseFloat(service.total_amount || 0),
        })),
      },
      terms: terms,
      contract_duration: calculateContractDuration(
        contract.start_date,
        contract.end_date
      ),
    };

    res.status(200).json({
      success: true,
      data: formattedContract,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết hợp đồng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lấy chi tiết hợp đồng",
      error: error.message,
    });
  }
};

// Lấy chi tiết hợp đồng
export const getCurrentContract = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Kiểm tra xem user có phải tenant không
    const [tenantInfo] = await executeQuery(
      `SELECT id FROM tenants WHERE user_id = ?`,
      [userId]
    );

    // Nếu không phải tenant, trả về thông báo phù hợp
    if (!tenantInfo) {
      return res.status(404).json({
        success: false,
        message: "Bạn chưa đăng ký là người thuê",
        action: "register_tenant",
      });
    }

    // 2. Lấy hợp đồng hiện tại
    const [contract] = await executeQuery(
      `SELECT 
        c.id, 
        c.start_date, 
        c.end_date, 
        c.status, 
        c.monthly_rent, 
        c.deposit_amount,
        r.id AS room_id,
        r.title AS room_name, 
        r.address AS room_address, 
        r.area, 
        r.images,
        r.room_number,
        l.id AS landlord_id,
        lu.full_name AS landlord_name,
        lu.phone AS landlord_phone,
        lu.email AS landlord_email,
        t.full_name AS tenant_name,
        u.phone AS tenant_phone,
        u.email AS tenant_email,
        t.id_card_number AS tenant_id_card
      FROM contracts c
      JOIN rooms r ON c.room_id = r.id
      JOIN tenants t ON c.tenant_id = t.id
      JOIN users u ON t.user_id = u.id
      JOIN landlords l ON r.landlord_id = l.id
      JOIN users lu ON l.user_id = lu.id
      WHERE c.tenant_id = ? 
      AND c.status IN ('pending', 'active')
      ORDER BY c.created_at DESC
      LIMIT 1`,
      [tenantInfo.id]
    );

    // Nếu chưa có hợp đồng, trả về thông báo
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Bạn chưa có hợp đồng thuê nào",
        action: "find_room",
      });
    }

    // 3. Lấy dịch vụ
    const services = await executeQuery(
      `SELECT 
        s.id, 
        s.name, 
        s.price_unit, 
        s.price,
        su.previous_reading,
        su.current_reading,
        su.usage_amount,
        ROUND(s.price * COALESCE(su.usage_amount, 0), 2) as total_amount
      FROM services s
      LEFT JOIN service_usage su ON s.id = su.service_id 
        AND su.contract_id = ?
        AND su.month = MONTH(CURRENT_DATE())
        AND su.year = YEAR(CURRENT_DATE())
      WHERE s.status = true
      ORDER BY s.name`,
      [contract.id]
    );

    // 4. Xử lý hình ảnh phòng
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
      } catch (error) {
        console.error("Lỗi parse hình ảnh:", error);
      }
    }

    // 5. Điều khoản mặc định
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
        content: `Thời hạn thuê nhà từ ${formatDate(
          contract.start_date
        )} đến ${formatDate(
          contract.end_date
        )}. Có thể gia hạn nếu hai bên đồng ý.`,
      },
    ];

    // 6. Định dạng dữ liệu trả về
    const formattedContract = {
      id: `HD${contract.id.toString().padStart(4, "0")}`,
      status: contract.status,
      startDate: contract.start_date,
      endDate: contract.end_date,
      room: {
        id: contract.room_id,
        name: contract.room_name,
        number: contract.room_number,
        address: contract.room_address,
        area: contract.area ? `${contract.area}m²` : "Chưa cập nhật",
        image: roomImage,
      },
      tenant: {
        id: tenantInfo.tenant_id,
        name: tenantInfo.full_name,
        phone: tenantInfo.phone,
        email: tenantInfo.email,
      },
      landlord: {
        id: contract.landlord_id,
        name: contract.landlord_name,
        phone: contract.landlord_phone,
        email: contract.landlord_email,
      },
      payment: {
        rent: parseFloat(contract.monthly_rent || 0),
        deposit: parseFloat(contract.deposit_amount || 0),
        services: services.map((service) => ({
          id: service.id,
          name: service.name,
          price_unit: service.price_unit,
          price: service.price,
          previous_reading: service.previous_reading || 0,
          current_reading: service.current_reading || 0,
          usage_amount: service.usage_amount || 0,
          total_amount: parseFloat(service.total_amount || 0),
        })),
      },
      terms: terms,
      contract_duration: calculateContractDuration(
        contract.start_date,
        contract.end_date
      ),
    };

    res.status(200).json({
      success: true,
      data: formattedContract,
    });
  } catch (error) {
    console.error("Lỗi khi lấy hợp đồng hiện tại:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lấy hợp đồng",
      error: error.message,
    });
  }
};

// Hàm hỗ trợ tính thời gian hợp đồng
function calculateContractDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const days = end.getDate() - start.getDate();

  return {
    months: months,
    days: days > 0 ? days : 0,
    formatted: `${months} tháng ${days > 0 ? `${days} ngày` : ""}`,
  };
}

// Hàm format ngày
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Trong contractController.js
export const getContractServices = async (req, res) => {
  try {
    const contractId = req.params.id;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const services = await executeQuery(
      `SELECT 
        s.id, 
        s.name, 
        s.price_unit, 
        s.price,
        su.previous_reading,
        su.current_reading,
        su.usage_amount,
        ROUND(s.price * su.usage_amount, 2) as total_amount
      FROM services s
      LEFT JOIN service_usage su ON s.id = su.service_id AND su.contract_id = ? 
        AND su.month = ? AND su.year = ?
      WHERE s.status = true
      ORDER BY s.name`,
      [contractId, currentMonth, currentYear]
    );

    res.json({
      success: true,
      data: services.map((service) => ({
        id: service.id,
        name: service.name,
        price_unit: service.price_unit,
        previous_reading: service.previous_reading || 0,
        current_reading: service.current_reading || 0,
        usage_amount: service.usage_amount || 0,
        total_amount: parseFloat(service.total_amount || 0),
      })),
    });
  } catch (error) {
    console.error("Lỗi khi lấy dịch vụ:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách dịch vụ",
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

// Cập nhật phần createContract để xử lý đăng ký hợp đồng từ người dùng chưa đăng nhập
export const createContract = async (req, res) => {
  try {
    const {
      room_id,
      tenant_info,
      start_date: rawStartDate, // Đổi tên
      end_date: rawEndDate, // Đổi tên
      deposit_amount,
      monthly_rent,
      payment_date = 5,
      terms_conditions,
    } = req.body;

    // Định dạng lại ngày tháng
    let formattedStartDate = rawStartDate;
    if (rawStartDate) {
      const startDate = new Date(rawStartDate);
      formattedStartDate = startDate.toISOString().split("T")[0];
    }

    let formattedEndDate = rawEndDate;
    if (rawEndDate) {
      const endDate = new Date(rawEndDate);
      formattedEndDate = endDate.toISOString().split("T")[0];
    }

    // Kiểm tra các trường bắt buộc
    if (
      !room_id ||
      !tenant_info ||
      !rawStartDate ||
      !rawEndDate ||
      !monthly_rent
    ) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    // Kiểm tra thông tin tenant
    const { name, id_card, phone, email, address } = tenant_info;
    if (!name || !id_card || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin người thuê",
      });
    }

    // Lấy thông tin tenant từ user hiện tại
    const userId = req.user.id;
    let tenantId = null;

    // Kiểm tra xem user đã có thông tin tenant chưa
    const existingTenant = await executeQuery(
      "SELECT id FROM tenants WHERE user_id = ?",
      [userId]
    );

    if (existingTenant.length > 0) {
      // Nếu đã có, cập nhật thông tin
      tenantId = existingTenant[0].id;
      await executeQuery(
        `UPDATE tenants 
         SET full_name = ?, id_card_number = ?, phone = ?, permanent_address = ?
         WHERE id = ?`,
        [name, id_card, phone, address, tenantId]
      );
    } else {
      // Nếu chưa có, tạo mới tenant
      const tenantResult = await executeQuery(
        `INSERT INTO tenants 
          (user_id, full_name, id_card_number, phone, permanent_address, status)
          VALUES (?, ?, ?, ?, ?, true)`,
        [userId, name, id_card, phone, address]
      );
      tenantId = tenantResult.insertId;
    }

    // Cập nhật thông tin user nếu cần
    await executeQuery(
      `UPDATE users 
        SET email = ?, phone = ?, full_name = ?, cccd = ?
        WHERE id = ?`,
      [email, phone, name, id_card, userId]
    );

    // Tạo hợp đồng mới
    const contractResult = await executeQuery(
      `INSERT INTO contracts 
        (room_id, tenant_id, start_date, end_date, deposit_amount, monthly_rent, payment_date, terms_conditions, status, display_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        room_id,
        tenantId,
        formattedStartDate,
        formattedEndDate,
        deposit_amount,
        monthly_rent,
        payment_date,
        terms_conditions || "Các điều khoản cơ bản của hợp đồng thuê phòng trọ",
        `HD${room_id.toString().padStart(4, "0")}`,
      ]
    );

    const contractId = contractResult.insertId;

    // Tạo mã hợp đồng hiển thị dựa trên room_id
    const displayCode = `HD${room_id.toString().padStart(4, "0")}`;

    // Debug log để kiểm tra
    console.log(
      `Cập nhật display_code = ${displayCode} cho contract_id = ${contractId}`
    );

    // Cập nhật display_code trong database - thêm log và xử lý lỗi
    try {
      console.log(
        `Cập nhật display_code = ${displayCode} cho contract_id = ${contractId}`
      );
      const updateResult = await executeQuery(
        `UPDATE contracts SET display_code = ? WHERE id = ?`,
        [displayCode, contractId]
      );
      console.log("Kết quả cập nhật display_code:", updateResult);
    } catch (error) {
      console.error("Lỗi khi cập nhật display_code:", error);
    }

    // Tạo thông báo cho người thuê
    await executeQuery(
      `INSERT INTO notifications 
        (user_id, type, title, content, severity, related_id)
        VALUES (?, 'contract', 'Hợp đồng mới được tạo', ?, 'medium', ?)`,
      [
        userId,
        `Hợp đồng thuê phòng đã được tạo và đang chờ bạn ký kết và đặt cọc.`,
        contractId,
      ]
    );

    // Trả về thông tin hợp đồng
    res.status(201).json({
      success: true,
      message: "Tạo hợp đồng thành công",
      data: {
        contractId: contractId, // ID thực của hợp đồng để xử lý ở backend
        roomId: room_id, // ID phòng để tham chiếu
        displayCode: displayCode, // Mã hiển thị (dựa trên room_id)
        status: "pending",
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

export const createPayment = async (req, res) => {
  try {
    const { contract_id, amount, payment_method } = req.body;
    const userId = req.user.id;

    // 1. Kiểm tra hợp đồng có tồn tại không
    const [contract] = await executeQuery(
      "SELECT * FROM contracts WHERE id = ? AND deleted_at IS NULL",
      [contract_id]
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hợp đồng",
      });
    }

    // 2. Tạo hóa đơn mới
    const invoiceResult = await executeQuery(
      `INSERT INTO invoices 
        (contract_id, month, year, room_fee, total_amount, status) 
        VALUES (?, ?, ?, ?, ?, 'pending')`,
      [
        contract_id,
        new Date().getMonth() + 1,
        new Date().getFullYear(),
        amount,
        amount,
      ]
    );

    const invoiceId = invoiceResult.insertId;

    // 3. Tạo thanh toán
    const transactionId = generateTransactionId(); // Hàm sinh mã giao dịch
    const paymentResult = await executeQuery(
      `INSERT INTO payments 
        (invoice_id, amount, payment_method, payment_date, transaction_id, status) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, true)`,
      [invoiceId, amount, payment_method, transactionId]
    );

    // 4. Cập nhật trạng thái hóa đơn
    await executeQuery(`UPDATE invoices SET status = 'paid' WHERE id = ?`, [
      invoiceId,
    ]);

    // 5. Cập nhật trạng thái hợp đồng (nếu là thanh toán đặt cọc)
    if (contract.status === "active") {
      await executeQuery(
        `UPDATE contracts SET status = 'active' WHERE id = ?`,
        [contract_id]
      );
    }

    // 6. Tạo thông báo
    await executeQuery(
      `INSERT INTO notifications 
        (user_id, type, title, content, related_id) 
        VALUES (?, 'payment', 'Thanh toán thành công', ?, ?)`,
      [
        userId,
        `Bạn đã thanh toán ${formatCurrency(
          amount
        )} cho hợp đồng ${contract_id}`,
        paymentResult.insertId,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Thanh toán thành công",
      data: {
        paymentId: paymentResult.insertId,
        transactionId: transactionId,
        amount: amount,
        method: payment_method,
      },
    });
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xử lý thanh toán",
      error: error.message,
    });
  }
};

// Hàm sinh mã giao dịch
function generateTransactionId() {
  const prefix = "TR";
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${randomPart}`;
}

// Hàm format tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
