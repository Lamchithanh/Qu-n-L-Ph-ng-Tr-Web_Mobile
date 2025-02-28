import React from "react";
import { MapPin, Ruler, Star, Home, Shield } from "lucide-react";
import styles from "../../Style/RoomCard.module.scss";
import DefaultRoomImage from "../../assets/home_img.jpg";

const RoomCard = ({ room, onDetailClick }) => {
  const {
    id,
    title = "Phòng chưa có tên",
    address = "Địa chỉ chưa cập nhật",
    price,
    area = "Chưa có",
    images,
    amenities = [],
    rating = 0,
    reviews = 0,
    tags = [],
    status,
  } = room;

  // Xử lý images với nhiều trường hợp
  const getImageUrl = () => {
    try {
      // Nếu images là mảng và có phần tử
      if (Array.isArray(images) && images.length > 0) {
        return images[0];
      }

      // Nếu images là chuỗi JSON
      if (typeof images === "string") {
        // Kiểm tra xem chuỗi có phải là JSON hợp lệ không
        try {
          const parsedImages = JSON.parse(images);
          return parsedImages.length > 0 ? parsedImages[0] : DefaultRoomImage;
        } catch (jsonError) {
          // Nếu không phải JSON, kiểm tra xem có phải là đường dẫn ảnh không
          if (images.startsWith("/") || images.startsWith("http")) {
            return images;
          }
          return DefaultRoomImage;
        }
      }

      // Trường hợp không có ảnh
      return DefaultRoomImage;
    } catch (error) {
      console.error("Error parsing images:", error);
      return DefaultRoomImage;
    }
  };

  const imageUrl = getImageUrl();

  // Format giá
  const formatPrice = (price) => {
    if (!price) return "Giá chưa cập nhật";

    // Nếu giá đã là chuỗi được định dạng
    if (typeof price === "string") {
      // Kiểm tra xem đã có dấu phân cách hàng nghìn chưa
      if (price.includes(".") || price.includes(",")) {
        return `${price} đ/tháng`;
      }

      // Nếu là chuỗi nhưng chưa được định dạng
      return `${parseFloat(price).toLocaleString("vi-VN")} đ/tháng`;
    }

    // Nếu giá là số
    return `${price.toLocaleString("vi-VN")} đ/tháng`;
  };

  // Lấy loại phòng dựa trên diện tích
  const getRoomType = (area) => {
    if (!area || area === "Chưa có") return "Phòng";

    const numArea = parseFloat(area);
    if (isNaN(numArea)) return "Phòng";

    if (numArea < 20) return "Phòng trọ";
    if (numArea < 35) return "Căn hộ mini";
    return "Căn hộ";
  };

  // Màu sắc cho trạng thái
  const getStatusColor = () => {
    switch (status) {
      case "available":
        return {
          bg: "rgba(16, 185, 129, 0.1)",
          text: "#10b981",
          border: "rgba(16, 185, 129, 0.5)",
        };
      case "occupied":
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          text: "#ef4444",
          border: "rgba(239, 68, 68, 0.5)",
        };
      case "maintenance":
        return {
          bg: "rgba(245, 158, 11, 0.1)",
          text: "#f59e0b",
          border: "rgba(245, 158, 11, 0.5)",
        };
      default:
        return {
          bg: "rgba(107, 114, 128, 0.1)",
          text: "#6b7280",
          border: "rgba(107, 114, 128, 0.5)",
        };
    }
  };

  // Xử lý text trạng thái
  const getStatusText = () => {
    switch (status) {
      case "available":
        return "Còn trống";
      case "occupied":
        return "Đã cho thuê";
      case "maintenance":
        return "Đang sửa chữa";
      default:
        return "Không xác định";
    }
  };

  const statusStyle = getStatusColor();
  const statusText = getStatusText();
  const roomType = getRoomType(area);

  return (
    <div className={styles.roomCard}>
      <div className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt={title}
            onError={(e) => {
              e.target.src = DefaultRoomImage;
            }}
          />
          <div className={styles.overlay}>
            <button
              onClick={() => onDetailClick(id)}
              className={styles.viewButton}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
        <div className={styles.tags}>
          <span className={styles.typeTag}>
            <Home size={14} />
            {roomType}
          </span>
          <span
            className={styles.statusTag}
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              borderColor: statusStyle.border,
            }}
          >
            <Shield size={14} />
            {statusText}
          </span>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.priceSection}>
          <div className={styles.price}>{formatPrice(price)}</div>
          {rating > 0 && (
            <div className={styles.rating}>
              <Star size={16} />
              <span>{rating.toFixed(1)}</span>
              {reviews > 0 && (
                <span className={styles.reviews}>({reviews})</span>
              )}
            </div>
          )}
        </div>

        <h3 className={styles.title}>{title}</h3>

        <div className={styles.address}>
          <MapPin size={16} />
          <span>{address}</span>
        </div>

        <div className={styles.details}>
          <div className={styles.area}>
            <Ruler size={16} />
            <span>{area}m²</span>
          </div>

          <div className={styles.amenitiesContainer}>
            {amenities && amenities.length > 0 ? (
              amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className={styles.amenity}>
                  {typeof amenity === "string" ? amenity : "Tiện ích"}
                </span>
              ))
            ) : (
              <span className={styles.noAmenities}>Chưa có tiện ích</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

// Hàm tiện ích để format dữ liệu phòng từ API
export const formatRoomData = (roomData) => {
  // Chuyển đổi facilities (đối tượng) thành amenities (mảng)
  const amenitiesList = [];
  if (roomData.facilities) {
    // Nếu facilities là chuỗi, parse nó thành đối tượng
    let facilities = roomData.facilities;
    if (typeof facilities === "string") {
      try {
        facilities = JSON.parse(facilities);
      } catch (e) {
        facilities = {};
      }
    }

    // Thêm các tiện ích có giá trị true vào mảng amenities
    Object.entries(facilities).forEach(([key, value]) => {
      if (value === true) {
        const amenityName = key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        amenitiesList.push(amenityName);
      }
    });
  }

  return {
    id: roomData.id,
    title: roomData.title || "Phòng chưa có tên",
    address: roomData.address || "Địa chỉ chưa cập nhật",
    price: roomData.price,
    area: roomData.area || "Chưa có",
    images: roomData.images || [],
    amenities: amenitiesList, // Sử dụng danh sách tiện ích đã chuyển đổi
    rating: roomData.rating ? parseFloat(roomData.rating) : 0,
    reviews: roomData.review_count || 0, // Đảm bảo đúng tên trường
    status: roomData.status,
    tags: roomData.tags || [],
  };
};
