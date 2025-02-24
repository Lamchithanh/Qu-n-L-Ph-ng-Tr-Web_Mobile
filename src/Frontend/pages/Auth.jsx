import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  UserPlus,
  Building,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "../../Style/Auth.module.scss";
import image from "../../assets/image-removebg-preview.png";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";

const Auth = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    full_name: "",
    role: "tenant",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
      offset: 50,
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      setError("Số điện thoại không hợp lệ");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const endpoint = isLogin
        ? `${CONFIG.API_URL}/users/login`
        : `${CONFIG.API_URL}/users/register`;

      console.log("Calling endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Đã có lỗi xảy ra");
      }

      if (isLogin) {
        if (data.token) {
          localStorage.setItem("userToken", data.token);
          showToast("Đăng nhập thành công!", "success");
          navigate("/", {
            replace: true,
            state: { from: "login" },
          });
        }
      } else {
        // ... phần đăng ký
      }
    } catch (err) {
      console.error("Error:", err);
      showToast(err.message, "error");
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.authCard}
        data-aos="zoom-in"
        data-aos-duration="800"
      >
        <div className={styles.leftSection}>
          <div
            className={styles.logo}
            data-aos="fade-down"
            data-aos-delay="200"
          >
            <Building size={32} style={{ marginRight: "8px" }} />
            RoomManager
          </div>
          <div className={styles.leftContent}>
            <h2 data-aos="fade-up" data-aos-delay="400">
              Quản lý phòng trọ thông minh
            </h2>
            <p data-aos="fade-up" data-aos-delay="600">
              Giải pháp quản lý hiệu quả cho chủ nhà và người thuê
            </p>
          </div>
          <img
            src={image}
            alt="Room illustration"
            className={styles.illustration}
            data-aos="zoom-in"
            data-aos-delay="800"
          />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.formContainer}>
            <div
              className={styles.header}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h1>
                {isLogin ? "Chào mừng trở lại!" : "Bắt đầu hành trình mới"}
              </h1>
              <p>
                {isLogin
                  ? "Đăng nhập để trải nghiệm những tính năng tuyệt vời"
                  : "Tạo tài khoản để quản lý phòng trọ hiệu quả hơn"}
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div
                className={styles.inputGroup}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <User className={styles.inputIcon} size={20} />
                <input
                  className={styles.input}
                  type="text"
                  name="username"
                  placeholder="Tên đăng nhập *"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div
                className={styles.inputGroup}
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <Mail className={styles.inputIcon} size={20} />
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {!isLogin && (
                <>
                  <div
                    className={styles.inputGroup}
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    <UserPlus className={styles.inputIcon} size={20} />
                    <input
                      className={styles.input}
                      type="text"
                      name="full_name"
                      placeholder="Họ và tên"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div
                    className={styles.inputGroup}
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    <Phone className={styles.inputIcon} size={20} />
                    <input
                      className={styles.input}
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div
                className={styles.inputGroup}
                data-aos="fade-up"
                data-aos-delay="800"
              >
                <Lock className={styles.inputIcon} size={20} />
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="Mật khẩu *"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {!isLogin && (
                <div
                  className={styles.inputGroup}
                  data-aos="fade-up"
                  data-aos-delay="900"
                >
                  <Lock className={styles.inputIcon} size={20} />
                  <input
                    className={styles.input}
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu *"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              )}

              {error && (
                <div className={styles.error} data-aos="shake">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <button
                className={styles.button}
                type="submit"
                data-aos="fade-up"
                data-aos-delay="1000"
              >
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </button>
            </form>

            <div
              className={styles.switchText}
              data-aos="fade-up"
              data-aos-delay="1100"
            >
              {isLogin ? (
                <>
                  <span>Chưa có tài khoản? </span>
                  <button
                    className={styles.switchButton}
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                      setFormData({
                        username: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        phone: "",
                        full_name: "",
                        role: "tenant",
                      });
                    }}
                  >
                    Đăng ký ngay
                  </button>
                  <span className={styles.divider}> hoặc</span>
                  <button
                    className={`${styles.switchButton} ${styles.landlordButton}`}
                    type="button"
                    onClick={() => navigate("/register-landlord")}
                  >
                    Đăng ký làm chủ trọ
                  </button>
                </>
              ) : (
                <>
                  <span>Đã có tài khoản? </span>
                  <button
                    className={styles.switchButton}
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                      setFormData({
                        username: "",
                        email: "",
                        password: "",
                        role: "tenant",
                      });
                    }}
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
