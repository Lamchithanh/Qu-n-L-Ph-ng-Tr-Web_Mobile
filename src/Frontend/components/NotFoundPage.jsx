import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Hiệu ứng fade-in khi trang load
    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Kích hoạt animation cho các phần tử
    setTimeout(() => {
      setIsAnimated(true);
    }, 500);
  }, []);

  // Hàm xử lý khi nhấn nút quay lại
  const handleGoBack = () => {
    window.history.back();
  };

  // Hàm xử lý khi nhấn nút về trang chủ
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-3xl w-full rounded-lg bg-white shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-2"></div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            <div
              className={`flex-shrink-0 transition-all duration-700 ease-out transform ${
                isAnimated
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="text-9xl font-black bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  404
                </div>
                <div className="absolute -top-6 -right-6 bg-indigo-100 rounded-full p-2 animate-pulse">
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div
              className={`md:ml-12 mt-8 md:mt-0 text-center md:text-left transition-all duration-700 ease-out transform ${
                isAnimated
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Rất tiếc, không tìm thấy trang
              </h1>
              <p className="text-gray-600 mb-6">
                Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời
                không khả dụng.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={handleGoBack}
                  className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-md font-medium transition-all hover:bg-indigo-50 hover:-translate-y-1 hover:shadow-md"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleGoHome}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-md font-medium transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>

          <div
            className={`mt-12 border-t border-gray-200 pt-8 transition-all duration-1000 ease-out transform ${
              isAnimated
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-4">
                Bạn có thể quan tâm
              </h3>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div
                  onClick={() => navigate("/")}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 cursor-pointer transition-all"
                >
                  Trang chủ
                </div>
                <div
                  onClick={() => navigate("/ServicesPage")}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 cursor-pointer transition-all"
                >
                  Dịch vụ
                </div>
                <div
                  onClick={() => navigate("/room")}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 cursor-pointer transition-all"
                >
                  Phòng trọ
                </div>
                <div
                  onClick={() => navigate("/ContactPage")}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 cursor-pointer transition-all"
                >
                  Liên hệ
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} QLPT. Đã đăng ký Bản quyền.
          </div>
          <div className="flex space-x-4">
            <svg
              className="w-5 h-5 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
            </svg>
            <svg
              className="w-5 h-5 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"></path>
            </svg>
            <svg
              className="w-5 h-5 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
