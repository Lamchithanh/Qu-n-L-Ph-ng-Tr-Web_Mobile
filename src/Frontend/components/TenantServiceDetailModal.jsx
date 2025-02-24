import React, { useState } from "react";
import {
  X,
  FileText,
  CreditCard,
  Clock,
  Home,
  Settings,
  Check,
  AlertCircle,
} from "lucide-react";

const TenantServiceDetailModal = ({ tenant, onClose }) => {
  const [activeTab, setActiveTab] = useState("services");

  // Mô phỏng dữ liệu dịch vụ và thanh toán
  const tenantServices = [
    {
      id: 1,
      name: "Internet Tốc Độ Cao",
      status: "active",
      startDate: "01/01/2024",
      endDate: "31/12/2024",
      price: 200000,
      details: {
        speed: "100Mbps",
        supportHours: "24/7",
        technology: "Fiber Optic",
      },
    },
    {
      id: 2,
      name: "Dịch Vụ Bảo Vệ",
      status: "active",
      startDate: "01/01/2024",
      endDate: "31/12/2024",
      price: 100000,
      details: {
        coverage: "24/7",
        guardCount: 3,
        securitySystem: "Camera + Kiểm Soát Vào Ra",
      },
    },
  ];

  const paymentHistory = [
    {
      id: 1,
      month: "Tháng 1/2024",
      total: 4500000,
      status: "paid",
      paymentDate: "05/01/2024",
      breakdown: {
        rent: 3500000,
        services: [
          { name: "Internet", amount: 200000 },
          { name: "Bảo Vệ", amount: 100000 },
        ],
        electricity: 350000,
        water: 75000,
      },
    },
    {
      id: 2,
      month: "Tháng 2/2024",
      total: 4600000,
      status: "pending",
      dueDate: "05/02/2024",
      breakdown: {
        rent: 3500000,
        services: [
          { name: "Internet", amount: 200000 },
          { name: "Bảo Vệ", amount: 100000 },
        ],
        electricity: 420000,
        water: 105000,
      },
    },
  ];

  const renderServiceDetails = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
        <Settings className="mr-3 text-indigo-600" /> Các Dịch Vụ Đang Sử Dụng
      </h3>
      {tenantServices.map((service) => (
        <div
          key={service.id}
          className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-800">{service.name}</h4>
            <span
              className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${
                  service.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              `}
            >
              {service.status === "active"
                ? "Đang Hoạt Động"
                : "Ngừng Hoạt Động"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Ngày Bắt Đầu:</span>{" "}
              {service.startDate}
            </div>
            <div>
              <span className="font-medium">Ngày Kết Thúc:</span>{" "}
              {service.endDate}
            </div>
            <div>
              <span className="font-medium">Giá Dịch Vụ:</span>{" "}
              {service.price.toLocaleString()}đ/tháng
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPaymentHistory = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
        <CreditCard className="mr-3 text-indigo-600" /> Lịch Sử Thanh Toán
      </h3>
      {paymentHistory.map((payment) => (
        <div
          key={payment.id}
          className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-800">{payment.month}</h4>
            <span
              className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${
                  payment.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              `}
            >
              {payment.status === "paid" ? "Đã Thanh Toán" : "Chờ Thanh Toán"}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Tổng Tiền:</span>
              <span>{payment.total.toLocaleString()}đ</span>
            </div>
            {payment.paymentDate && (
              <div className="flex justify-between">
                <span className="font-medium">Ngày Thanh Toán:</span>
                <span>{payment.paymentDate}</span>
              </div>
            )}
            {payment.dueDate && (
              <div className="flex justify-between">
                <span className="font-medium text-yellow-600">
                  Hạn Thanh Toán:
                </span>
                <span className="text-yellow-600">{payment.dueDate}</span>
              </div>
            )}
            <div className="mt-2 border-t pt-2">
              <h5 className="font-semibold mb-2">Chi Tiết Thanh Toán</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Tiền Thuê Phòng</span>
                  <span>{payment.breakdown.rent.toLocaleString()}đ</span>
                </div>
                {payment.breakdown.services.map((service) => (
                  <div key={service.name} className="flex justify-between">
                    <span>Dịch Vụ {service.name}</span>
                    <span>{service.amount.toLocaleString()}đ</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>Tiền Điện</span>
                  <span>{payment.breakdown.electricity.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiền Nước</span>
                  <span>{payment.breakdown.water.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContractDetails = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
        <FileText className="mr-3 text-indigo-600" /> Chi Tiết Hợp Đồng
      </h3>
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-600">Số Hợp Đồng:</span>
            <p>HD-2024-001</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Ngày Ký:</span>
            <p>01/01/2024</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Ngày Bắt Đầu:</span>
            <p>01/01/2024</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Ngày Kết Thúc:</span>
            <p>31/12/2024</p>
          </div>
          <div className="col-span-2">
            <span className="font-medium text-gray-600">Ghi Chú:</span>
            <p>
              Hợp đồng thuê phòng cho năm 2024, thanh toán hàng tháng trước ngày
              5
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Home className="mr-3 text-indigo-600" />
            Chi Tiết Dịch Vụ Và Thanh Toán
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b bg-white">
          {[
            { id: "services", label: "Dịch Vụ", icon: Settings },
            { id: "payments", label: "Thanh Toán", icon: CreditCard },
            { id: "contract", label: "Hợp Đồng", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-3 flex items-center justify-center
                ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <tab.icon className="mr-2" size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "services" && renderServiceDetails()}
          {activeTab === "payments" && renderPaymentHistory()}
          {activeTab === "contract" && renderContractDetails()}
        </div>
      </div>
    </div>
  );
};

export default TenantServiceDetailModal;
