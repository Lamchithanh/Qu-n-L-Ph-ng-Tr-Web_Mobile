import React, { useState } from "react";
import { Send, MapPin, Phone, Mail, Clock, User } from "lucide-react";
import styles from "../../Style/ContactPage.module.scss";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic gửi form
    console.log("Form submitted:", formData);
    // Thêm logic gửi form tới backend
  };

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>Liên Hệ Với Chúng Tôi</h1>
          <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className={styles.contactInfoSection}>
        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <MapPin size={40} className={styles.icon} />
            <h3>Địa Chỉ</h3>
            <p>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
          </div>
          <div className={styles.contactCard}>
            <Phone size={40} className={styles.icon} />
            <h3>Điện Thoại</h3>
            <p>0123 456 789</p>
            <p>0987 654 321</p>
          </div>
          <div className={styles.contactCard}>
            <Mail size={40} className={styles.icon} />
            <h3>Email</h3>
            <p>support@phongtro.com</p>
            <p>lienhe@phongtro.com</p>
          </div>
          <div className={styles.contactCard}>
            <Clock size={40} className={styles.icon} />
            <h3>Giờ Làm Việc</h3>
            <p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
            <p>Thứ 7: 9:00 - 12:00</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className={styles.contactFormSection}>
        <div className={styles.formContainer}>
          <div className={styles.formContent}>
            <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
            <p>Chúng tôi rất mong nhận được phản hồi từ bạn</p>

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <User size={20} className={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.inputWrapper}>
                  <Mail size={20} className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Địa chỉ email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <Phone size={20} className={styles.inputIcon} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputWrapper}>
                <textarea
                  name="message"
                  placeholder="Nội dung tin nhắn"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                <Send size={20} />
                <span>Gửi Tin Nhắn</span>
              </button>
            </form>
          </div>

          {/* Map Placeholder */}
          <div className={styles.mapSection}>
            <div className={styles.mapPlaceholder}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 300"
                className={styles.mapSvg}
              >
                <rect width="100%" height="100%" fill="#f0f0f0" />
                <path
                  d="M200 150 L250 100 Q300 50 200 25 Q100 50 150 100 Z"
                  fill="#4299e1"
                  opacity="0.6"
                />
                <circle cx="200" cy="100" r="20" fill="#2c5282" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className={styles.quickLinksSection}>
        <div className={styles.quickLinksContainer}>
          <h2>Các Liên Kết Nhanh</h2>
          <div className={styles.quickLinksGrid}>
            <a href="/faq" className={styles.quickLink}>
              Câu Hỏi Thường Gặp
            </a>
            <a href="/support" className={styles.quickLink}>
              Trung Tâm Hỗ Trợ
            </a>
            <a href="/terms" className={styles.quickLink}>
              Điều Khoản Sử Dụng
            </a>
            <a href="/privacy" className={styles.quickLink}>
              Chính Sách Bảo Mật
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
