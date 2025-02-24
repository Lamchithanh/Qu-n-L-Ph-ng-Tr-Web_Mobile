import React, { useState } from "react";
import {
  Target,
  Globe,
  Award,
  Users,
  Shield,
  CheckCircle,
  Mail,
} from "lucide-react";
import styles from "../../Style/AboutPage.module.scss";

const AboutPage = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter email:", email);
    // Thêm logic đăng ký newsletter
  };

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Về PHONGTRO.COM</h1>
          <p>
            Chúng tôi kết nối không gian sống, mang đến trải nghiệm thuê trọ
            hoàn hảo
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <h2 className={styles.sectionTitle}>Sứ Mệnh Của Chúng Tôi</h2>
        <div className={styles.gridContainer}>
          <div className={styles.cardItem}>
            <Target size={40} />
            <h3>Tầm Nhìn</h3>
            <p>
              Trở thành nền tảng cho thuê phòng trọ tin cậy nhất, kết nối hiệu
              quả giữa người thuê và chủ nhà
            </p>
          </div>
          <div className={styles.cardItem}>
            <Globe size={40} />
            <h3>Sứ Mệnh</h3>
            <p>
              Cung cấp giải pháp thuê trọ thông minh, đơn giản và minh bạch cho
              mọi người
            </p>
          </div>
          <div className={styles.cardItem}>
            <Award size={40} />
            <h3>Giá Trị Cốt Lõi</h3>
            <p>
              Cam kết mang đến trải nghiệm tìm kiếm phòng trọ dễ dàng, an toàn
              và đáng tin cậy
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Đội Ngũ Chuyên Nghiệp</h2>
        <div className={styles.gridContainer}>
          <div className={styles.cardItem}>
            <Users size={40} />
            <h3>Chuyên Gia</h3>
            <p>
              Đội ngũ giàu kinh nghiệm và chuyên môn trong lĩnh vực bất động sản
              và cho thuê
            </p>
          </div>
          <div className={styles.cardItem}>
            <Shield size={40} />
            <h3>An Toàn & Tin Cậy</h3>
            <p>
              Mỗi phòng trọ được kiểm duyệt kỹ lưỡng để đảm bảo chất lượng và độ
              an toàn
            </p>
          </div>
          <div className={styles.cardItem}>
            <CheckCircle size={40} />
            <h3>Hỗ Trợ Tận Tâm</h3>
            <p>
              Luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của khách hàng 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <h2>Đăng Ký Nhận Tin Mới</h2>
          <p>Nhận thông tin mới nhất và ưu đãi độc quyền từ PHONGTRO.COM</p>
          <form onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              Đăng Ký
              {/* <Mail size={20} /> */}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
