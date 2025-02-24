import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  UserPlus,
  Building,
  AlertCircle,
  Home,
  MapPin,
  FileText,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
// import styles from "../../Style/LandlordRegistration.module.scss";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";
import Landlord from "../../assets/key.jpg";

const LandlordRegistration = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    full_name: "",
    role: "landlord_pending", // Role đặc biệt cho chủ trọ đang chờ duyệt
    idCard: "", // CCCD/CMND
    address: "", // Địa chỉ
    businessLicense: null, // Giấy phép kinh doanh (nếu có)
    propertyDocuments: [], // Giấy tờ nhà đất
    description: "", // Mô tả về cơ sở cho thuê
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
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "propertyDocuments" ? Array.from(files) : files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.full_name ||
      !formData.idCard
    ) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    if (!/^\d{10,11}$/.test(formData.phone)) {
      setError("Số điện thoại không hợp lệ");
      return false;
    }

    if (!/^\d{9,12}$/.test(formData.idCard)) {
      setError("Số CCCD/CMND không hợp lệ");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = new FormData();

    // Thêm các trường text
    submitData.append("username", formData.username);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("phone", formData.phone);
    submitData.append("full_name", formData.full_name);
    submitData.append("idCard", formData.idCard);
    submitData.append("address", formData.address);
    submitData.append("description", formData.description);
    submitData.append("role", formData.role);

    // Thêm file
    if (formData.businessLicense) {
      submitData.append("businessLicense", formData.businessLicense);
    }

    if (formData.propertyDocuments && formData.propertyDocuments.length > 0) {
      formData.propertyDocuments.forEach((file, index) => {
        submitData.append(`propertyDocuments`, file);
      });
    }

    try {
      const response = await fetch(
        `${CONFIG.API_URL}/landlords/register-landlord`,
        {
          method: "POST",
          body: submitData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đã có lỗi xảy ra");
      }

      showToast("Đăng ký thành công! Vui lòng chờ admin xác nhận.", "success");
      navigate("/auth", { replace: true });
    } catch (err) {
      console.error("Error:", err);
      showToast(err.message, "error");
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-cyan-500 py-8 px-4">
      <div
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        data-aos="fade-up"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Section */}
          <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 p-8 text-white flex flex-col">
            <div className="flex items-center space-x-2">
              <Building className="w-8 h-8" />
              <span className="text-2xl font-bold">RoomManager</span>
            </div>

            <div className="flex flex-col flex-grow justify-center space-y-6">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold leading-tight">
                  Đăng ký làm chủ trọ
                </h1>
                <p className="text-lg opacity-90">
                  Tham gia cùng chúng tôi để quản lý phòng trọ hiệu quả hơn
                </p>
              </div>

              <div className="flex justify-center items-center mt-8">
                <img
                  src={Landlord}
                  alt="Landlord illustration"
                  className="w-4/5 h-auto object-contain animate-float rounded-lg "
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-8 bg-white overflow-y-auto max-h-[800px]">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Thông tin cá nhân */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Thông tin cá nhân
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="username"
                      placeholder="Tên đăng nhập *"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Họ và tên *"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại *"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="idCard"
                        placeholder="CCCD/CMND *"
                        value={formData.idCard}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="address"
                        placeholder="Địa chỉ *"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin cơ sở cho thuê */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Thông tin cơ sở cho thuê
                </h3>
                <div className="space-y-4">
                  <textarea
                    name="description"
                    placeholder="Mô tả về cơ sở cho thuê của bạn *"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-lg h-32 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        name="businessLicense"
                        onChange={handleChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="businessLicense"
                      />
                      <label
                        htmlFor="businessLicense"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Giấy phép kinh doanh (nếu có)
                        </span>
                      </label>
                    </div>

                    <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        name="propertyDocuments"
                        onChange={handleChange}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="propertyDocuments"
                      />
                      <label
                        htmlFor="propertyDocuments"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Giấy tờ nhà đất *
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mật khẩu */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Mật khẩu *"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu *"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Đăng ký làm chủ trọ
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/auth")}
                  className="w-full text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordRegistration;
