import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  ArrowLeft,
  Send,
  Check,
  AlertCircle,
  Building,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "../../Style/Auth.module.scss";
import image from "../../assets/HeroImage10.jpg";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1); // 1: Email, 2: Mã xác nhận, 3: Mật khẩu mới
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setError("Vui lòng nhập địa chỉ email");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Địa chỉ email không hợp lệ");
      return false;
    }
    return true;
  };

  const validateVerificationCode = () => {
    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      setError("Vui lòng nhập mã xác nhận 6 ký tự");
      return false;
    }
    return true;
  };

  const validateNewPassword = () => {
    if (!formData.newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return false;
    }
    return true;
  };

  const handleRequestVerificationCode = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      // Gọi API gửi mã xác nhận
      const response = await fetch(`${CONFIG.API_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể gửi mã xác nhận");
      }

      showToast("Mã xác nhận đã được gửi đến email của bạn", "success");
      setStep(2);
      setCountdown(60); // Đếm ngược 60 giây
    } catch (err) {
      console.error("Error:", err);
      showToast(err.message, "error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateVerificationCode()) return;

    setLoading(true);
    try {
      // Gọi API xác thực mã
      const response = await fetch(
        `${CONFIG.API_URL}/users/verify-reset-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            code: formData.verificationCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Mã xác nhận không đúng");
      }

      showToast("Mã xác nhận hợp lệ", "success");
      setStep(3);
    } catch (err) {
      console.error("Error:", err);
      showToast(err.message, "error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateNewPassword()) return;

    setLoading(true);
    try {
      // Gọi API đặt lại mật khẩu
      const response = await fetch(`${CONFIG.API_URL}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể đặt lại mật khẩu");
      }

      showToast("Đặt lại mật khẩu thành công", "success");
      navigate("/auth", { replace: true });
    } catch (err) {
      console.error("Error:", err);
      showToast(err.message, "error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${CONFIG.API_URL}/users/resend-reset-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể gửi lại mã xác nhận");
      }

      showToast("Mã xác nhận mới đã được gửi đến email của bạn", "success");
      setCountdown(60);
    } catch (err) {
      console.error("Error:", err);
      showToast(err.message, "error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepOne = () => (
    <>
      <div className={styles.header} data-aos="fade-up" data-aos-delay="200">
        <h1>Quên mật khẩu</h1>
        <p>Nhập email đã đăng ký để nhận mã xác nhận</p>
      </div>

      <div className={styles.form}>
        <div
          className={styles.inputGroup}
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Mail className={styles.inputIcon} size={20} />
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Địa chỉ email *"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {error && (
          <div className={styles.error} data-aos="shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <button
          className={styles.button}
          onClick={handleRequestVerificationCode}
          disabled={loading}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {loading ? "Đang xử lý..." : "Gửi mã xác nhận"}
        </button>

        <div
          className={styles.switchText}
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <button
            className={styles.switchButton}
            onClick={() => navigate("/auth")}
            disabled={loading}
          >
            {/* <ArrowLeft size={16} style={{ marginRight: "4px" }} /> */}
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div className={styles.header} data-aos="fade-up" data-aos-delay="200">
        <h1>Xác nhận</h1>
        <p>Nhập mã xác nhận đã được gửi đến email của bạn</p>
      </div>

      <div className={styles.form}>
        <div
          className={styles.inputGroup}
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Send className={styles.inputIcon} size={20} />
          <input
            className={styles.input}
            type="text"
            name="verificationCode"
            placeholder="Mã xác nhận (6 ký tự) *"
            value={formData.verificationCode}
            onChange={handleChange}
            maxLength={6}
            disabled={loading}
          />
        </div>

        {error && (
          <div className={styles.error} data-aos="shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <button
          className={styles.button}
          onClick={handleVerifyCode}
          disabled={loading}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>

        <div
          className={styles.resendCode}
          data-aos="fade-up"
          data-aos-delay="700"
        >
          <button
            className={`${styles.resendButton} ${
              countdown > 0 ? styles.disabled : ""
            }`}
            onClick={resendVerificationCode}
            disabled={countdown > 0 || loading}
          >
            Gửi lại mã{countdown > 0 ? ` (${countdown}s)` : ""}
          </button>
        </div>

        <div
          className={styles.switchText}
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <button
            className={styles.switchButton}
            onClick={() => setStep(1)}
            disabled={loading}
          >
            <ArrowLeft size={16} style={{ marginRight: "4px" }} />
            Quay lại
          </button>
        </div>
      </div>
    </>
  );

  const renderStepThree = () => (
    <>
      <div className={styles.header} data-aos="fade-up" data-aos-delay="200">
        <h1>Đặt lại mật khẩu</h1>
        <p>Tạo mật khẩu mới cho tài khoản của bạn</p>
      </div>

      <div className={styles.form}>
        <div
          className={styles.inputGroup}
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Lock className={styles.inputIcon} size={20} />
          <input
            className={styles.input}
            type="password"
            name="newPassword"
            placeholder="Mật khẩu mới *"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div
          className={styles.inputGroup}
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <Check className={styles.inputIcon} size={20} />
          <input
            className={styles.input}
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu mới *"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {error && (
          <div className={styles.error} data-aos="shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <button
          className={styles.button}
          onClick={handleResetPassword}
          disabled={loading}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>

        <div
          className={styles.switchText}
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <button
            className={styles.switchButton}
            onClick={() => setStep(2)}
            disabled={loading}
          >
            <ArrowLeft size={16} style={{ marginRight: "4px" }} />
            Quay lại
          </button>
        </div>
      </div>
    </>
  );

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
            {step === 1 && renderStepOne()}
            {step === 2 && renderStepTwo()}
            {step === 3 && renderStepThree()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
