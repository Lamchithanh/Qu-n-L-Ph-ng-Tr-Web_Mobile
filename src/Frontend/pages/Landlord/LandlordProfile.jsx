import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";

// Component quản lý thông tin chủ trọ
const LandlordProfile = () => {
  // State để lưu trữ thông tin chủ trọ
  const [profile, setProfile] = useState({
    full_name: "",
    id_card_number: "",
    address: "",
    phone: "",
    email: "",
    business_license: null,
    property_documents: [],
    description: "",
    status: "pending", // (pending, approved, rejected)
  });

  // State cho việc hiển thị thông báo
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Hàm cập nhật trường dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý upload file giấy phép kinh doanh
  const handleBusinessLicenseUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Thực tế sẽ cần gửi file lên server, nhưng ở đây chỉ lưu trữ locally
      setProfile((prev) => ({
        ...prev,
        business_license: file,
      }));
    }
  };

  // Hàm xử lý upload nhiều file giấy tờ sở hữu nhà
  const handlePropertyDocumentsUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setProfile((prev) => ({
        ...prev,
        property_documents: [...prev.property_documents, ...files],
      }));
    }
  };

  // Hàm xóa file giấy tờ sở hữu nhà
  const removePropertyDocument = (index) => {
    setProfile((prev) => ({
      ...prev,
      property_documents: prev.property_documents.filter((_, i) => i !== index),
    }));
  };

  // Hàm lưu thông tin chủ trọ
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate các trường bắt buộc
    if (!profile.id_card_number || !profile.address) {
      setNotification({
        show: true,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc!",
        type: "error",
      });
      return;
    }

    // Giả lập việc gửi dữ liệu lên server
    console.log("Đã lưu thông tin chủ trọ:", profile);

    // Hiển thị thông báo thành công
    setNotification({
      show: true,
      message: "Lưu thông tin thành công!",
      type: "success",
    });

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Giả lập việc lấy dữ liệu từ server khi component được mount
  useEffect(() => {
    // Giả lập dữ liệu từ API
    const fetchData = async () => {
      // Trong thực tế sẽ là một API call
      setTimeout(() => {
        setProfile({
          full_name: "Nguyễn Văn A",
          id_card_number: "012345678910",
          address: "123 Đường ABC, Quận XYZ, TP.HCM",
          phone: "0987654321",
          email: "nguyenvana@example.com",
          business_license: null,
          property_documents: [],
          description: "Chủ nhà trọ với 5 năm kinh nghiệm.",
          status: "pending",
        });
      }, 500);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Tiêu đề */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thông tin Chủ Trọ</h1>
        <p className="text-gray-600">
          Quản lý thông tin cá nhân và giấy tờ liên quan
        </p>
      </div>

      {/* Hiển thị thông báo */}
      {notification.show && (
        <div
          className={`p-4 mb-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Form thông tin chủ trọ */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ và tên (không chỉnh sửa được, lấy từ bảng users) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Thông tin được lấy từ tài khoản đăng ký
            </p>
          </div>

          {/* Số CMND/CCCD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số CMND/CCCD <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="id_card_number"
              value={profile.id_card_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập số CMND/CCCD"
            />
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập địa chỉ liên hệ"
            />
          </div>

          {/* Số điện thoại (không chỉnh sửa được, lấy từ bảng users) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Thông tin được lấy từ tài khoản đăng ký
            </p>
          </div>

          {/* Email (không chỉnh sửa được, lấy từ bảng users) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Thông tin được lấy từ tài khoản đăng ký
            </p>
          </div>

          {/* Giấy phép kinh doanh (upload file) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giấy phép kinh doanh <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="business_license"
                onChange={handleBusinessLicenseUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="business_license"
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-100"
              >
                <Camera size={16} className="mr-2" />
                Tải lên giấy phép
              </label>
              {profile.business_license && (
                <span className="ml-2 text-sm text-green-600">
                  Đã tải lên: {profile.business_license.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Định dạng: PDF, JPG, PNG (tối đa 5MB)
            </p>
          </div>

          {/* Giấy tờ sở hữu nhà (upload nhiều file) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giấy tờ sở hữu nhà <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="property_documents"
                onChange={handlePropertyDocumentsUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              />
              <label
                htmlFor="property_documents"
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-100"
              >
                <Camera size={16} className="mr-2" />
                Tải lên giấy tờ
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Định dạng: PDF, JPG, PNG (tối đa 5MB mỗi file)
            </p>

            {/* Hiển thị danh sách giấy tờ đã upload */}
            {profile.property_documents.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Giấy tờ đã tải lên:</p>
                <ul className="mt-1 space-y-1">
                  {profile.property_documents.map((doc, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
                    >
                      <span>{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => removePropertyDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mô tả */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nhập mô tả về bạn (kinh nghiệm, thời gian làm chủ trọ,...)"
          ></textarea>
        </div>

        {/* Trạng thái phê duyệt */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái phê duyệt
          </label>
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-md">
            {profile.status === "pending" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Đang chờ duyệt
              </span>
            )}
            {profile.status === "approved" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Đã phê duyệt
              </span>
            )}
            {profile.status === "rejected" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Đã từ chối
              </span>
            )}
          </div>
        </div>

        {/* Nút lưu thông tin */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Lưu thông tin
          </button>
        </div>
      </form>
    </div>
  );
};

export default LandlordProfile;
