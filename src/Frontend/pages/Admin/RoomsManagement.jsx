import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  Download,
  Home,
  CheckCircle,
  AlertCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Star,
  MapPin,
  Layers,
  Square,
  Users,
  User,
  FileText,
  Image as ImageIcon,
  Camera,
  Tag,
} from "lucide-react";

const AdminRoomsManagement = () => {
  // State quản lý danh sách phòng
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    landlord: "all",
    priceRange: "all",
    sortBy: "newest",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);

  // State cho modal thêm/sửa phòng
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'
  const [currentRoom, setCurrentRoom] = useState(null);

  // State cho detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRoom, setDetailRoom] = useState(null);

  // State cho form thêm/sửa phòng
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    landlord_id: "",
    room_number: "",
    floor: 1,
    area: 0,
    price: 0,
    discounted_price: null,
    status: "available",
    description: "",
    facilities: [],
    images: [],
  });

  // State cho chức năng upload hình ảnh
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // State cho facility mới
  const [newFacility, setNewFacility] = useState({
    name: "",
    icon: "",
  });

  // Danh sách chủ trọ (giả lập)
  const [landlords, setLandlords] = useState([]);

  // Danh sách tiện ích cơ bản có sẵn
  const [facilityOptions, setFacilityOptions] = useState([
    { id: "facility_1", name: "Điều hòa", icon: "air-conditioner" },
    { id: "facility_2", name: "Tủ lạnh", icon: "refrigerator" },
    { id: "facility_3", name: "Máy giặt", icon: "washing-machine" },
    { id: "facility_4", name: "Nước nóng", icon: "hot-water" },
    { id: "facility_5", name: "Wifi", icon: "wifi" },
    { id: "facility_6", name: "Ban công", icon: "balcony" },
    { id: "facility_7", name: "Tủ quần áo", icon: "wardrobe" },
    { id: "facility_8", name: "Bàn ghế", icon: "furniture" },
    { id: "facility_9", name: "Máy lạnh", icon: "fan" },
    { id: "facility_10", name: "Bếp", icon: "kitchen" },
  ]);

  // Giả lập dữ liệu
  useEffect(() => {
    // Giả lập API call cho landlords
    setTimeout(() => {
      const mockLandlords = Array(10)
        .fill()
        .map((_, index) => ({
          id: index + 1,
          name:
            [
              "Nguyễn Văn Chủ",
              "Trần Thị Hương",
              "Lê Văn Thành",
              "Phạm Minh Tuấn",
              "Hoàng Thị Lan",
            ][index % 5] + ` ${index + 1}`,
          phone: `098${index}${index + 1}${index + 2}${index + 3}${index + 4}`,
          email: `landlord${index + 1}@example.com`,
          address: `${index + 1} Đường số ${(index % 10) + 1}, Quận ${
            (index % 7) + 1
          }, TP.HCM`,
          property_count: Math.floor(Math.random() * 10) + 1,
        }));
      setLandlords(mockLandlords);

      // Giả lập API call cho danh sách phòng
      const mockRooms = Array(30)
        .fill()
        .map((_, index) => {
          const landlordIndex = index % mockLandlords.length;
          const landlord = mockLandlords[landlordIndex];

          // Tạo tên phòng ngẫu nhiên
          const district = (index % 12) + 1;
          const roomTitle = [
            `Phòng trọ cao cấp Quận ${district}`,
            `Căn hộ mini đầy đủ nội thất Quận ${district}`,
            `Phòng mới xây ngay trung tâm Quận ${district}`,
            `Phòng trọ giá rẻ sinh viên Quận ${district}`,
            `Studio apartment Quận ${district}`,
          ][index % 5];

          // Tạo địa chỉ
          const roomAddress = `${index + 100} Đường ${
            [
              "Lê Văn Sỹ",
              "Nguyễn Thị Minh Khai",
              "Phan Xích Long",
              "Lý Thường Kiệt",
              "Nguyễn Văn Trỗi",
            ][index % 5]
          }, Quận ${district}, TP.HCM`;

          // Ngẫu nhiên trạng thái phòng
          let status;
          if (index % 5 === 0) {
            status = "maintenance";
          } else if (index % 3 === 0) {
            status = "occupied";
          } else {
            status = "available";
          }

          // Ngẫu nhiên giá phòng
          const basePrice = 2000000 + (index % 10) * 500000;
          const price = basePrice + Math.floor(Math.random() * 1000000);

          // Có thể có hoặc không có giá giảm
          const hasDiscount = index % 4 === 0;
          const discountedPrice = hasDiscount ? price * 0.9 : null;

          // Tạo ngẫu nhiên tiện ích
          const facilities = [];
          const facilityCount = Math.floor(Math.random() * 7) + 2; // 2-8 tiện ích
          const usedFacilityIndices = new Set();

          for (let i = 0; i < facilityCount; i++) {
            let facilityIndex;
            do {
              facilityIndex = Math.floor(
                Math.random() * facilityOptions.length
              );
            } while (usedFacilityIndices.has(facilityIndex));

            usedFacilityIndices.add(facilityIndex);
            facilities.push({
              id: facilityOptions[facilityIndex].id,
              name: facilityOptions[facilityIndex].name,
              icon: facilityOptions[facilityIndex].icon,
            });
          }

          // Tạo ngẫu nhiên đánh giá
          const reviewCount = Math.floor(Math.random() * 50);
          const rating =
            reviewCount > 0 ? (3 + Math.random() * 2).toFixed(1) : 0;

          // Tạo mảng ảnh giả
          const imageCount = Math.floor(Math.random() * 4) + 1; // 1-5 ảnh
          const images = Array(imageCount)
            .fill()
            .map((_, imgIndex) => ({
              id: `img_${index}_${imgIndex}`,
              url: `https://example.com/room_${index}_${imgIndex}.jpg`,
              is_thumbnail: imgIndex === 0,
            }));

          return {
            id: index + 1,
            title: roomTitle,
            address: roomAddress,
            landlord_id: landlord.id,
            landlord_name: landlord.name,
            room_number: `${String.fromCharCode(65 + (index % 26))}${
              (index % 99) + 1
            }`,
            floor: Math.floor(Math.random() * 4) + 1,
            area: 20 + Math.floor(Math.random() * 30),
            price: price,
            discounted_price: discountedPrice,
            status: status,
            description: `Phòng trọ thoáng mát, sạch sẽ, có cửa sổ, đầy đủ tiện nghi cơ bản. Phù hợp cho ${
              1 + (index % 3)
            } người ở. Khu vực an ninh, gần trường học và chợ.`,
            facilities: facilities,
            images: images,
            rating: parseFloat(rating),
            review_count: reviewCount,
            current_views: Math.floor(Math.random() * 500),
            created_at: new Date(
              Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000
            ).toISOString(),
          };
        });

      setRooms(mockRooms);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc danh sách phòng theo điều kiện search và filter
  const filteredRooms = rooms.filter((room) => {
    // Tìm kiếm theo nhiều trường
    const matchesSearch =
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái
    const matchesStatus =
      filters.status === "all" || room.status === filters.status;

    // Lọc theo chủ trọ
    const matchesLandlord =
      filters.landlord === "all" ||
      room.landlord_id.toString() === filters.landlord;

    // Lọc theo khoảng giá
    let matchesPriceRange = true;
    const effectivePrice = room.discounted_price || room.price;

    if (filters.priceRange === "under2m") {
      matchesPriceRange = effectivePrice < 2000000;
    } else if (filters.priceRange === "2mto4m") {
      matchesPriceRange =
        effectivePrice >= 2000000 && effectivePrice <= 4000000;
    } else if (filters.priceRange === "4mto6m") {
      matchesPriceRange = effectivePrice > 4000000 && effectivePrice <= 6000000;
    } else if (filters.priceRange === "above6m") {
      matchesPriceRange = effectivePrice > 6000000;
    }

    return (
      matchesSearch && matchesStatus && matchesLandlord && matchesPriceRange
    );
  });

  // Sắp xếp phòng theo tiêu chí
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (filters.sortBy === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (filters.sortBy === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (filters.sortBy === "priceAsc") {
      const priceA = a.discounted_price || a.price;
      const priceB = b.discounted_price || b.price;
      return priceA - priceB;
    } else if (filters.sortBy === "priceDesc") {
      const priceA = a.discounted_price || a.price;
      const priceB = b.discounted_price || b.price;
      return priceB - priceA;
    } else if (filters.sortBy === "areaAsc") {
      return a.area - b.area;
    } else if (filters.sortBy === "areaDesc") {
      return b.area - a.area;
    } else if (filters.sortBy === "ratingDesc") {
      return b.rating - a.rating;
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = sortedRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(sortedRooms.length / roomsPerPage);

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
      landlord_id: "",
      room_number: "",
      floor: 1,
      area: 20,
      price: 2000000,
      discounted_price: null,
      status: "available",
      description: "",
      facilities: [],
      images: [],
    });
    setSelectedImages([]);
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
      landlord_id: room.landlord_id,
      room_number: room.room_number,
      floor: room.floor,
      area: room.area,
      price: room.price,
      discounted_price: room.discounted_price,
      status: room.status,
      description: room.description,
      facilities: [...room.facilities],
      images: [...room.images],
    });

    // Giả lập preview ảnh
    setImagePreview(
      room.images.map((img) => ({
        id: img.id,
        url: img.url,
        is_thumbnail: img.is_thumbnail,
      }))
    );

    setShowModal(true);
  };

  // Handler xem chi tiết phòng
  const handleViewRoom = (room) => {
    setDetailRoom(room);
    setShowDetailModal(true);
  };

  // Handler xóa phòng
  const handleDeleteRoom = (roomId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      setRooms(rooms.filter((room) => room.id !== roomId));
    }
  };

  // Handler cho việc thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler cho việc thay đổi số
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  // Handler thêm tiện ích
  const handleAddFacility = () => {
    if (!newFacility.name) {
      alert("Vui lòng nhập tên tiện ích!");
      return;
    }

    const facilityToAdd = {
      id: `temp_facility_${Date.now()}`,
      name: newFacility.name,
      icon: newFacility.icon || "default-icon",
    };

    setFormData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, facilityToAdd],
    }));

    // Reset form tiện ích
    setNewFacility({
      name: "",
      icon: "",
    });
  };

  // Handler xóa tiện ích
  const handleRemoveFacility = (facilityId) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter(
        (facility) => facility.id !== facilityId
      ),
    }));
  };

  // Handler cho việc chọn ảnh
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Giả lập upload ảnh
    const newImages = files.map((file, index) => {
      const imageId = `temp_img_${Date.now()}_${index}`;
      return {
        id: imageId,
        file: file,
        url: URL.createObjectURL(file),
        is_thumbnail: imagePreview.length === 0 && index === 0,
      };
    });

    setSelectedImages((prev) => [...prev, ...files]);
    setImagePreview((prev) => [...prev, ...newImages]);
  };

  // Handler xóa ảnh
  const handleRemoveImage = (imageId) => {
    setImagePreview((prev) => prev.filter((img) => img.id !== imageId));

    // Cập nhật formData.images nếu là ảnh đã lưu (khi editing)
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  // Handler đặt ảnh làm thumbnail
  const handleSetThumbnail = (imageId) => {
    setImagePreview((prev) =>
      prev.map((img) => ({
        ...img,
        is_thumbnail: img.id === imageId,
      }))
    );

    // Cập nhật formData.images (khi editing)
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img) => ({
        ...img,
        is_thumbnail: img.id === imageId,
      })),
    }));
  };

  // Handler lưu thông tin phòng
  const handleSaveRoom = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.title ||
      !formData.address ||
      !formData.landlord_id ||
      !formData.room_number
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Lấy thông tin chủ trọ
    const selectedLandlord = landlords.find(
      (landlord) => landlord.id === parseInt(formData.landlord_id)
    );

    // Cập nhật mảng ảnh từ preview
    const updatedImages = imagePreview.map((img) => ({
      id: img.id,
      url: img.url,
      is_thumbnail: img.is_thumbnail,
    }));

    if (modalMode === "add") {
      // Tạo phòng mới
      const newRoom = {
        id: rooms.length + 1,
        ...formData,
        landlord_name: selectedLandlord.name,
        images: updatedImages,
        rating: 0,
        review_count: 0,
        current_views: 0,
        created_at: new Date().toISOString(),
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
              landlord_name: selectedLandlord.name,
              images: updatedImages,
              updated_at: new Date().toISOString(),
            };
          }
          return room;
        })
      );
    }

    setShowModal(false);
  };

  // Handler xuất danh sách phòng
  const handleExportRooms = (format) => {
    console.log(`Xuất danh sách phòng dưới dạng ${format}`);
    // Trong thực tế, sẽ gọi API để tạo và tải file
    alert(`Đã tạo và tải xuống file ${format.toUpperCase()} danh sách phòng!`);
  };

  // Format giá phòng
  const formatPrice = (price) => {
    return price.toLocaleString() + " đ";
  };

  // Lấy màu trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "green";
      case "occupied":
        return "blue";
      case "maintenance":
        return "orange";
      default:
        return "gray";
    }
  };

  // Lấy text trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Còn trống";
      case "occupied":
        return "Đã thuê";
      case "maintenance":
        return "Đang sửa chữa";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý phòng trọ</h1>
        <p className="text-gray-600">
          Quản lý danh sách phòng trọ, thông tin và trạng thái phòng
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
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
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">
                Trạng thái:
              </label>
              <select
                name="status"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="available">Còn trống</option>
                <option value="occupied">Đã thuê</option>
                <option value="maintenance">Đang sửa chữa</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">
                Chủ trọ:
              </label>
              <select
                name="landlord"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.landlord}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả chủ trọ</option>
                {landlords.map((landlord) => (
                  <option key={landlord.id} value={landlord.id}>
                    {landlord.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">
                Khoảng giá:
              </label>
              <select
                name="priceRange"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.priceRange}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả giá</option>
                <option value="under2m">Dưới 2 triệu</option>
                <option value="2mto4m">2 - 4 triệu</option>
                <option value="4mto6m">4 - 6 triệu</option>
                <option value="above6m">Trên 6 triệu</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">
                Sắp xếp:
              </label>
              <select
                name="sortBy"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
                <option value="areaAsc">Diện tích tăng dần</option>
                <option value="areaDesc">Diện tích giảm dần</option>
                <option value="ratingDesc">Đánh giá cao nhất</option>
              </select>
            </div>

            {/* Nút thêm phòng */}
          </div>
        </div>
      </div>

      {/* Actions secondary */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-6 flex justify-end space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 whitespace-nowrap ml-auto"
          onClick={handleAddRoom}
        >
          <Plus size={16} className="mr-2" />
          Thêm phòng
        </button>
        <button
          onClick={() => handleExportRooms("excel")}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 flex items-center text-sm hover:bg-gray-50"
        >
          <Download size={14} className="mr-1.5" />
          Xuất Excel
        </button>
        <button
          onClick={() => handleExportRooms("pdf")}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 flex items-center text-sm hover:bg-gray-50"
        >
          <FileText size={14} className="mr-1.5" />
          Xuất PDF
        </button>
      </div>

      {/* Danh sách phòng */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : sortedRooms.length === 0 ? (
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
                    Thông tin cơ bản
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-14 w-14 mr-3 bg-gray-200 rounded-md overflow-hidden">
                          {room.images && room.images.length > 0 ? (
                            <img
                              src={
                                room.images.find((img) => img.is_thumbnail)
                                  ?.url || room.images[0].url
                              }
                              alt={room.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Home size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 mb-1">
                            {room.title}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-2">
                              {room.room_number}
                            </span>
                            {room.rating > 0 && (
                              <span className="flex items-center text-amber-500">
                                <Star size={12} className="mr-0.5" />
                                {room.rating}
                                <span className="text-gray-400 text-xs ml-1">
                                  ({room.review_count})
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900 mb-1">
                          <Layers size={14} className="mr-1.5" />
                          Tầng {room.floor}
                        </div>
                        <div className="flex items-center text-gray-900">
                          <Square size={14} className="mr-1.5" />
                          {room.area} m²
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Chủ trọ: {room.landlord_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin
                          size={14}
                          className="mr-1.5 flex-shrink-0 text-gray-500"
                        />
                        <span className="line-clamp-2">{room.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {room.discounted_price ? (
                          <>
                            <span className="text-red-600">
                              {formatPrice(room.discounted_price)}
                            </span>
                            <span className="text-xs text-gray-500 line-through ml-1">
                              {formatPrice(room.price)}
                            </span>
                          </>
                        ) : (
                          formatPrice(room.price)
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(room.price / room.area).toLocaleString()}{" "}
                        đ/m²
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(
                          room.status
                        )}-100 text-${getStatusColor(room.status)}-800`}
                      >
                        {getStatusText(room.status)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(room.created_at).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewRoom(room)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
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
                    {Math.min(indexOfLastRoom, sortedRooms.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{sortedRooms.length}</span>{" "}
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
                    <span className="sr-only">Previous</span>
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
                    <span className="sr-only">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết phòng */}
      {showDetailModal && detailRoom && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết phòng {detailRoom.room_number}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ảnh phòng */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Hình ảnh
                  </h3>
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    {detailRoom.images && detailRoom.images.length > 0 ? (
                      <div className="aspect-w-16 aspect-h-9 relative">
                        <img
                          src={
                            detailRoom.images.find((img) => img.is_thumbnail)
                              ?.url || detailRoom.images[0].url
                          }
                          alt={detailRoom.title}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <ImageIcon size={64} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Thumbnail gallery */}
                  {detailRoom.images && detailRoom.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {detailRoom.images.map((image, index) => (
                        <div
                          key={index}
                          className="h-16 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                        >
                          <img
                            src={image.url}
                            alt={`Ảnh ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thông tin cơ bản */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {detailRoom.title}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-start">
                        <MapPin
                          size={18}
                          className="text-gray-400 mr-2 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-900">
                          {detailRoom.address}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Mã phòng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailRoom.room_number}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Tầng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailRoom.floor}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Diện tích:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailRoom.area} m²
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Chủ trọ:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailRoom.landlord_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Trạng thái:
                        </span>
                        <span
                          className={`text-sm font-medium text-${getStatusColor(
                            detailRoom.status
                          )}-600`}
                        >
                          {getStatusText(detailRoom.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Ngày đăng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(detailRoom.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Lượt xem:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailRoom.current_views} lượt
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Đánh giá:
                        </span>
                        <span className="text-sm text-gray-900 flex items-center">
                          {detailRoom.rating > 0 ? (
                            <>
                              <Star size={14} className="text-amber-500 mr-1" />
                              {detailRoom.rating}/5 ({detailRoom.review_count}{" "}
                              đánh giá)
                            </>
                          ) : (
                            "Chưa có đánh giá"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Giá phòng */}
                  <h3 className="text-lg font-medium text-gray-900 mt-4 mb-3">
                    Thông tin giá
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Giá thuê:
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {detailRoom.discounted_price ? (
                          <>
                            {formatPrice(detailRoom.discounted_price)}
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(detailRoom.price)}
                            </span>
                          </>
                        ) : (
                          formatPrice(detailRoom.price)
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Đơn giá:{" "}
                      {Math.round(
                        detailRoom.price / detailRoom.area
                      ).toLocaleString()}{" "}
                      đ/m²
                    </div>
                  </div>

                  {/* Tiện ích */}
                  <h3 className="text-lg font-medium text-gray-900 mt-4 mb-3">
                    Tiện ích
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {detailRoom.facilities &&
                    detailRoom.facilities.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {detailRoom.facilities.map((facility, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-gray-700"
                          >
                            <CheckCircle
                              size={16}
                              className="text-green-500 mr-2"
                            />
                            {facility.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Chưa có thông tin tiện ích
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Mô tả
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {detailRoom.description || "Chưa có mô tả chi tiết"}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => handleExportRooms("pdf")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Xuất PDF
                </button>
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
                {/* Thông tin cơ bản */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3 pb-2 border-b">
                    Thông tin cơ bản
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu đề <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

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
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chủ trọ <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="landlord_id"
                        value={formData.landlord_id}
                        onChange={handleFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">-- Chọn chủ trọ --</option>
                        {landlords.map((landlord) => (
                          <option key={landlord.id} value={landlord.id}>
                            {landlord.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tầng
                        </label>
                        <input
                          type="number"
                          name="floor"
                          min="1"
                          value={formData.floor}
                          onChange={handleNumberChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Diện tích (m²)
                        </label>
                        <input
                          type="number"
                          name="area"
                          min="1"
                          value={formData.area}
                          onChange={handleNumberChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="available">Còn trống</option>
                        <option value="occupied">Đã thuê</option>
                        <option value="maintenance">Đang sửa chữa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Thông tin giá và hình ảnh */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3 pb-2 border-b">
                    Thông tin giá và hình ảnh
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá thuê (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        value={formData.price}
                        onChange={handleNumberChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá giảm (nếu có)
                      </label>
                      <input
                        type="number"
                        name="discounted_price"
                        min="0"
                        value={formData.discounted_price || ""}
                        onChange={handleNumberChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình ảnh
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Camera className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Tải ảnh lên</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                              />
                            </label>
                            <p className="pl-1">hoặc kéo thả</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF tối đa 10MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Preview ảnh đã chọn */}
                    {imagePreview.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ảnh đã chọn
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {imagePreview.map((image) => (
                            <div
                              key={image.id}
                              className="relative group border rounded-md overflow-hidden"
                            >
                              <img
                                src={image.url}
                                alt="Ảnh phòng"
                                className="h-20 w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => handleSetThumbnail(image.id)}
                                  className={`p-1 rounded-full mx-1 ${
                                    image.is_thumbnail
                                      ? "bg-green-500"
                                      : "bg-gray-700"
                                  } text-white`}
                                  title={
                                    image.is_thumbnail
                                      ? "Ảnh đại diện"
                                      : "Đặt làm ảnh đại diện"
                                  }
                                >
                                  <Star size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(image.id)}
                                  className="p-1 bg-red-600 rounded-full mx-1 text-white"
                                  title="Xóa ảnh"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              {image.is_thumbnail && (
                                <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1.5 py-0.5">
                                  Ảnh đại diện
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mô tả và tiện ích */}
                <div className="md:col-span-2">
                  <h3 className="text-base font-medium text-gray-900 mb-3 pb-2 border-b">
                    Mô tả và tiện ích
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả chi tiết về phòng..."
                      ></textarea>
                    </div>

                    {/* Phần tiện ích */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiện ích
                      </label>

                      {/* Danh sách tiện ích hiện tại */}
                      {formData.facilities.length > 0 ? (
                        <div className="mb-4 border rounded-md p-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {formData.facilities.map((facility) => (
                              <div
                                key={facility.id}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                              >
                                <span className="text-sm">{facility.name}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveFacility(facility.id)
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-4">
                          Chưa có tiện ích nào được thêm
                        </p>
                      )}

                      {/* Form thêm tiện ích mới */}
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Thêm tiện ích mới
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              placeholder="Tên tiện ích"
                              value={newFacility.name}
                              onChange={(e) =>
                                setNewFacility({
                                  ...newFacility,
                                  name: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={handleAddFacility}
                              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            >
                              <Plus size={16} className="inline mr-1" /> Thêm
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">
                            Hoặc chọn tiện ích có sẵn:
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {facilityOptions.map((facility) => (
                              <button
                                key={facility.id}
                                type="button"
                                onClick={() =>
                                  setNewFacility({
                                    name: facility.name,
                                    icon: facility.icon,
                                  })
                                }
                                className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-md hover:bg-gray-300"
                              >
                                {facility.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
    </div>
  );
};

export default AdminRoomsManagement;
