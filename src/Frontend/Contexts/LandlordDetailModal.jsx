import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  Download,
  Edit,
} from "lucide-react";

const LandlordDetailModal = ({ landlord, onClose, onEdit }) => {
  if (!landlord) return null;

  // Hàm chuyển đổi trạng thái
  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return {
          text: "Đã Duyệt",
          color: "text-green-600 bg-green-100",
        };
      case "pending":
        return {
          text: "Chờ Duyệt",
          color: "text-yellow-600 bg-yellow-100",
        };
      case "rejected":
        return {
          text: "Từ Chối",
          color: "text-red-600 bg-red-100",
        };
      default:
        return {
          text: "Không xác định",
          color: "text-gray-600 bg-gray-100",
        };
    }
  };

  const statusLabel = getStatusLabel(landlord.status);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Tiêu đề modal */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Chi Tiết Chủ Trọ</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nội dung modal */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột 1: Thông tin cá nhân */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Thông Tin Cá Nhân
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {landlord.full_name}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    {landlord.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <User size={16} className="mr-2 text-gray-500" />
                    {landlord.id_card_number}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    {landlord.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Cột 2: Thông tin kinh doanh */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Thông Tin Kinh Doanh
                </h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <p className="text-sm text-gray-600 flex items-center">
                    <FileText size={16} className="mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Giấy Phép:</span>
                    {landlord.business_license || "Chưa cung cấp"}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Ngày Tham Gia:</span>
                    {new Date(landlord.created_at).toLocaleDateString("vi-VN")}
                  </p>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Trạng Thái:</span>
                    <span
                      className={`
                      px-2 py-1 rounded-full text-xs
                      ${statusLabel.color}
                    `}
                    >
                      {statusLabel.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột 3: Thông tin bổ sung */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Thông Tin Bổ Sung
                </h3>
                <div className="bg-gray-50 p-4 rounded-md h-full">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Địa Chỉ:</span>
                    <br />
                    {landlord.address || "Chưa cung cấp"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nút thao tác */}
          <div className="mt-8 flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center">
              <Download size={16} className="mr-2" />
              Xuất PDF
            </button>
            <button
              onClick={() => onEdit(landlord)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Edit size={16} className="mr-2" />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDetailModal;
