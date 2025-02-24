import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Send,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Đăng ký email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-white text-gray-800 py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Thông Tin Liên Hệ */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Home className="w-10 h-10 text-[#4f46e5]" />
            <div>
              <h3 className="text-xl font-bold text-[#4f46e5]">KeyRoom</h3>
              <p className="text-sm text-gray-600">
                Giải pháp quản lý phòng trọ thông minh
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-[#06b6d4]" />
              <span className="text-gray-700">0123 456 789</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-[#06b6d4]" />
              <span className="text-gray-700">support@keyroom.vn</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-[#06b6d4]" />
              <span className="text-gray-700">
                123 Đường Số 1, Quận 1, TP.HCM
              </span>
            </div>
          </div>

          {/* Mạng Xã Hội */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-500 hover:text-[#4f46e5] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-[#4f46e5] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-[#4f46e5] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Liên Kết Nhanh */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 text-[#4f46e5]">
              Dịch Vụ
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/phong-tro", label: "Thuê Phòng" },
                { to: "/quan-ly", label: "Quản Lý Phòng" },
                { to: "/bao-tri", label: "Bảo Trì" },
                { to: "/thanh-toan", label: "Thanh Toán" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-600 hover:text-[#4f46e5] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 text-[#4f46e5]">
              Hỗ Trợ
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/ho-tro", label: "Trung Tâm Hỗ Trợ" },
                { to: "/lien-he", label: "Liên Hệ" },
                { to: "/chinh-sach", label: "Chính Sách" },
                { to: "/cau-hoi", label: "Câu Hỏi Thường Gặp" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-600 hover:text-[#4f46e5] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Đăng Ký Nhận Tin */}
        <div>
          <h4 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 text-[#4f46e5]">
            Nhận Tin Mới
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Đăng ký để nhận thông tin ưu đãi và cập nhật mới nhất
          </p>

          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] text-gray-800"
              />
              <Send
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#06b6d4] cursor-pointer"
                onClick={handleSubscribe}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4f46e5] text-white py-2 rounded-lg hover:bg-[#06b6d4] transition-colors font-semibold"
            >
              Đăng Ký
            </button>
          </form>
        </div>
      </div>

      {/* Phần Dưới Cùng */}
      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} KeyRoom - Giải Pháp Quản Lý Phòng Trọ
          </div>
          <div className="flex space-x-4">
            <Link
              to="/dieu-khoan"
              className="text-sm text-gray-600 hover:text-[#4f46e5]"
            >
              Điều Khoản
            </Link>
            <Link
              to="/chinh-sach-bao-mat"
              className="text-sm text-gray-600 hover:text-[#4f46e5]"
            >
              Chính Sách Bảo Mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
