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
      price: new Intl.NumberFormat("vi-VN").format(room.price),
      images: room.images
        ? typeof room.images === "string"
          ? JSON.parse(room.images)
          : room.images
        : null,
      facilities: room.facilities
        ? typeof room.facilities === "string"
          ? JSON.parse(room.facilities)
          : room.facilities
        : [],
      tags: room.status === "available" ? ["Còn trống"] : [],
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
      price: new Intl.NumberFormat("vi-VN").format(room.price),
      images: room.images
        ? typeof room.images === "string"
          ? JSON.parse(room.images)
          : room.images
        : null,
      facilities: room.facilities
        ? typeof room.facilities === "string"
          ? JSON.parse(room.facilities)
          : room.facilities
        : [],
      tags: room.status === "available" ? ["Còn trống"] : [],
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

    const query = `
      SELECT 
        id, 
        title, 
        address, 
        price, 
        area, 
        status, 
        description,
        facilities, 
        images, 
        rating, 
        review_count
      FROM rooms
      WHERE id = ? AND deleted_at IS NULL
    `;

    const rooms = await executeQuery(query, [id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng",
      });
    }

    const room = rooms[0];

    // Format dữ liệu để phù hợp với frontend
    const formattedRooms = rooms.map((room) => ({
      ...room,
      price: new Intl.NumberFormat("vi-VN").format(room.price),
      images: room.images
        ? typeof room.images === "string"
          ? JSON.parse(room.images)
          : room.images
        : null,
      facilities: room.facilities
        ? typeof room.facilities === "string"
          ? JSON.parse(room.facilities)
          : room.facilities
        : [],
      tags: room.status === "available" ? ["Còn trống"] : [],
    }));

    res.status(200).json({
      success: true,
      data: formattedRoom,
    });
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin phòng",
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
