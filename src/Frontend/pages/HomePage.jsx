import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Home,
  Building,
  DollarSign,
  Star,
  Ruler,
  Award,
  Users,
  ThumbsUp,
  Shield,
  Clock,
  Phone,
} from "lucide-react";
import styles from "../../Style/HomePage.module.scss";
import AppStore from "../../assets/AppStore_Icon.png";
import GooglePlay from "../../assets/Google_Play.png";
import MobileApp from "../../assets/Mobile_App.jpg";
import RoomCard from "../components/RoomCard";
import roomService from "../Service/roomService.js";
import { useToast } from "../Contexts/ToastContext";
import DefaultRoomImage from "../../assets/home_img.jpg"; // Add this import

const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    type: "",
    minArea: "",
    maxArea: "",
  });

  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedRooms = async () => {
    try {
      const response = await roomService.getRooms();

      if (response.success) {
        const formattedRooms = response.data.map((room) => ({
          id: room.id,
          title: room.title || "Phòng chưa có tên",
          address: room.address || "Địa chỉ chưa cập nhật",
          price: room.price
            ? new Intl.NumberFormat("vi-VN").format(parseFloat(room.price))
            : "Chưa cập nhật",
          area: room.area || "Chưa có",
          images: Array.isArray(room.images)
            ? room.images[0] || DefaultRoomImage
            : typeof room.images === "string"
            ? JSON.parse(room.images)[0] || DefaultRoomImage
            : DefaultRoomImage,
          amenities: Array.isArray(room.facilities)
            ? room.facilities
            : typeof room.facilities === "string"
            ? JSON.parse(room.facilities)
            : [],
          rating: room.rating || 0,
          reviews: room.review_count || 0,
          status: room.status,
          tags: room.status === "available" ? ["Còn trống"] : [],
        }));

        setFeaturedRooms(formattedRooms);
      }
    } catch (err) {
      console.error("Detailed Fetch Error:", {
        message: err.message,
        stack: err.stack,
      });
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedRooms();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const filters = {
        ...searchParams,
        status: "available",
      };
      const response = await roomService.getRoomsByFilters(filters);

      if (response.success) {
        const formattedRooms = response.data.map((room) => ({
          id: room.id,
          title: room.title || "Phòng chưa có tên",
          address: room.address || "Địa chỉ chưa cập nhật",
          price: room.price
            ? new Intl.NumberFormat("vi-VN").format(parseFloat(room.price))
            : "Chưa cập nhật",
          area: room.area || "Chưa có",
          images: Array.isArray(room.images)
            ? room.images[0] || DefaultRoomImage
            : typeof room.images === "string"
            ? JSON.parse(room.images)[0] || DefaultRoomImage
            : DefaultRoomImage,
          amenities: Array.isArray(room.facilities)
            ? room.facilities
            : typeof room.facilities === "string"
            ? JSON.parse(room.facilities)
            : [],
          rating: room.rating || 0,
          reviews: room.review_count || 0,
          status: room.status,
          tags: room.status === "available" ? ["Còn trống"] : [],
        }));

        setFeaturedRooms(formattedRooms);
      }
    } catch (err) {
      setError("Không thể tìm kiếm phòng");
      console.error("Error searching rooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const goToRoomDetail = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Tìm Ngôi Nhà Mơ Ước Của Bạn</h1>
          <p>Khám phá hàng nghìn căn hộ chất lượng cao với mức giá phù hợp</p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchGrid}>
              <div className={styles.inputWrapper}>
                <MapPin size={20} />
                <input
                  type="text"
                  placeholder="Khu vực"
                  value={searchParams.location}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputWrapper}>
                <DollarSign size={20} />
                <select
                  value={searchParams.priceRange}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      priceRange: e.target.value,
                    })
                  }
                >
                  <option value="">Khoảng giá</option>
                  <option value="0-2">Dưới 2 triệu</option>
                  <option value="2-3">2 - 3 triệu</option>
                  <option value="3-5">3 - 5 triệu</option>
                  <option value="5+">Trên 5 triệu</option>
                </select>
              </div>

              <div className={styles.inputWrapper}>
                <Home size={20} />
                <select
                  value={searchParams.type}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, type: e.target.value })
                  }
                >
                  <option value="">Loại nhà</option>
                  <option value="room">Phòng trọ</option>
                  <option value="apartment">Căn hộ mini</option>
                  <option value="house">Nhà nguyên căn</option>
                </select>
              </div>

              <button type="submit" className={styles.searchButton}>
                Tìm Kiếm
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <Home size={40} />
            <h3>1,234+</h3>
            <p>Phòng cho thuê</p>
          </div>
          <div className={styles.statCard}>
            <Users size={40} />
            <h3>856+</h3>
            <p>Khách hàng</p>
          </div>
          <div className={styles.statCard}>
            <Award size={40} />
            <h3>98%</h3>
            <p>Đánh giá tích cực</p>
          </div>
          <div className={styles.statCard}>
            <ThumbsUp size={40} />
            <h3>4.8/5</h3>
            <p>Điểm đánh giá</p>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Danh sách Phòng Trọ</h2>

        {isLoading ? (
          <div className={styles.listingsGrid}>
            {[1, 2, 3].map((skeleton) => (
              <div
                key={skeleton}
                className={`${styles.roomCard} ${styles.fadeIn}`}
              >
                <div className={styles.imageContainer}>
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>
                <div className={styles.content}>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.listingsGrid}>
            {featuredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onDetailClick={goToRoomDetail}
              />
            ))}
          </div>
        )}
      </section>

      <section className={styles.categoriesSection}>
        <div className="container mx-auto px-4">
          <h2 className={styles.sectionTitle}>Khám Phá Theo Danh Mục</h2>
          <div className={styles.categoryGrid}>
            <div className={styles.categoryCard}>
              <Home className="mx-auto mb-4 text-blue-600" size={40} />
              <h3>Phòng Trọ</h3>
              <p>Hơn 500 phòng trọ</p>
            </div>
            <div className={styles.categoryCard}>
              <Building className="mx-auto mb-4 text-blue-600" size={40} />
              <h3>Căn Hộ Mini</h3>
              <p>Hơn 300 căn hộ</p>
            </div>
            <div className={styles.categoryCard}>
              <Home className="mx-auto mb-4 text-blue-600" size={40} />
              <h3>Nhà Nguyên Căn</h3>
              <p>Hơn 200 căn nhà</p>
            </div>
            <div className={styles.categoryCard}>
              <Building className="mx-auto mb-4 text-blue-600" size={40} />
              <h3>Ký Túc Xá</h3>
              <p>Hơn 100 phòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.whyChooseSection}>
        <div className="container mx-auto px-4">
          <h2 className={styles.sectionTitle}>Tại Sao Chọn Chúng Tôi?</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <Shield size={40} />
              <h3>An Toàn & Uy Tín</h3>
              <p>Tất cả phòng trọ đều được xác thực và kiểm duyệt kỹ càng</p>
            </div>
            <div className={styles.featureCard}>
              <Clock size={40} />
              <h3>Tiết Kiệm Thời Gian</h3>
              <p>Tìm kiếm nhanh chóng và đặt phòng dễ dàng</p>
            </div>
            <div className={styles.featureCard}>
              <Phone size={40} />
              <h3>Hỗ Trợ 24/7</h3>
              <p>Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className={styles.appSection}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h2>Tải Ứng Dụng Di Động</h2>
            <p>Tìm phòng trọ dễ dàng hơn với ứng dụng di động của chúng tôi</p>
            <div className={styles.buttons}>
              <button>
                <img src={AppStore} alt="App Store" />
                App Store
              </button>
              <button>
                <img src={GooglePlay} alt="Google Play" />
                Google Play
              </button>
            </div>
          </div>
          <div className={styles.image}>
            <img src={MobileApp} alt="Mobile App" />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Cộng Đồng Thuê Trọ Thông Minh
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Chúng tôi không chỉ là nền tảng tìm kiếm phòng trọ, mà còn là
                cộng đồng hỗ trợ lẫn nhau. Đăng ký để nhận những insights độc
                quyền, mẹo thuê trọ, và cơ hội kết nối với những người cùng
                chung mục tiêu.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-3 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Tin tức và ưu đãi độc quyền
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-3 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Kết nối với cộng đồng người thuê
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-3 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Hướng dẫn và mẹo thuê trọ hữu ích
                </li>
              </ul>
              {/* <form className="flex">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Đăng Ký Ngay
                </button>
              </form> */}
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-50 rounded-lg p-8 transform hover:scale-105 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-32 w-32 mx-auto text-blue-500 mb-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                  Cộng Đồng Thuê Trọ
                </h3>
                <p className="text-center text-gray-600">
                  Hơn 10,000 thành viên đã tin tưởng và kết nối
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
