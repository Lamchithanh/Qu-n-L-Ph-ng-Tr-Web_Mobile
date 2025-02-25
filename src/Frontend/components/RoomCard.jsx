import React from "react";
import { MapPin, Ruler, Star } from "lucide-react";
import styles from "../../Style/HomePage.module.scss";
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
  // In RoomCard.jsx
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

  // Trong RoomCard.jsx
  // Trong RoomCard.jsx
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

  // Xử lý các tiện ích
  const renderAmenities = () => {
    if (!amenities || amenities.length === 0) {
      return <span className="text-gray-500">Chưa có tiện ích</span>;
    }

    // Giới hạn số lượng tiện ích hiển thị
    const displayedAmenities = amenities.slice(0, 3);
    return displayedAmenities.map((amenity, index) => (
      <span key={index} className="mr-2 text-sm text-gray-600">
        {typeof amenity === "string" ? amenity : "Tiện ích"}
      </span>
    ));
  };

  // Tạo nhãn trạng thái phòng
  const renderStatusTag = () => {
    switch (status) {
      case "available":
        return (
          <div className="absolute top-2 right-2">
            <span className={`${styles.tags}`}>Còn trống</span>
          </div>
        );
      case "occupied":
        return (
          <div className="absolute top-2 right-2">
            <span className={`${styles.tags}`}>Đã cho thuê</span>
          </div>
        );
      case "maintenance":
        return (
          <div className="absolute top-2 right-2">
            <span className={`${styles.tags}`}>Đang sửa chữa</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.roomCard} ${styles.fadeIn} relative`}>
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => {
            e.target.src = DefaultRoomImage;
          }}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
          }}
        />
        {renderStatusTag()}
      </div>

      <div className={styles.content}>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className={`${styles.address} text-gray-600 flex items-center`}>
          <MapPin size={16} className="mr-2" />
          {address}
        </p>

        <div
          className={`${styles.stats} flex justify-between text-sm text-gray-700 my-2`}
        >
          <span className="flex items-center">
            <Ruler size={16} className="mr-2" />
            {area}m²
          </span>
          {rating > 0 && (
            <span className="flex items-center">
              <Star size={16} className="mr-2 text-yellow-500" />
              {rating.toFixed(1)} ({reviews})
            </span>
          )}
        </div>

        <div className={`${styles.amenities} my-2 flex flex-wrap`}>
          {renderAmenities()}
        </div>

        <div className={`${styles.footer} flex justify-between items-center`}>
          <div className={`${styles.price} font-bold text-blue-600`}>
            {formatPrice(price)}
          </div>
          <button
            onClick={() => onDetailClick(id)}
            className={`${styles.detailsButton} bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition`}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
