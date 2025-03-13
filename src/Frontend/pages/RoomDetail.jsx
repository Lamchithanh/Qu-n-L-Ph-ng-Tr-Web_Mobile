import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRoom } from "../Hook/useRoom.js";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Square,
  Wifi,
  Heart,
  Share2,
  Flame,
  Eye,
  Train,
  Building,
  Shield,
  Home,
  Users,
  ArrowRight,
  School,
  Coffee,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import styles from "../../Style/RoomDetail.module.scss";
import { useNavigate } from "react-router-dom";

const RoomDetail = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { room, loading, error, toggleFavorite } = useRoom(roomId);
  const [activeImage, setActiveImage] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const roomRatings = room?.ratings ?? {
    average: "Chưa có đánh giá",
    total_reviews: 0,
    recent_reviews: [],
  };

  useEffect(() => {
    console.log("ROOM FULL DATA:", room);
    if (room) {
      console.log("Location:", room.location);
      console.log("Nearby Facilities:", room.location?.nearby_facilities);
    }
  }, [room]);

  // Phần hiển thị thông tin vị trí
  const LocationHighlights = ({ room }) => {
    const [nearbyLocations, setNearbyLocations] = useState([]);

    useEffect(() => {
      // Xử lý dữ liệu nearby_locations khi component được render hoặc dữ liệu thay đổi
      if (room && room.nearby_locations && room.nearby_locations.nearby) {
        if (Array.isArray(room.nearby_locations.nearby)) {
          setNearbyLocations(room.nearby_locations.nearby);
        }
      } else if (room && room.location && room.location.nearby_locations) {
        // Thử từ location.nearby_locations nếu nearby_locations không có sẵn
        const locations = [];
        // Chuyển đổi object thành mảng để hiển thị
        for (const key in room.location.nearby_locations) {
          if (room.location.nearby_locations.hasOwnProperty(key)) {
            const item = room.location.nearby_locations[key];
            locations.push(item.name || item.description);
          }
        }
        setNearbyLocations(locations);
      }
    }, [room]);

    return (
      <div className={styles.locationHighlights}>
        <h2 className={styles.cardTitle}>Vị trí đắc địa</h2>
        <div className={styles.highlights}>
          {room?.location?.address && (
            <div className={styles.highlight}>
              <MapPin size={20} />
              <div>
                <h4>Địa chỉ</h4>
                <p>{room.location.address}</p>
              </div>
            </div>
          )}

          {nearbyLocations.length > 0 ? (
            nearbyLocations.map((location, index) => (
              <div key={`loc-${index}`} className={styles.highlight}>
                <MapPin size={20} />
                <div>
                  <h4>Gần kề</h4>
                  <p>{location}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Không có thông tin về các địa điểm lân cận</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!room) return <div>Không tìm thấy thông tin phòng</div>;

  const handleFavoriteClick = async () => {
    await toggleFavorite();
  };

  const gotobillpayment = () => {
    navigate(`/RentalContract/${roomId}`);
  };

  // Tính số tiền đặt cọc (x2 giá phòng gốc)
  const calculateDeposit = () => {
    if (!room?.pricing?.original_price) return "N/A";
    const deposit = parseInt(room.pricing.original_price) * 2;
    return deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.badges}>
            <span className={styles.hotBadge}>
              <Flame size={14} /> Hot! {room.available_rooms} phòng còn trống
            </span>
            <span className={styles.viewBadge}>
              <Eye size={14} /> {room.current_views} người đang xem
            </span>
          </div>
          <h1 className={styles.title}>{room.title}</h1>
          <div className={styles.locationRating}>
            <div className={styles.item}>
              <MapPin size={16} />
              <span>{room?.location?.address || "Địa chỉ không có sẵn"}</span>
            </div>
            <div className={styles.item}>
              <Star size={16} />
              <span>
                {roomRatings.average} ({roomRatings.total_reviews} đánh giá)
              </span>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={handleFavoriteClick}>
            <Heart size={20} />
          </button>
          <button className={styles.actionBtn}>
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          {room?.images?.length > 0 ? (
            <img src={room.images[activeImage]} alt="Room" />
          ) : (
            <div className={styles.noImage}>Không có hình ảnh</div>
          )}
        </div>
        <div className={styles.thumbnails}>
          {room?.images?.length > 0 &&
            room.images.map((img, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${
                  activeImage === index ? styles.active : ""
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img src={img} alt={`Room ${index + 1}`} />
              </div>
            ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        <div>
          {/* Room Details */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Thông tin chi tiết</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <Square />
                <div className={styles.content}>
                  <p className={styles.label}>Diện tích</p>
                  <p className={styles.value}>
                    {room?.details?.area
                      ? `${room.details.area}m²`
                      : "Không có thông tin"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Amenities */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Tiện nghi</h2>
            <div className={styles.amenitiesGrid}>
              {room?.amenities?.length > 0 ? (
                room.amenities
                  .slice(0, showAllAmenities ? undefined : 6)
                  .map((amenity, index) => (
                    <div key={index} className={styles.amenityItem}>
                      <div className={styles.dot} />
                      <span>{amenity.name}</span>
                    </div>
                  ))
              ) : (
                <p>Phòng chưa cập nhật thông tin tiện nghi</p>
              )}
            </div>
            {room?.amenities?.length > 6 && (
              <button
                className={styles.showMoreBtn}
                onClick={() => setShowAllAmenities(!showAllAmenities)}
              >
                {showAllAmenities ? "Thu gọn" : "Xem thêm tiện nghi"}
              </button>
            )}
          </div>
          {/* Reviews */}
          <div className={`${styles.card} ${styles.reviews}`}>
            <h2 className={styles.cardTitle}>Đánh giá</h2>
            <div className={styles.header}>
              <div className={styles.summary}>
                <p>
                  Đánh giá trung bình:{" "}
                  {room?.ratings?.average ?? "Chưa có đánh giá"}/5
                </p>

                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>{roomRatings.total_reviews} đánh giá</p>
              </div>
            </div>
          </div>
          {/* Recent Reviews */}
          <div className={styles.socialProof}>
            <h3>Đánh giá từ cư dân</h3>
            <div className={styles.reviewList}>
              {roomRatings.recent_reviews &&
              roomRatings.recent_reviews.length > 0 ? (
                roomRatings.recent_reviews.map((review, index) => (
                  <div key={index} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <img
                        src={review.reviewer_avatar}
                        alt={review.reviewer_name}
                      />
                      <div>
                        <h4>{review.reviewer_name}</h4>
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={
                                i < Math.floor(review.rating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p>{review.review}</p>
                  </div>
                ))
              ) : (
                <div className={styles.noReviews}>
                  <p>Chưa có đánh giá nào cho phòng này.</p>
                  <p>Hãy là người đầu tiên đánh giá sau khi thuê!</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Highlights */}
          <LocationHighlights room={room} />
        </div>

        {/* Booking Card */}
        <div className={styles.bookingCard}>
          {room.pricing?.promotion && (
            <div className={styles.promotion}>
              <Clock size={20} />
              <div>
                <h3>Ưu đãi có hạn!</h3>
                <p>{room.pricing.promotion.description}</p>
              </div>
            </div>
          )}

          <div className={styles.priceDisplay}>
            {room.pricing ? (
              <>
                <div className={styles.oldPrice}>
                  {room.pricing.original_price
                    ? parseInt(room.pricing.original_price)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "N/A"}{" "}
                  đ
                </div>
                <p className={styles.price}>
                  {room.pricing.current_price
                    ? parseInt(room.pricing.current_price)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "N/A"}{" "}
                  đ
                </p>
                <span className={styles.saveTag}>
                  Tiết kiệm{" "}
                  {room.pricing.original_price && room.pricing.current_price
                    ? (
                        parseInt(room.pricing.original_price) -
                        parseInt(room.pricing.current_price)
                      )
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "N/A"}{" "}
                  đ
                </span>
              </>
            ) : (
              <p>Giá chưa có sẵn</p>
            )}
          </div>

          <div className={styles.contactInfo}>
            {room?.contact ? (
              <>
                <div className={styles.contactItem}>
                  <Phone size={20} />
                  <span>{room.contact.phone || "Không có số điện thoại"}</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={20} />
                  <span>{room.contact.email || "Không có email"}</span>
                </div>
              </>
            ) : (
              <p>Không có thông tin liên hệ</p>
            )}
          </div>

          <button className={styles.bookButton} onClick={gotobillpayment}>
            <div>
              <strong>Đặt phòng ngay</strong>
              <p>Chỉ cần đặt cọc {calculateDeposit()} đ - Dọn vào ở ngay!</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
