import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AlertTriangle,
  Camera,
  Clock,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";
import { Toolbar } from "@mui/material";

const MaintenanceRequest = () => {
  const { showToast } = useToast();
  const [noContract, setNoContract] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    urgency: "normal", // Đổi thành priority nếu cần
    category: "",
    images: [],
  });

  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);

  const categories = [
    { id: "electricity", label: "Điện", icon: "⚡" },
    { id: "water", label: "Nước", icon: "💧" },
    { id: "internet", label: "Internet", icon: "🌐" },
    { id: "furniture", label: "Nội thất", icon: "🪑" },
    { id: "security", label: "An ninh", icon: "🔒" },
    { id: "other", label: "Khác", icon: "📝" },
  ];

  // Fetch maintenance requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          `${CONFIG.API_URL}/users/maintenance-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Đảm bảo đúng cấu trúc dữ liệu trả về
        if (response.data && response.data.maintenance_requests) {
          setRecentRequests(response.data.maintenance_requests);
        } else {
          setRecentRequests(response.data || []);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);

        // Kiểm tra nếu lỗi là do không có hợp đồng
        if (
          error.response &&
          error.response.data &&
          error.response.data.noActiveContract
        ) {
          setNoContract(true);
        }

        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.description || !formData.category) {
      showToast("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const formDataToSend = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((image) => {
            formDataToSend.append("images", image);
          });
        } else {
          // Map urgency to priority nếu cần thiết
          if (key === "urgency") {
            formDataToSend.append("priority", formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      const response = await axios.post(
        `${CONFIG.API_URL}/users/maintenance-requests`, // Đảm bảo sử dụng đúng endpoint
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Add new request to list
      const newRequest = response.data.maintenance_request_id
        ? {
            id: response.data.maintenance_request_id,
            ...formData,
            status: "pending",
            created_at: new Date(),
          }
        : response.data;

      setRecentRequests((prev) => [newRequest, ...prev]);

      // Reset form
      setFormData({
        title: "",
        description: "",
        urgency: "normal",
        category: "",
        images: [],
      });
      setPreview([]);

      showToast("Gửi yêu cầu bảo trì thành công", "success");
    } catch (error) {
      console.error("Error submitting maintenance request:", error);

      // Kiểm tra nếu lỗi là do không có hợp đồng
      if (
        error.response &&
        error.response.data &&
        error.response.data.noActiveContract
      ) {
        setNoContract(true);
        showToast("Bạn cần có hợp đồng thuê phòng để báo cáo sự cố", "error");
      } else {
        showToast("Không thể gửi yêu cầu bảo trì", "error");
      }
    }
  };

  // Image upload handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images
    const newFiles = files.slice(0, 5 - formData.images.length);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image from preview
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Render recent requests list
  const renderRecentRequestsList = () => {
    if (loading) {
      return (
        <div className="text-center text-gray-500 py-4">
          Đang tải yêu cầu...
        </div>
      );
    }

    if (recentRequests.length === 0) {
      return (
        <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
          <AlertTriangle className="mx-auto mb-4 text-gray-400" size={48} />
          <p>Chưa có yêu cầu bảo trì nào</p>
        </div>
      );
    }

    return recentRequests.map((request) => (
      <div
        key={request.id}
        className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div
            className={`p-2 rounded-full ${
              request.status === "completed"
                ? "bg-green-100"
                : request.status === "in_progress"
                ? "bg-yellow-100"
                : "bg-gray-100"
            }`}
          >
            {categories.find((cat) => cat.id === request.category)?.icon ||
              "📝"}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {request.title || request.description}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            request.status === "completed"
              ? "bg-green-100 text-green-800"
              : request.status === "in_progress"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {request.status === "completed"
            ? "Đã xử lý"
            : request.status === "in_progress"
            ? "Đang xử lý"
            : "Chờ xử lý"}
        </span>
      </div>
    ));
  };

  // Main render function
  if (noContract) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Báo cáo Sự cố
          </h1>
          <p className="text-gray-600">
            Gửi báo cáo về các vấn đề cần sửa chữa hoặc hỗ trợ
          </p>
        </div>

        <div className="text-center bg-yellow-50 p-8 rounded-lg my-6">
          <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
          <h3 className="text-xl font-medium mb-2">
            Chưa có hợp đồng thuê phòng
          </h3>
          <p className="text-gray-600 mb-4">
            Bạn cần có hợp đồng thuê phòng hoạt động để sử dụng tính năng báo
            cáo sự cố.
          </p>
          <button
            onClick={() => (window.location.href = "/rooms")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Tìm phòng ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Báo cáo Sự cố</h1>
        <p className="text-gray-600">
          Gửi báo cáo về các vấn đề cần sửa chữa hoặc hỗ trợ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề sự cố
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="VD: Bóng đèn phòng ngủ bị hỏng"
              required
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
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category: cat.id }))
                  }
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
                      setFormData((prev) => ({
                        ...prev,
                        urgency: e.target.value,
                      }))
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
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về vấn đề bạn đang gặp phải..."
              required
            />
          </div>

          {/* Upload hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh đính kèm (không bắt buộc, tối đa 5 ảnh)
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
              {preview.length < 5 && (
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
              )}
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

      {/* Các yêu cầu gần đây */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Các yêu cầu gần đây
        </h2>
        <div className="space-y-4">{renderRecentRequestsList()}</div>
      </div>
    </div>
  );
};

export default MaintenanceRequest;
