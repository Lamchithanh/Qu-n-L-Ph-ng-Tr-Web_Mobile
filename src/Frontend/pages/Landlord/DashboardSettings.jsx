import React, { useState, useEffect } from "react";
import {
  //   Settings,
  User,
  Bell,
  Lock,
  CreditCard,
  Zap,
  //   MessageCircle,
  //   Mail,
  //   Shield,
  //   Database,
  Palette,
  //   Language,
  //   Clock,
  CheckCircle,
  //   XCircle,
} from "lucide-react";

const DashboardSettings = () => {
  // State quản lý các cài đặt
  const [settings, setSettings] = useState({
    // Cài đặt thông báo
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      notificationTypes: {
        newBooking: true,
        paymentReminder: true,
        maintenanceAlert: true,
        reviewNotification: true,
      },
    },

    // Cài đặt bảo mật
    security: {
      twoFactorAuthentication: false,
      loginAttempts: 5,
      autoLogoutTime: 30, // phút
    },

    // Cài đặt thanh toán
    payment: {
      defaultPaymentMethod: "bank_transfer",
      automaticLateFees: true,
      lateFeePercentage: 5,
      bankAccountInfo: {
        bankName: "Ngân hàng VCB",
        accountNumber: "1234567890",
        accountName: "NGUYEN VAN A",
      },
    },

    // Cài đặt giao diện
    appearance: {
      theme: "light",
      language: "vi",
      dateFormat: "dd/mm/yyyy",
      currency: "VND",
    },

    // Cài đặt hệ thống
    system: {
      autoBackup: true,
      backupFrequency: "daily",
      dataRetentionPeriod: 365, // ngày
    },
  });

  // State quản lý các tab
  const [activeTab, setActiveTab] = useState("notifications");

  // Danh sách các tab
  const tabs = [
    {
      id: "notifications",
      label: "Thông báo",
      icon: <Bell size={18} />,
    },
    {
      id: "security",
      label: "Bảo mật",
      icon: <Lock size={18} />,
    },
    {
      id: "payment",
      label: "Thanh toán",
      icon: <CreditCard size={18} />,
    },
    {
      id: "appearance",
      label: "Giao diện",
      icon: <Palette size={18} />,
    },
    {
      id: "system",
      label: "Hệ thống",
      icon: <Zap size={18} />,
    },
  ];

  // Các danh sách tùy chọn
  const paymentMethods = [
    { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
    { value: "momo", label: "Ví MoMo" },
    { value: "zalo_pay", label: "Zalo Pay" },
  ];

  const languages = [
    { value: "vi", label: "Tiếng Việt" },
    { value: "en", label: "English" },
  ];

  const dateFormats = [
    { value: "dd/mm/yyyy", label: "Ngày/Tháng/Năm" },
    { value: "mm/dd/yyyy", label: "Tháng/Ngày/Năm" },
    { value: "yyyy-mm-dd", label: "Năm-Tháng-Ngày" },
  ];

  const currencies = [
    { value: "VND", label: "Việt Nam Đồng" },
    { value: "USD", label: "US Dollar" },
  ];

  // Handler cập nhật cài đặt
  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  // Handler cập nhật cài đặt nested
  const handleNestedSettingChange = (category, parentKey, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parentKey]: {
          ...prev[category][parentKey],
          [key]: value,
        },
      },
    }));
  };

  // Handler lưu cài đặt
  const handleSaveSettings = () => {
    // Trong thực tế, sẽ gọi API để lưu cài đặt
    alert("Đã lưu cài đặt thành công!");
    console.log("Saved Settings:", settings);
  };

  // Render nội dung từng tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cài đặt thông báo chung
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "emailNotifications",
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  <span>Thông báo qua Email</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "smsNotifications",
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  <span>Thông báo qua SMS</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "pushNotifications",
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  <span>Thông báo đẩy</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Loại thông báo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.notifications.notificationTypes).map(
                  ([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleNestedSettingChange(
                            "notifications",
                            "notificationTypes",
                            key,
                            e.target.checked
                          )
                        }
                        className="mr-2"
                      />
                      <span>
                        {
                          {
                            newBooking: "Đặt phòng mới",
                            paymentReminder: "Nhắc thanh toán",
                            maintenanceAlert: "Cảnh báo bảo trì",
                            reviewNotification: "Đánh giá mới",
                          }[key]
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xác thực hai yếu tố
              </h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuthentication}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "twoFactorAuthentication",
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
                <span>Bật xác thực hai yếu tố</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Bảo mật đăng nhập
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lần đăng nhập không thành công
                  </label>
                  <input
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "loginAttempts",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="3"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian tự động đăng xuất (phút)
                  </label>
                  <input
                    type="number"
                    value={settings.security.autoLogoutTime}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "autoLogoutTime",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="10"
                    max="120"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Phương thức thanh toán mặc định
              </h3>
              <select
                value={settings.payment.defaultPaymentMethod}
                onChange={(e) =>
                  handleSettingChange(
                    "payment",
                    "defaultPaymentMethod",
                    e.target.value
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Phí thanh toán trễ
              </h3>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={settings.payment.automaticLateFees}
                  onChange={(e) =>
                    handleSettingChange(
                      "payment",
                      "automaticLateFees",
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
                <span>Tự động áp dụng phí thanh toán trễ</span>
              </div>
              {settings.payment.automaticLateFees && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phần trăm phí thanh toán trễ
                  </label>
                  <input
                    type="number"
                    value={settings.payment.lateFeePercentage}
                    onChange={(e) =>
                      handleSettingChange(
                        "payment",
                        "lateFeePercentage",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    max="20"
                    step="0.5"
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin tài khoản ngân hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên ngân hàng
                  </label>
                  <input
                    type="text"
                    value={settings.payment.bankAccountInfo.bankName}
                    onChange={(e) =>
                      handleNestedSettingChange(
                        "payment",
                        "bankAccountInfo",
                        "bankName",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    value={settings.payment.bankAccountInfo.accountNumber}
                    onChange={(e) =>
                      handleNestedSettingChange(
                        "payment",
                        "bankAccountInfo",
                        "accountNumber",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ tài khoản
                  </label>
                  <input
                    type="text"
                    value={settings.payment.bankAccountInfo.accountName}
                    onChange={(e) =>
                      handleNestedSettingChange(
                        "payment",
                        "bankAccountInfo",
                        "accountName",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Giao diện
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chế độ giao diện
                  </label>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) =>
                      handleSettingChange("appearance", "theme", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="light">Sáng</option>
                    <option value="dark">Tối</option>
                    <option value="system">Hệ thống</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngôn ngữ
                  </label>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) =>
                      handleSettingChange(
                        "appearance",
                        "language",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Định dạng ngày
                  </label>
                  <select
                    value={settings.appearance.dateFormat}
                    onChange={(e) =>
                      handleSettingChange(
                        "appearance",
                        "dateFormat",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {dateFormats.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tiền tệ
              </h3>
              <select
                value={settings.appearance.currency}
                onChange={(e) =>
                  handleSettingChange("appearance", "currency", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sao lưu dữ liệu
              </h3>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={settings.system.autoBackup}
                  onChange={(e) =>
                    handleSettingChange(
                      "system",
                      "autoBackup",
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
                <span>Tự động sao lưu dữ liệu</span>
              </div>
              {settings.system.autoBackup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tần suất sao lưu
                  </label>
                  <select
                    value={settings.system.backupFrequency}
                    onChange={(e) =>
                      handleSettingChange(
                        "system",
                        "backupFrequency",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quản lý dữ liệu
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian lưu trữ dữ liệu (ngày)
                </label>
                <input
                  type="number"
                  value={settings.system.dataRetentionPeriod}
                  onChange={(e) =>
                    handleSettingChange(
                      "system",
                      "dataRetentionPeriod",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="30"
                  max="1095"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Dữ liệu cũ hơn sẽ được tự động xóa. Giới hạn từ 30 đến 3 năm.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>
        <p className="text-gray-600">
          Quản lý và tùy chỉnh cài đặt cho tài khoản và hệ thống của bạn
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex border-b">
          {/* Sidebar tab */}
          <div className="w-64 border-r p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-3 rounded-md flex items-center mb-2 ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-grow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600 text-sm">
                {
                  {
                    notifications: "Quản lý cài đặt thông báo",
                    security: "Bảo vệ tài khoản của bạn",
                    payment: "Cấu hình phương thức và chính sách thanh toán",
                    appearance: "Tùy chỉnh giao diện và ngôn ngữ",
                    system: "Quản lý cài đặt hệ thống",
                  }[activeTab]
                }
              </p>
            </div>

            {renderTabContent()}

            <div className="mt-6 border-t pt-6 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <CheckCircle size={18} className="mr-2" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
