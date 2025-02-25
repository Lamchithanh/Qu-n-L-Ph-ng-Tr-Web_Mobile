// src/Controllers/roomController.js
import { executeQuery } from "../Database/database.js";

export const getAllRooms = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        title, 
        address, 
        price, 
        area, 
        status, 
        facilities, 
        images, 
        rating, 
        review_count
      FROM rooms
      WHERE deleted_at IS NULL
    `;

    const rooms = await executeQuery(query);

    // Format dữ liệu để phù hợp với frontend
    const formattedRooms = rooms.map((room) => ({
      ...room,
      // Cập nhật định dạng giá
      price: room.price
        ? parseFloat(room.price).toLocaleString("vi-VN")
        : "Chưa cập nhật",
      // Phần còn lại giữ nguyên
      images: room.images
        ? typeof room.images === "string"
          ? JSON.parse(room.images)
          : room.images
        : [],
      facilities: room.facilities
        ? typeof room.facilities === "string"
          ? JSON.parse(room.facilities)
          : room.facilities
        : [],
      tags: room.status === "available" ? ["Còn trống"] : [],
      amenities: room.facilities
        ? typeof room.facilities === "string"
          ? JSON.parse(room.facilities)
          : room.facilities
        : [],
    }));

    res.status(200).json({
      success: true,
      data: formattedRooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách phòng",
      error: error.message,
    });
  }
};

export const getRoomsByFilters = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, type, minArea, maxArea, status } =
      req.query;

    // Xây dựng điều kiện truy vấn
    const conditions = ["deleted_at IS NULL"];
    const params = [];

    if (location) {
      conditions.push("address LIKE ?");
      params.push(`%${location}%`);
    }

    if (minPrice && maxPrice) {
      conditions.push("price BETWEEN ? AND ?");
      params.push(parseFloat(minPrice), parseFloat(maxPrice));
    } else if (minPrice) {
      conditions.push("price >= ?");
      params.push(parseFloat(minPrice));
    } else if (maxPrice) {
      conditions.push("price <= ?");
      params.push(parseFloat(maxPrice));
    }

    if (minArea && maxArea) {
      conditions.push("area BETWEEN ? AND ?");
      params.push(parseFloat(minArea), parseFloat(maxArea));
    } else if (minArea) {
      conditions.push("area >= ?");
      params.push(parseFloat(minArea));
    } else if (maxArea) {
      conditions.push("area <= ?");
      params.push(parseFloat(maxArea));
    }

    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }

    const query = `
      SELECT 
        id, 
        title, 
        address, 
        price, 
        area, 
        status, 
        facilities, 
        images, 
        rating, 
        review_count
      FROM rooms
      WHERE ${conditions.join(" AND ")}
    `;

    const rooms = await executeQuery(query, params);

    // Format dữ liệu để phù hợp với frontend
    const formattedRooms = rooms.map((room) => ({
      ...room,
      // Cập nhật định dạng giá
      price: room.price
        ? parseFloat(room.price).toLocaleString("vi-VN")
        : "Chưa cập nhật",
      // Phần còn lại giữ nguyên
      images: room.images
        ? typeof room.images === "string"
          ? JSON.parse(room.images)
          : room.images
        : [],
      facilities: room.facilities
        ? typeof room.facilities === "string"
          ? JSON.parse(room.facilities)
          : room.facilities
        : [],
      tags: room.status === "available" ? ["Còn trống"] : [],
      amenities: room.facilities
        ? typeof room.facilities === "string"
          ? JSON.parse(room.facilities)
          : room.facilities
        : [],
    }));

    res.status(200).json({
      success: true,
      data: formattedRooms,
    });
  } catch (error) {
    console.error("Error filtering rooms:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lọc phòng",
      error: error.message,
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    // Truy vấn thông tin phòng cơ bản - đã loại bỏ discounted_price và tham chiếu đến bảng reviews
    const roomQuery = `
      SELECT 
        r.id, 
        r.title, 
        r.address, 
        r.room_number,
        r.floor,
        r.price as original_price,
        r.price as current_price, 
        r.area, 
        r.status, 
        r.description,
        r.facilities, 
        r.images, 
        r.rating,
        r.review_count,
        (
          SELECT COUNT(*) 
          FROM rooms 
          WHERE status = 'available' AND deleted_at IS NULL
        ) as available_rooms,
        COALESCE(r.current_views, 0) as current_views,
        u.phone as contact_phone,
        u.email as contact_email,
        l.id as landlord_id,
        l.description as landlord_description,
        (
          SELECT COUNT(*) > 0 
          FROM user_favorites uf 
          WHERE uf.room_id = r.id AND uf.user_id = ? AND uf.deleted_at IS NULL
        ) as is_favorite
      FROM rooms r
      LEFT JOIN landlords l ON r.landlord_id = l.id
      LEFT JOIN users u ON l.user_id = u.id
      WHERE r.id = ? AND r.deleted_at IS NULL
    `;

    // Cập nhật lượt xem phòng
    const updateViewsQuery = `
      UPDATE rooms 
      SET current_views = COALESCE(current_views, 0) + 1 
      WHERE id = ?
    `;

    await executeQuery(updateViewsQuery, [id]);

    // Truyền user_id nếu có (từ JWT), nếu không thì truyền 0
    const userId = req.user ? req.user.id : 0;
    const rooms = await executeQuery(roomQuery, [userId, id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng",
      });
    }

    // Truy vấn tiện nghi phòng từ bảng amenities
    const amenitiesQuery = `
      SELECT 
        a.id,
        a.name,
        a.icon
      FROM room_amenity_relations rar
      JOIN amenities a ON rar.amenity_id = a.id
      WHERE rar.room_id = ?
    `;

    const amenitiesList = await executeQuery(amenitiesQuery, [id]);

    // Lấy thông tin từ bảng contracts
    const roomData = rooms[0];

    // Parse JSON fields
    const images = roomData.images
      ? typeof roomData.images === "string"
        ? JSON.parse(roomData.images)
        : roomData.images
      : [];

    const facilities = roomData.facilities
      ? typeof roomData.facilities === "string"
        ? JSON.parse(roomData.facilities)
        : roomData.facilities
      : {};

    // Xử lý các tiện ích cơ bản từ facilities
    const basicAmenities = [];
    if (facilities.fridge)
      basicAmenities.push({ name: "Tủ lạnh", icon: "fridge" });
    if (facilities.air_con)
      basicAmenities.push({ name: "Điều hòa", icon: "air_con" });
    if (facilities.water_heater)
      basicAmenities.push({ name: "Máy nước nóng", icon: "water_heater" });

    // Thêm các tiện ích từ bảng amenities
    const allAmenities = [
      ...basicAmenities,
      ...amenitiesList.map((item) => ({ name: item.name, icon: item.icon })),
    ];

    // Lấy thông tin cơ sở lân cận từ JSON
    const nearbyFacilities = {};
    if (facilities.nearby_facilities) {
      Object.entries(facilities.nearby_facilities).forEach(([key, value]) => {
        nearbyFacilities[key] = {
          name: key,
          distance: value.distance || "Đang cập nhật",
          description: value.description || "",
        };
      });
    }

    // Định dạng dữ liệu phù hợp với component frontend
    if (roomData) {
      // Tính giá khuyến mãi giả lập để phù hợp với giao diện hiển thị
      const originalPrice = parseInt(roomData.original_price || 0);
      const currentPrice = originalPrice * 0.9; // Giả lập giảm giá 10%

      const formattedRoom = {
        id: roomData.id,
        title: roomData.title,
        room_number: roomData.room_number,
        floor: roomData.floor,
        available_rooms: roomData.available_rooms || 0,
        current_views: roomData.current_views || 0,
        is_favorite: roomData.is_favorite || false,
        location: {
          address: roomData.address,
          nearby_facilities: nearbyFacilities,
        },
        details: {
          area: roomData.area,
          description: roomData.description,
          status: roomData.status,
        },
        amenities: allAmenities,
        images: images,
        pricing: {
          original_price: originalPrice,
          current_price: currentPrice,
          promotion: {
            description: `Giảm ${parseInt(
              originalPrice - currentPrice
            ).toLocaleString("vi-VN")}đ khi đặt phòng trong tuần này!`,
          },
        },
        contact: {
          phone: roomData.contact_phone,
          email: roomData.contact_email,
          landlord_id: roomData.landlord_id,
          landlord_description: roomData.landlord_description,
        },
        ratings: {
          average:
            roomData.rating > 0
              ? parseFloat(roomData.rating).toFixed(1)
              : "Chưa có đánh giá",
          total_reviews: roomData.review_count || 0,
          recent_reviews: [], // Tạm thời để trống vì chưa có bảng reviews
        },
      };

      return res.status(200).json({
        success: true,
        data: formattedRoom,
      });
    } else {
      // Định nghĩa formattedRoom cho trường hợp không có roomData
      const formattedRoom = {
        id: null,
        title: "Không có thông tin",
        room_number: "",
        floor: 0,
        available_rooms: 0,
        current_views: 0,
        is_favorite: false,
        location: {
          address: "Không có địa chỉ",
          nearby_facilities: {},
        },
        details: {
          area: 0,
          description: "Không có mô tả",
          status: "unavailable",
        },
        amenities: [],
        images: [],
        pricing: {
          original_price: 0,
          current_price: 0,
          promotion: null,
        },
        contact: {
          phone: "Không có số điện thoại",
          email: "Không có email",
          landlord_id: null,
          landlord_description: "",
        },
        ratings: {
          average: "Chưa có đánh giá",
          total_reviews: 0,
          recent_reviews: [],
        },
      };

      return res.status(200).json({
        success: true,
        data: formattedRoom,
      });
    }
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin phòng",
      error: error.message,
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    return res.status(503).json({
      success: false,
      message: "Tính năng đánh dấu yêu thích tạm thời không khả dụng",
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      success: false,
      message: "Không thể thay đổi trạng thái yêu thích",
      error: error.message,
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const {
      title,
      address,
      room_number,
      floor,
      area,
      price,
      status,
      description,
      facilities,
      images,
    } = req.body;

    const query = `
      INSERT INTO rooms 
      (title, address, room_number, floor, area, price, status, description, facilities, images) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      title,
      address,
      room_number,
      floor,
      area,
      price,
      status,
      description,
      JSON.stringify(facilities),
      JSON.stringify(images),
    ];

    const result = await executeQuery(query, params);

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        ...req.body,
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo phòng mới",
      error: error.message,
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      address,
      room_number,
      floor,
      area,
      price,
      status,
      description,
      facilities,
      images,
    } = req.body;

    const query = `
      UPDATE rooms 
      SET 
        title = ?, 
        address = ?, 
        room_number = ?, 
        floor = ?, 
        area = ?, 
        price = ?, 
        status = ?, 
        description = ?, 
        facilities = ?, 
        images = ?
      WHERE id = ? AND deleted_at IS NULL
    `;

    const params = [
      title,
      address,
      room_number,
      floor,
      area,
      price,
      status,
      description,
      JSON.stringify(facilities),
      JSON.stringify(images),
      id,
    ];

    const result = await executeQuery(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng để cập nhật",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id,
        ...req.body,
      },
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật phòng",
      error: error.message,
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE rooms 
      SET deleted_at = NOW() 
      WHERE id = ? AND deleted_at IS NULL
    `;

    const result = await executeQuery(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng để xóa",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa phòng thành công",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa phòng",
      error: error.message,
    });
  }
};
