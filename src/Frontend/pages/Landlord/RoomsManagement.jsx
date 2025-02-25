import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const RoomsManagement = () => {
  // State quản lý danh sách phòng trọ
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    floor: "all",
    priceRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);

  // State cho modal thêm/sửa phòng
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'
  const [currentRoom, setCurrentRoom] = useState(null);

  // State cho form thêm/sửa phòng
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    room_number: "",
    floor: "",
    area: "",
    price: "",
    discounted_price: "",
    status: "available",
    description: "",
    facilities: [],
    images: [],
  });

  // State cho preview images
  const [imagePreview, setImagePreview] = useState([]);

  // Danh sách tiện ích có thể chọn
  const availableFacilities = [
    { id: "wifi", name: "WiFi" },
    { id: "ac", name: "Máy lạnh" },
    { id: "fridge", name: "Tủ lạnh" },
    { id: "washing_machine", name: "Máy giặt" },
    { id: "parking", name: "Chỗ để xe" },
    { id: "security", name: "An ninh 24/7" },
    { id: "tv", name: "TV" },
    { id: "water_heater", name: "Máy nước nóng" },
    { id: "kitchen", name: "Nhà bếp" },
    { id: "bathroom", name: "Phòng tắm riêng" },
  ];

  // Giả lập dữ liệu phòng trọ
  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      const mockData = Array(20)
        .fill()
        .map((_, index) => ({
          id: index + 1,
          title: `Phòng trọ ${index + 1} an ninh, sạch sẽ, tiện nghi`,
          address: `${123 + index} Đường ABC, Quận ${(index % 5) + 1}, TP.HCM`,
          room_number: `${(index % 5) + 1}0${(index % 10) + 1}`,
          floor: (index % 5) + 1,
          area: 20 + (index % 15),
          price: 2500000 + (index % 10) * 300000,
          discounted_price:
            index % 3 === 0 ? 2500000 + (index % 10) * 300000 - 200000 : null,
          status:
            index % 4 === 0
              ? "maintenance"
              : index % 3 === 0
              ? "occupied"
              : "available",
          description: `Phòng trọ rộng rãi, thoáng mát, có cửa sổ, ban công, đầy đủ tiện nghi. Phòng ${
            (index % 5) + 1
          }0${(index % 10) + 1} phù hợp cho sinh viên hoặc người đi làm.`,
          facilities: [
            "wifi",
            "ac",
            ...(index % 2 === 0 ? ["fridge", "washing_machine"] : []),
            ...(index % 3 === 0 ? ["parking", "security"] : []),
          ],
          images: [
            `/api/placeholder/300/200?text=Room_${index + 1}_Image_1`,
            `/api/placeholder/300/200?text=Room_${index + 1}_Image_2`,
          ],
          rating: (3 + Math.random() * 2).toFixed(1),
          review_count: 5 + (index % 20),
          current_views: 20 + (index % 50),
        }));

      setRooms(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc phòng theo điều kiện search và filter
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || room.status === filters.status;
    const matchesFloor =
      filters.floor === "all" || room.floor.toString() === filters.floor;

    let matchesPrice = true;
    if (filters.priceRange !== "all") {
      const price = room.discounted_price || room.price;
      if (filters.priceRange === "under3m") {
        matchesPrice = price < 3000000;
      } else if (filters.priceRange === "3m-5m") {
        matchesPrice = price >= 3000000 && price <= 5000000;
      } else if (filters.priceRange === "over5m") {
        matchesPrice = price > 5000000;
      }
    }

    return matchesSearch && matchesStatus && matchesFloor && matchesPrice;
  });

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRoom, setDetailRoom] = useState(null);

  // Cập nhật handler xem chi tiết phòng
  const handleViewRoom = (room) => {
    setDetailRoom(room);
    setShowDetailModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handler cho việc tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handler cho việc lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Handler mở modal thêm phòng mới
  const handleAddRoom = () => {
    setModalMode("add");
    setFormData({
      title: "",
      address: "",
      room_number: "",
      floor: "",
      area: "",
      price: "",
      discounted_price: "",
      status: "available",
      description: "",
      facilities: [],
      images: [],
    });
    setImagePreview([]);
    setShowModal(true);
  };

  // Handler mở modal sửa phòng
  const handleEditRoom = (room) => {
    setModalMode("edit");
    setCurrentRoom(room);
    setFormData({
      title: room.title,
      address: room.address,
      room_number: room.room_number,
      floor: room.floor,
      area: room.area,
      price: room.price,
      discounted_price: room.discounted_price || "",
      status: room.status,
      description: room.description,
      facilities: room.facilities,
      images: [],
    });
    // Set hình ảnh preview từ các URL hiện có
    setImagePreview(room.images.map((url) => ({ url })));
    setShowModal(true);
  };

  // Handler xóa phòng
  const handleDeleteRoom = (roomId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      setRooms(rooms.filter((room) => room.id !== roomId));
    }
  };

  // Handler cho việc thay đổi form
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "facilities") {
        const facilityId = e.target.value;
        setFormData((prev) => {
          const facilities = checked
            ? [...prev.facilities, facilityId]
            : prev.facilities.filter((id) => id !== facilityId);
          return { ...prev, facilities };
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handler cho việc upload hình ảnh
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Tạo preview cho các hình ảnh được chọn
    const newImagePreview = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImagePreview((prev) => [...prev, ...newImagePreview]);

    // Cập nhật formData với file hình ảnh
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // Handler xóa hình ảnh khỏi preview
  const handleRemoveImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handler lưu thông tin phòng
  const handleSaveRoom = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.title ||
      !formData.room_number ||
      !formData.floor ||
      !formData.area ||
      !formData.price
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (modalMode === "add") {
      // Tạo phòng mới
      const newRoom = {
        id: rooms.length + 1,
        ...formData,
        rating: 0,
        review_count: 0,
        current_views: 0,
        images: imagePreview.map((img) => img.url), // Trong thực tế sẽ là URL từ server
      };

      setRooms([newRoom, ...rooms]);
    } else {
      // Cập nhật phòng hiện có
      setRooms(
        rooms.map((room) => {
          if (room.id === currentRoom.id) {
            return {
              ...room,
              ...formData,
              images: imagePreview.map((img) => img.url),
            };
          }
          return room;
        })
      );
    }

    setShowModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý phòng trọ</h1>
        <p className="text-gray-600">
          Quản lý danh sách phòng trọ và thông tin chi tiết
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm phòng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Bộ lọc */}
          <div className="flex flex-wrap items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0 w-full md:w-auto">
            <div className="w-full md:w-auto flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Trạng thái:</label>
                <select
                  name="status"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tất cả</option>
                  <option value="available">Trống</option>
                  <option value="occupied">Đã thuê</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Tầng:</label>
                <select
                  name="floor"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.floor}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tất cả</option>
                  <option value="1">Tầng 1</option>
                  <option value="2">Tầng 2</option>
                  <option value="3">Tầng 3</option>
                  <option value="4">Tầng 4</option>
                  <option value="5">Tầng 5</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Giá:</label>
                <select
                  name="priceRange"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tất cả</option>
                  <option value="under3m">Dưới 3 triệu</option>
                  <option value="3m-5m">3 - 5 triệu</option>
                  <option value="over5m">Trên 5 triệu</option>
                </select>
              </div>
            </div>

            {/* Nút thêm phòng */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 ml-auto"
              onClick={handleAddRoom}
            >
              <Plus size={16} className="mr-2" />
              Thêm phòng
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách phòng */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            Không tìm thấy phòng nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diện tích
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={room.images[0]}
                            alt={room.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            Phòng {room.room_number}
                          </div>
                          <div className="text-gray-500 text-sm">
                            Tầng {room.floor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {room.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.area} m²
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.discounted_price ? (
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {room.discounted_price.toLocaleString()} đ
                          </span>
                          <span className="text-xs text-gray-500 line-through ml-1">
                            {room.price.toLocaleString()} đ
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {room.price.toLocaleString()} đ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.status === "available" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Trống
                        </span>
                      ) : room.status === "occupied" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Đã thuê
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Bảo trì
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {room.current_views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm text-gray-700">
                          {room.rating}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({room.review_count})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewRoom(room)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstRoom + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastRoom, filteredRooms.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{filteredRooms.length}</span>{" "}
                  phòng
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === i + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      } text-sm font-medium`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm/sửa phòng */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === "add" ? "Thêm phòng mới" : "Sửa thông tin phòng"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tiêu đề */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề phòng"
                    required
                  />
                </div>

                {/* Địa chỉ */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập địa chỉ phòng"
                    required
                  />
                </div>

                {/* Số phòng và Tầng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số phòng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: 101, 202,..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tầng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số tầng"
                    min="1"
                    required
                  />
                </div>

                {/* Diện tích và Giá thuê */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diện tích (m²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập diện tích phòng"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá thuê (VNĐ/tháng) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập giá thuê phòng"
                    min="0"
                    step="100000"
                    required
                  />
                </div>

                {/* Giá khuyến mãi và trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá khuyến mãi (VNĐ/tháng)
                  </label>
                  <input
                    type="number"
                    name="discounted_price"
                    value={formData.discounted_price}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập giá khuyến mãi (nếu có)"
                    min="0"
                    step="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái phòng <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="available">Trống</option>
                    <option value="occupied">Đã thuê</option>
                    <option value="maintenance">Đang bảo trì</option>
                  </select>
                </div>

                {/* Mô tả */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả chi tiết về phòng"
                  ></textarea>
                </div>

                {/* Tiện ích */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiện ích
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {availableFacilities.map((facility) => (
                      <div key={facility.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`facility-${facility.id}`}
                          name="facilities"
                          value={facility.id}
                          checked={formData.facilities.includes(facility.id)}
                          onChange={handleFormChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`facility-${facility.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {facility.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload hình ảnh */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh phòng
                  </label>
                  <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Tải lên hình ảnh</span>
                          <input
                            id="image-upload"
                            name="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">hoặc kéo thả vào đây</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF tối đa 10MB
                      </p>
                    </div>
                  </div>

                  {/* Preview hình ảnh */}
                  {imagePreview.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imagePreview.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {modalMode === "add" ? "Thêm phòng" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && detailRoom && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết phòng trọ
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cột 1: Thông tin cơ bản */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Thông tin phòng
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Mã phòng:</span>{" "}
                        {detailRoom.id}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Số phòng:</span>{" "}
                        {detailRoom.room_number}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Tầng:</span>{" "}
                        {detailRoom.floor}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Diện tích:</span>{" "}
                        {detailRoom.area} m²
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Trạng thái:</span>{" "}
                        {detailRoom.status === "available" ? (
                          <span className="text-green-600">Trống</span>
                        ) : detailRoom.status === "occupied" ? (
                          <span className="text-blue-600">Đã thuê</span>
                        ) : (
                          <span className="text-yellow-600">Bảo trì</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Thông tin giá
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Giá thuê:</span>{" "}
                        {detailRoom.price.toLocaleString()} đ/tháng
                      </p>
                      {detailRoom.discounted_price && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Giá khuyến mãi:</span>{" "}
                          {detailRoom.discounted_price.toLocaleString()} đ/tháng
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cột 2: Mô tả và Tiện ích */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Mô tả chi tiết
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600">
                        {detailRoom.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Tiện ích
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {detailRoom.facilities.length > 0 ? (
                        <ul className="grid grid-cols-2 gap-2">
                          {detailRoom.facilities.map((facility) => {
                            const facilityInfo = availableFacilities.find(
                              (f) => f.id === facility
                            );
                            return (
                              <li
                                key={facility}
                                className="text-sm text-gray-700 flex items-center"
                              >
                                <CheckCircle
                                  size={16}
                                  className="text-green-500 mr-2"
                                />
                                {facilityInfo ? facilityInfo.name : facility}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Không có tiện ích
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cột 3: Hình ảnh và Đánh giá */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Hình ảnh phòng
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {detailRoom.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Phòng ${detailRoom.room_number} - Ảnh ${
                            index + 1
                          }`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Thống kê
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-600">Đánh giá:</p>
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-sm font-medium">
                            {detailRoom.rating}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Lượt xem:</p>
                        <p className="text-sm font-medium">
                          {detailRoom.current_views}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Đánh giá:</p>
                        <p className="text-sm font-medium">
                          {detailRoom.review_count} lượt
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditRoom(detailRoom);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Edit size={16} className="mr-2" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsManagement;
