import React, { useState } from "react";
import {
  AlertTriangle,
  Camera,
  Clock,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { Toolbar } from "@mui/material";

const MaintenanceRequest = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    urgency: "normal",
    category: "",
    images: [],
  });

  const [preview, setPreview] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: "electricity", label: "Điện", icon: "⚡" },
    { id: "water", label: "Nước", icon: "💧" },
    { id: "internet", label: "Internet", icon: "🌐" },
    { id: "furniture", label: "Nội thất", icon: "🪑" },
    { id: "security", label: "An ninh", icon: "🔒" },
    { id: "other", label: "Khác", icon: "📝" },
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        title: "",
        description: "",
        urgency: "normal",
        category: "",
        images: [],
      });
      setPreview([]);
    }, 3000);
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
    setPreview(preview.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Báo cáo Sự cố</h1>
        <p className="text-gray-600">
          Gửi báo cáo về các vấn đề cần sửa chữa hoặc hỗ trợ
        </p>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <span className="flex-shrink-0 w-5 h-5">✓</span>
            <div className="ml-2">
              <h3 className="font-semibold">Gửi báo cáo thành công!</h3>
              <p>
                Chúng tôi đã nhận được báo cáo và sẽ xử lý trong thời gian sớm
                nhất.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề sự cố
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="VD: Bóng đèn phòng ngủ bị hỏng"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`flex items-center p-4 rounded-lg border transition-all ${
                    formData.category === cat.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-200"
                  }`}
                >
                  <span className="text-2xl mr-3">{cat.icon}</span>
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mức độ khẩn cấp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức độ khẩn cấp
            </label>
            <div className="flex space-x-4">
              {["low", "normal", "high"].map((level) => (
                <label
                  key={level}
                  className={`flex-1 flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.urgency === level
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={(e) =>
                      setFormData({ ...formData, urgency: e.target.value })
                    }
                    className="sr-only"
                  />
                  {level === "low" && (
                    <Clock className="w-5 h-5 mr-2 text-green-500" />
                  )}
                  {level === "normal" && (
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                  )}
                  {level === "high" && (
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  )}
                  <span className="font-medium">
                    {level === "low" && "Không gấp"}
                    {level === "normal" && "Bình thường"}
                    {level === "high" && "Khẩn cấp"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về vấn đề bạn đang gặp phải..."
            />
          </div>

          {/* Upload hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh đính kèm (không bắt buộc)
            </label>
            <div className="mt-2 flex flex-wrap gap-4">
              {preview.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Thêm ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Nút gửi */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/50 transition-all flex items-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Gửi báo cáo
          </button>
        </div>
      </form>

      {/* Trạng thái các yêu cầu trước */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Các yêu cầu gần đây
        </h2>
        <div className="space-y-4">
          {[
            {
              id: 1,
              title: "Sửa vòi nước bồn rửa",
              status: "completed",
              date: "20/02/2024",
              category: "water",
            },
            {
              id: 2,
              title: "Thay bóng đèn phòng khách",
              status: "processing",
              date: "18/02/2024",
              category: "electricity",
            },
          ].map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    request.status === "completed"
                      ? "bg-green-100"
                      : "bg-yellow-100"
                  }`}
                >
                  {request.category === "water" && (
                    <Toolbar className="w-5 h-5 text-blue-600" />
                  )}
                  {request.category === "electricity" && (
                    <Toolbar className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{request.title}</h3>
                  <p className="text-sm text-gray-500">{request.date}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {request.status === "completed" ? "Đã xử lý" : "Đang xử lý"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequest;
