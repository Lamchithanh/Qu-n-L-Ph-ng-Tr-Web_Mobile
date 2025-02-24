import React from "react";
import { MapPin, Ruler, Star } from "lucide-react";
import styles from "../../Style/HomePage.module.scss";
import DefaultRoomImage from "../../assets/home_img.jpg"; // Import ảnh trực tiếp

const RoomCard = ({ room, onDetailClick }) => {
  const {
    id,
    title,
    address,
    price,
    area,
    images,
    amenities,
    rating,
    reviews,
    tags = [],
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
        const parsedImages = JSON.parse(images);
        return parsedImages.length > 0 ? parsedImages[0] : DefaultRoomImage;
      }

      // Trường hợp không có ảnh
      return DefaultRoomImage;
    } catch (error) {
      console.error("Error parsing images:", error);
      return DefaultRoomImage;
    }
  };

  const imageUrl = getImageUrl();

  return (
    <div className={`${styles.roomCard} ${styles.fadeIn}`}>
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
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <h3>{title}</h3>
        <p className={styles.address}>
          <MapPin size={16} />
          {address}
        </p>

        <div className={styles.stats}>
          <span>
            <Ruler size={16} />
            {area}m²
          </span>
          {rating > 0 && (
            <span>
              <Star size={16} />
              {rating} ({reviews})
            </span>
          )}
        </div>

        <div className={styles.amenities}>
          {amenities && amenities.length > 0 ? (
            amenities.map((amenity, index) => (
              <span key={index}>{amenity}</span>
            ))
          ) : (
            <span className="text-gray-500">Chưa có tiện ích</span>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            {price ? `${price} đ/tháng` : "Giá chưa cập nhật"}
          </div>
          <button
            onClick={() => onDetailClick(id)}
            className={styles.detailsButton}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
