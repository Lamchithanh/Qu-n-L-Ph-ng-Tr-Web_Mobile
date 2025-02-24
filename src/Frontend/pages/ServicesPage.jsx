import React, { useState } from "react";
import {
  Wifi,
  Car,
  Shield,
  Zap,
  Trash2,
  Plus,
  CheckCircle,
  Clock,
  Brush,
} from "lucide-react";

const ServicesPage = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const services = [
    {
      id: 1,
      name: "Internet Tốc Độ Cao",
      description:
        "Kết nối internet tốc độ cao lên đến 100Mbps, phù hợp làm việc và giải trí",
      price: 200000,
      icon: Wifi,
      period: "Tháng",
      features: [
        "Tốc độ download 100Mbps",
        "Tốc độ upload 50Mbps",
        "Không giới hạn dung lượng",
        "Hỗ trợ kỹ thuật 24/7",
      ],
    },
    {
      id: 2,
      name: "Bãi Đỗ Xe Máy",
      description:
        "Bãi đỗ xe có mái che, camera an ninh 24/7 và thẻ ra vào riêng",
      price: 150000,
      icon: Car,
      period: "Tháng",
      features: [
        "Có mái che",
        "Camera an ninh 24/7",
        "Thẻ ra vào riêng",
        "Bảo hiểm xe cộ",
      ],
    },
    {
      id: 3,
      name: "Dịch Vụ Bảo Vệ",
      description: "Dịch vụ bảo vệ chuyên nghiệp 24/7, đảm bảo an ninh tòa nhà",
      price: 100000,
      icon: Shield,
      period: "Tháng",
      features: [
        "Bảo vệ 24/7",
        "Kiểm soát ra vào",
        "Tuần tra định kỳ",
        "Xử lý sự cố khẩn cấp",
      ],
    },
    {
      id: 4,
      name: "Điện Dự Phòng",
      description: "Máy phát điện dự phòng tự động hoạt động khi mất điện",
      price: 50000,
      icon: Zap,
      period: "Tháng",
      features: [
        "Khởi động tự động",
        "Công suất lớn",
        "Đảm bảo hoạt động liên tục",
        "Bảo trì định kỳ",
      ],
    },
    {
      id: 5,
      name: "Dọn dẹp và Vệ sinh",
      description:
        "Dịch vụ vệ sinh chuyên nghiệp, giúp không gian sống luôn sạch sẽ và ngăn nắp",
      price: 300000,
      icon: Brush,
      period: "Tháng",
      features: [
        "Vệ sinh phòng hàng tuần",
        "Giặt rèm và chăn ga định kỳ",
        "Vệ sinh cửa kính và ban công",
        "Khử khuẩn và khử mùi chuyên nghiệp",
      ],
    },
  ];

  const [userServices, setUserServices] = useState([
    {
      id: 1,
      name: "Internet Tốc Độ Cao",
      status: "active",
      startDate: "01/02/2024",
      endDate: "01/03/2024",
    },
  ]);

  const handleServiceSelect = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleServiceRegister = () => {
    if (selectedServices.length > 0) {
      setShowConfirmation(true);
    }
  };

  const confirmRegistration = () => {
    const newServices = selectedServices.map((id) => {
      const service = services.find((s) => s.id === id);
      return {
        id: service.id,
        name: service.name,
        status: "pending",
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      };
    });

    setUserServices([...userServices, ...newServices]);
    setSelectedServices([]);
    setShowConfirmation(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dịch Vụ Bổ Sung</h1>
        <p className="mt-2 text-gray-600">
          Nâng cao trải nghiệm sống của bạn với các dịch vụ tiện ích
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedServices.includes(service.id);
          const isActive = userServices.some((us) => us.id === service.id);

          return (
            <div
              key={service.id}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-200"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-indigo-100">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {service.description}
                    </p>
                  </div>
                </div>
                {!isActive && (
                  <button
                    onClick={() => handleServiceSelect(service.id)}
                    className={`flex-shrink-0 rounded-full p-2 transition-colors ${
                      isSelected
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>

              <div className="mb-4">
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-baseline justify-between border-t pt-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {service.price.toLocaleString()}đ
                  </span>
                  <span className="text-gray-500">/{service.period}</span>
                </div>
                {isActive && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Đang sử dụng
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-gray-600">
                Đã chọn {selectedServices.length} dịch vụ
              </span>
              <p className="text-sm text-gray-500">
                Tổng phí:{" "}
                {selectedServices
                  .reduce((total, id) => {
                    const service = services.find((s) => s.id === id);
                    return total + service.price;
                  }, 0)
                  .toLocaleString()}
                đ/tháng
              </p>
            </div>
            <button
              onClick={handleServiceRegister}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              Xác nhận đăng ký dịch vụ
            </h3>
            <div className="space-y-4 mb-6">
              {selectedServices.map((id) => {
                const service = services.find((s) => s.id === id);
                return (
                  <div key={id} className="flex justify-between">
                    <span>{service.name}</span>
                    <span>{service.price.toLocaleString()}đ/tháng</span>
                  </div>
                );
              })}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span>
                    {selectedServices
                      .reduce((total, id) => {
                        const service = services.find((s) => s.id === id);
                        return total + service.price;
                      }, 0)
                      .toLocaleString()}
                    đ/tháng
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={confirmRegistration}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Dịch vụ của bạn
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày kết thúc
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userServices.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {service.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          service.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {service.status === "active"
                          ? "Đang hoạt động"
                          : "Đang xử lý"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.endDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
